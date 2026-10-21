"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/backend/data/categories";
import type { FAQ } from "@/backend/data/faqs";
import type { Product } from "@/backend/data/products";
import type { Testimonial } from "@/backend/data/testimonials";
import { makeStableId, type Company, type ContentData } from "@/backend/data/content";
import { useContent } from "@/components/providers/ContentProvider";
import { demoContent } from "@/backend/data/content";

type ContentSection = keyof ContentData;
type Section = ContentSection | "subcategories" | "adminUsers";
type CategoryEntry = { category: Category; parent?: Category };
type ConfirmAction = { title: string; description: string; run: () => void };
type AdminUser = { id: string; email: string; createdAt: string };

const sectionNames: Record<Section, string> = {
  categories: "Categories",
  subcategories: "Subcategories",
  products: "Products",
  companies: "Companies",
  testimonials: "Testimonials",
  faqs: "FAQs",
  adminUsers: "Admin users",
};

const inputClass = "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-heading outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";
const buttonClass = "inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass = "inline-flex items-center justify-center rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-heading transition hover:bg-background-subtle";

function flattenCategories(items: Category[], parent?: Category): CategoryEntry[] {
  return items.flatMap((category) => [
    { category, parent },
    ...flattenCategories(category.subcategories ?? [], category),
  ]);
}

function imageSource(image: Category["image"] | Product["image"]): string {
  let source = (typeof image === "string" ? image : image?.src)?.trim().replaceAll("\\", "/");
  if (!source || source.startsWith("//")) return "";
  if (source.startsWith("/public/")) source = source.slice("/public".length);
  else if (source.startsWith("public/")) source = `/${source.slice("public/".length)}`;
  if (source.startsWith("/")) return source;
  if (!/^[a-z][a-z\d+.-]*:/i.test(source)) return `/${source}`;
  try {
    const parsed = new URL(source);
    return parsed.protocol === "https:" ? source : "";
  } catch {
    return "";
  }
}

function replaceCategory(items: Category[], id: string, next: Category): Category[] {
  return items.map((category) => category.id === id
    ? { ...next, subcategories: category.subcategories }
    : { ...category, subcategories: category.subcategories
      ? replaceCategory(category.subcategories, id, next)
      : undefined });
}

function removeCategory(items: Category[], id: string): Category[] {
  return items
    .filter((category) => category.id !== id)
    .map((category) => ({ ...category, subcategories: category.subcategories
      ? removeCategory(category.subcategories, id)
      : undefined }));
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-semibold text-heading"><span>{label}</span>{children}</label>;
}

function TextField({ label, value, onChange, placeholder, required = true }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <Field label={label}>
      <input
        className={inputClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </Field>
  );
}

function TextAreaField({ label, value, onChange, rows = 3 , required = false }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
}) {
  return <Field label={label}><textarea className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} rows={rows} required={required} /></Field>;
}

function ImageUploadField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  return <Field label="Upload image instead">
    <input
      className={inputClass}
      type="file"
      accept="image/jpeg,image/png,image/webp,image/avif"
      disabled={uploading}
      onChange={async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setUploading(true); setError("");
        try {
          const body = new FormData(); body.set("file", file);
          const response = await fetch("/api/admin/upload", { method: "POST", body });
          const result = await response.json() as { url?: string; error?: string };
          if (!response.ok || !result.url) throw new Error(result.error ?? "Image upload failed.");
          onChange(result.url);
        } catch (uploadError) {
          setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
        } finally {
          setUploading(false); event.target.value = "";
        }
      }}
    />
    <span className="text-xs text-muted">{uploading ? "Uploading and optimizing…" : value.startsWith("https://res.cloudinary.com/") ? "Cloudinary image ready" : "Uploading replaces the URL above. JPEG, PNG, WebP, or AVIF up to 4 MiB (4,194,304 bytes)."}</span>
    {error && <span role="alert" className="text-xs text-error">{error}</span>}
  </Field>;
}

function ConfirmDialog({ action, onCancel }: { action: ConfirmAction; onCancel: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 id="confirm-title" className="font-heading text-2xl font-bold">{action.title}</h2>
        <p className="mt-3 text-sm text-muted">{action.description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className={secondaryButtonClass} onClick={onCancel}>Cancel</button>
          <button
            type="button"
            className="rounded-lg bg-error px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            onClick={() => { action.run(); onCancel(); }}
          >
            Confirm
          </button>
        </div>
      </section>
    </div>
  );
}

export function AdminDashboard() {
  const { content, saveContent, restoreDemoContent, storageError, hydrated, refreshContent } = useContent();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [migrationMessage, setMigrationMessage] = useState("");
  const [section, setSection] = useState<Section>("categories");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const finishLogin = useCallback(async (nextAdmin: AdminUser) => {
    setAdmin(nextAdmin);
    setMigrationMessage("");
    try {
      const legacy = window.localStorage.getItem("activewear-content-v1");
      const response = await fetch("/api/content/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ legacy, demo: demoContent }),
      });
      const result = await response.json() as { result?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to import saved browser content.");
      if (result.result === "migrated" && legacy !== null) window.localStorage.removeItem("activewear-content-v1");
      if (result.result === "already-initialized" && legacy !== null) {
        setMigrationMessage("The shared site already has content. This browser’s saved copy was left in place and was not imported.");
      }
    } catch (migrationError) {
      setMigrationMessage(migrationError instanceof Error ? migrationError.message : "Could not migrate browser content.");
    }
    await refreshContent();
  }, [refreshContent]);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() as Promise<{ admin: AdminUser | null }> : { admin: null })
      .then(({ admin: current }) => {
        if (current) void finishLogin(current);
      })
      .catch(() => setAdmin(null))
      .finally(() => setCheckingAuth(false));
  }, [finishLogin]);

  if (checkingAuth) return <main className="mx-auto max-w-lg px-4 py-16"><p className="text-sm text-muted">Checking admin session…</p></main>;
  if (!admin) return <AdminLogin onLogin={finishLogin} />;

  return <main id="main-content" className="min-h-screen bg-background-subtle">
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Activewear Custom</p>
          <h1 className="mt-1 font-heading text-3xl font-extrabold text-heading sm:text-4xl">Content dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className={secondaryButtonClass}>View website ↗</Link>
          <span className="hidden text-sm text-muted sm:inline">{admin.email}</span>
          <button type="button" className={secondaryButtonClass} onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); setAdmin(null); }}>Sign out</button>
          <button
            type="button"
            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-error hover:bg-red-50"
            onClick={() => setConfirmAction({
              title: "Restore demo content?",
              description: "This replaces your current browser content with the original demo data. This cannot be undone.",
              run: restoreDemoContent,
            })}
          >
            Restore demo data
          </button>
        </div>
      </header>
      {storageError && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">{storageError}</div>}
      {migrationMessage && <div role="status" className="mb-5 rounded-lg border border-brand-border bg-brand-soft px-4 py-3 text-sm text-heading">{migrationMessage}</div>}
      {!hydrated && <div className="mb-5 rounded-lg border border-brand-border bg-brand-soft px-4 py-3 text-sm text-heading">Loading saved content…</div>}
      <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-border bg-white p-3 shadow-sm lg:sticky lg:top-5 lg:h-fit">
          <nav aria-label="Admin sections" className="flex gap-2 overflow-x-auto lg:grid">
            {(Object.keys(sectionNames) as Section[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSection(key)}
                className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${section === key ? "bg-brand-soft text-brand" : "text-muted hover:bg-background-subtle hover:text-heading"}`}
              >
                {sectionNames[key]}
                <span className="float-right ml-4 text-xs opacity-70">{key === "subcategories" ? content.categories.reduce((count, item) => count + (item.subcategories?.length ?? 0), 0) : key === "adminUsers" ? "" : content[key].length}</span>
              </button>
            ))}
          </nav>
          <div className="mt-4 hidden rounded-xl bg-background-subtle p-3 text-xs leading-relaxed text-muted lg:block">Changes are saved securely to the shared site content.</div>
        </aside>
        <section className="min-w-0 rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
          {section === "categories" && <CategoryManager content={content} saveContent={saveContent} requestConfirm={setConfirmAction} />}
          {section === "subcategories" && <CategoryManager content={content} saveContent={saveContent} requestConfirm={setConfirmAction} subcategoriesOnly />}
          {section === "products" && <ProductManager content={content} saveContent={saveContent} requestConfirm={setConfirmAction} />}
          {section === "companies" && <SimpleManager kind="companies" content={content} saveContent={saveContent} requestConfirm={setConfirmAction} />}
          {section === "testimonials" && <SimpleManager kind="testimonials" content={content} saveContent={saveContent} requestConfirm={setConfirmAction} />}
          {section === "faqs" && <SimpleManager kind="faqs" content={content} saveContent={saveContent} requestConfirm={setConfirmAction} />}
          {section === "adminUsers" && <AdminUserManager currentAdmin={admin} requestConfirm={setConfirmAction} />}
        </section>
      </div>
    </div>
    {confirmAction && <ConfirmDialog action={confirmAction} onCancel={() => setConfirmAction(null)} />}
  </main>;
}

function CategoryManager({ content, saveContent, requestConfirm, subcategoriesOnly = false }: {
  content: ContentData;
  saveContent: (next: ContentData) => void;
  requestConfirm: (action: ConfirmAction) => void;
  subcategoriesOnly?: boolean;
}) {
  const allEntries = useMemo(() => flattenCategories(content.categories), [content.categories]);
  const entries = useMemo(() => {
    return subcategoriesOnly ? allEntries.filter((entry) => Boolean(entry.parent)) : allEntries.filter((entry) => !entry.parent);
  }, [allEntries, subcategoriesOnly]);
  const [editId, setEditId] = useState<string | null>(null);
  const [parentSlug, setParentSlug] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [eyebrow, setEyebrow] = useState("");
  const [error, setError] = useState("");

  function resetForm() {
    setEditId(null); setParentSlug(""); setName(""); setSlug(""); setDescription(""); setImage(""); setEyebrow(""); setError("");
  }

  function editCategory(entry: CategoryEntry) {
    const item = entry.category;
    setEditId(item.id ?? null); setParentSlug(entry.parent?.slug ?? ""); setName(item.name); setSlug(item.slug);
    setDescription(item.description); setImage(imageSource(item.image)); setEyebrow(item.eyebrow); setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedSlug = slug.trim().toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) { setError("Use lowercase letters, numbers, and hyphens for the slug."); return; }
    if (subcategoriesOnly && !parentSlug) { setError("Choose the parent category for this subcategory."); return; }
    if (allEntries.some(({ category }) => category.slug === normalizedSlug && category.id !== editId)) { setError("That category slug is already in use."); return; }
    const editingEntry = entries.find(({ category }) => category.id === editId);
    if (editingEntry && !editingEntry.parent && parentSlug) { setError("Top-level categories cannot be moved under another category while editing."); return; }
    const id = editId ?? makeStableId(parentSlug ? "subcategory" : "category");
    const nextCategory: Category = { id, slug: normalizedSlug, name: name.trim(), description: description.trim(), image: image.trim(), eyebrow: eyebrow.trim() };
    let nextCategories = content.categories;
    if (editId) {
      nextCategories = replaceCategory(nextCategories, editId, nextCategory);
      if (editingEntry && (editingEntry.parent?.slug ?? "") !== parentSlug) {
        nextCategories = removeCategory(nextCategories, editId);
        nextCategories = nextCategories.map((root) => root.slug === parentSlug
          ? { ...root, subcategories: [...(root.subcategories ?? []), nextCategory] }
          : root);
      }
    } else if (parentSlug) {
      nextCategories = nextCategories.map((root) => root.slug === parentSlug
        ? { ...root, subcategories: [...(root.subcategories ?? []), nextCategory] }
        : root);
    } else {
      nextCategories = [...content.categories, nextCategory];
    }

    let nextProducts = content.products;
    if (editingEntry && editingEntry.category.slug !== normalizedSlug) {
      nextProducts = content.products.map((product) => {
        if (!editingEntry.parent && product.categorySlug === editingEntry.category.slug) return { ...product, categorySlug: normalizedSlug };
        if (editingEntry.parent && product.subcategorySlug === editingEntry.category.slug) return { ...product, subcategorySlug: normalizedSlug };
        return product;
      });
    }
    saveContent({ ...content, categories: nextCategories, products: nextProducts });
    resetForm();
  }

  function removeEntry(entry: CategoryEntry) {
    const categoryId = entry.category.id;
    if (entry.category.subcategories?.length) { setError("Remove this category’s subcategories before deleting it."); return; }
    const hasProducts = content.products.some((product) => entry.parent
      ? product.categorySlug === entry.parent.slug && product.subcategorySlug === entry.category.slug
      : product.categorySlug === entry.category.slug);
    if (hasProducts) { setError("Move or delete the products in this category before deleting it."); return; }
    requestConfirm({
      title: `Delete ${entry.category.name}?`,
      description: "This category will be removed from navigation and the website.",
      run: () => { if (categoryId) saveContent({ ...content, categories: removeCategory(content.categories, categoryId) }); },
    });
  }

  return <div>
    <SectionHeading title={subcategoriesOnly ? "Subcategories" : "Categories"} description={subcategoriesOnly ? "Manage nested collections and their product relationships." : "Organize top-level collections and keep product relationships intact."} />
    <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid content-start gap-3">
        {entries.map((entry) => (
          <article key={entry.category.id ?? entry.category.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-background-muted">
                {imageSource(entry.category.image) && <Image src={imageSource(entry.category.image)} alt="" fill className="object-cover" />}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-heading">
                  {entry.parent && <span className="text-muted">{entry.parent.name} / </span>}
                  {entry.category.name}
                </p>
                <p className="truncate text-xs text-muted">/categories/{entry.category.slug}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" className={secondaryButtonClass} onClick={() => editCategory(entry)}>Edit</button>
              <button type="button" className="rounded-lg px-3 py-2 text-sm font-semibold text-error hover:bg-red-50" onClick={() => removeEntry(entry)}>Delete</button>
            </div>
          </article>
        ))}
        {entries.length === 0 && <EmptyState label="No categories yet. Create one to get started." />}
      </div>
      <form className="grid content-start gap-4 rounded-xl bg-background-subtle p-4" onSubmit={handleSubmit}>
        <h3 className="font-heading text-xl font-bold">{editId ? "Edit category" : "Add a category"}</h3>
        <Field label="Parent category">
          <select
            className={inputClass}
            value={parentSlug}
            onChange={(event) => setParentSlug(event.target.value)}
            disabled={Boolean(editId && !entries.find(({ category }) => category.id === editId)?.parent)}
            required={subcategoriesOnly}
          >
            <option value="">Top-level category</option>
            {content.categories.map((item) => <option key={item.id ?? item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </Field>
        <TextField label="Name" value={name} onChange={setName} placeholder="Training Tops" />
        <TextField label="URL slug" value={slug} onChange={setSlug} placeholder="training-tops" />
        <TextAreaField label="Description" value={description} onChange={setDescription} />
        <TextField label="Image URL or /public path" value={image} onChange={setImage} placeholder="/images/category.jpg" />
        {imageSource(image) && <div className="relative aspect-video overflow-hidden rounded-lg bg-background-muted"><Image src={imageSource(image)} alt="Category image preview" fill className="object-cover" /></div>}
        <ImageUploadField value={image} onChange={setImage} />
        <TextField label="Eyebrow" value={eyebrow} onChange={setEyebrow} placeholder="Move with purpose" />
        {error && <p role="alert" className="text-sm text-error">{error}</p>}
        <div className="flex gap-2">
          <button className={buttonClass} type="submit">{editId ? "Save category" : "Add category"}</button>
          {editId && <button className={secondaryButtonClass} type="button" onClick={resetForm}>Cancel</button>}
        </div>
        <p className="text-xs leading-relaxed text-muted">Subcategories use the top-level category as their product category. Slugs must be unique.</p>
      </form>
    </div>
  </div>;
}

function ProductManager({ content, saveContent, requestConfirm }: {
  content: ContentData;
  saveContent: (next: ContentData) => void;
  requestConfirm: (action: ConfirmAction) => void;
}) {
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categorySlug, setCategorySlug] = useState(content.categories[0]?.slug ?? "");
  const [subcategorySlug, setSubcategorySlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [sizeChart, setSizeChart] = useState("");
  const [sizes, setSizes] = useState("XS, S, M, L, XL, 2XL");
  const [materials, setMaterials] = useState("");
  const [features, setFeatures] = useState("");
  const [error, setError] = useState("");
  const selectedCategory = content.categories.find((item) => item.slug === categorySlug);

  function resetForm() {
    setEditId(null); setName(""); setSlug(""); setCategorySlug(content.categories[0]?.slug ?? ""); setSubcategorySlug("");
    setDescription(""); setImage(""); setSizeChart(""); setSizes("XS, S, M, L, XL, 2XL"); setMaterials(""); setFeatures(""); setError("");
  }

  function editProduct(product: Product) {
    setEditId(product.id ?? null); setName(product.name); setSlug(product.slug); setCategorySlug(product.categorySlug);
    setSubcategorySlug(product.subcategorySlug ?? ""); setDescription(product.description); setImage(imageSource(product.image));
    setSizeChart(product.sizeChart ?? ""); setSizes(product.sizes.join(", ")); setMaterials(product.materials);
    setFeatures(product.features.join(", ")); setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedSlug = slug.trim().toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) { setError("Use lowercase letters, numbers, and hyphens for the slug."); return; }
    if (content.products.some((item) => item.slug === normalizedSlug && item.id !== editId)) { setError("That product slug is already in use."); return; }
    if (!content.categories.some((item) => item.slug === categorySlug)) { setError("Choose a valid parent category."); return; }
    if (subcategorySlug && !selectedCategory?.subcategories?.some((item) => item.slug === subcategorySlug)) {
      setError("Choose a subcategory belonging to the selected parent.");
      return;
    }
    const product: Product = {
      id: editId ?? makeStableId("product"), slug: normalizedSlug, categorySlug,
      ...(subcategorySlug ? { subcategorySlug } : {}), name: name.trim(), description: description.trim(), image: image.trim(),
      ...(sizeChart.trim() ? { sizeChart: sizeChart.trim() } : {}),
      sizes: sizes.split(",").map((value) => value.trim()).filter(Boolean),
      materials: materials.trim(), features: features.split(",").map((value) => value.trim()).filter(Boolean),
    };
    const nextProducts = editId
      ? content.products.map((item) => item.id === editId ? product : item)
      : [...content.products, product];
    saveContent({ ...content, products: nextProducts });
    resetForm();
  }

  function deleteProduct(product: Product) {
    requestConfirm({
      title: `Delete ${product.name}?`,
      description: "This product will be removed from public collections.",
      run: () => saveContent({
        ...content,
        products: content.products.filter((item) => item.id !== product.id),
      }),
    });
  }

  return <div>
    <SectionHeading title="Products" description="Manage product details, images, sizes, features, and collection links." />
    <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="grid content-start gap-3">
        {content.products.map((product) => (
          <article key={product.id ?? product.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-background-muted">
                {imageSource(product.image) && <Image src={imageSource(product.image)} alt="" fill className="object-cover" />}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-heading">{product.name}</p>
                <p className="truncate text-xs text-muted">
                  {product.categorySlug}{product.subcategorySlug ? ` / ${product.subcategorySlug}` : ""}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" className={secondaryButtonClass} onClick={() => editProduct(product)}>Edit</button>
              <button type="button" className="rounded-lg px-3 py-2 text-sm font-semibold text-error hover:bg-red-50" onClick={() => deleteProduct(product)}>Delete</button>
            </div>
          </article>
        ))}
        {content.products.length === 0 && <EmptyState label="No products yet. Add a product to show it on the website." />}
      </div>
      <form className="grid content-start gap-4 rounded-xl bg-background-subtle p-4" onSubmit={handleSubmit}>
        <h3 className="font-heading text-xl font-bold">{editId ? "Edit product" : "Add a product"}</h3>
        <TextField label="Name" value={name} onChange={setName} placeholder="Custom Training Tee" />
        <TextField label="URL slug" value={slug} onChange={setSlug} placeholder="custom-training-tee" />
        <Field label="Category">
          <select
            className={inputClass}
            value={categorySlug}
            onChange={(event) => { setCategorySlug(event.target.value); setSubcategorySlug(""); }}
            required
          >
            <option value="">Select category</option>
            {content.categories.map((category) => <option key={category.id ?? category.slug} value={category.slug}>{category.name}</option>)}
          </select>
        </Field>
        <Field label="Subcategory">
          <select
            className={inputClass}
            value={subcategorySlug}
            onChange={(event) => setSubcategorySlug(event.target.value)}
            disabled={!selectedCategory?.subcategories?.length}
          >
            <option value="">No subcategory</option>
            {selectedCategory?.subcategories?.map((category) => <option key={category.id ?? category.slug} value={category.slug}>{category.name}</option>)}
          </select>
        </Field>
        <TextAreaField label="Description" value={description} onChange={setDescription} required={false} />
        <TextField label="Image URL or /public path" value={image} onChange={setImage} required={false} placeholder="/images/product.jpg" />
        <ImageUploadField value={image} onChange={setImage} />
        <TextField label="Size chart path (optional)" value={sizeChart} onChange={setSizeChart} required={false} />
        <TextField label="Sizes (comma separated)" value={sizes} onChange={setSizes} required={false} />
        <TextField label="Materials" value={materials} onChange={setMaterials} required={false}/>
        <TextAreaField label="Features (comma separated)" value={features} onChange={setFeatures} required={false} />
        {error && <p role="alert" className="text-sm text-error">{error}</p>}
        <div className="flex gap-2">
          <button className={buttonClass} type="submit">{editId ? "Save product" : "Add product"}</button>
          {editId && <button className={secondaryButtonClass} type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>
    </div>
  </div>;
}

type SimpleKind = "companies" | "testimonials" | "faqs";
type SimpleRecord = Company | Testimonial | FAQ;

function SimpleManager({ kind, content, saveContent, requestConfirm }: {
  kind: SimpleKind;
  content: ContentData;
  saveContent: (next: ContentData) => void;
  requestConfirm: (action: ConfirmAction) => void;
}) {
  const [editId, setEditId] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const records = content[kind] as SimpleRecord[];
  const fieldNames = kind === "companies" ? ["name", "label", "monogram"]
    : kind === "testimonials" ? ["quote", "name", "company"] : ["question", "answer"];
  const title = sectionNames[kind];
  const singularTitle = kind === "companies" ? "company" : kind === "testimonials" ? "testimonial" : "FAQ";

  function startEdit(item: SimpleRecord) {
    const values: Record<string, string> = {};
    for (const field of fieldNames) values[field] = String((item as unknown as Record<string, unknown>)[field] ?? "");
    setFields(values); setEditId(item.id ?? null); setError("");
  }

  function resetForm() { setFields({}); setEditId(null); setError(""); }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fieldNames.some((field) => !fields[field]?.trim())) { setError("Complete all required fields."); return; }
    const record = { id: editId ?? makeStableId(singularTitle.toLowerCase()), ...Object.fromEntries(fieldNames.map((field) => [field, fields[field].trim()])) } as SimpleRecord;
    const nextRows = editId ? records.map((item) => item.id === editId ? record : item) : [...records, record];
    saveContent({ ...content, [kind]: nextRows });
    resetForm();
  }

  function deleteRecord(item: SimpleRecord) {
    requestConfirm({
      title: `Delete ${singularTitle}?`,
      description: "This entry will be removed from the website.",
      run: () => saveContent({
        ...content,
        [kind]: records.filter((record) => record.id !== item.id),
      }),
    });
  }

  return <div>
    <SectionHeading title={title} description={`Add, edit, or remove ${title.toLowerCase()} shown on the public website.`} />
    <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid content-start gap-3">
        {records.map((item) => (
          <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-heading">
              {kind === "companies" && `${(item as Company).name} ${(item as Company).label}`}
              {kind === "testimonials" && `“${(item as Testimonial).quote}” — ${(item as Testimonial).name}`}
              {kind === "faqs" && (item as FAQ).question}
            </p>
            <div className="flex gap-2">
              <button type="button" className={secondaryButtonClass} onClick={() => startEdit(item)}>Edit</button>
              <button type="button" className="rounded-lg px-3 py-2 text-sm font-semibold text-error hover:bg-red-50" onClick={() => deleteRecord(item)}>Delete</button>
            </div>
          </article>
        ))}
        {records.length === 0 && <EmptyState label={`No ${title.toLowerCase()} yet.`} />}
      </div>
      <form className="grid content-start gap-4 rounded-xl bg-background-subtle p-4" onSubmit={handleSubmit}>
        <h3 className="font-heading text-xl font-bold">{editId ? `Edit ${singularTitle.toLowerCase()}` : `Add ${singularTitle.toLowerCase()}`}</h3>
        {fieldNames.map((field) => {
          const label = field[0].toUpperCase() + field.slice(1);
          const value = fields[field] ?? "";
          const onChange = (nextValue: string) => setFields((current) => ({ ...current, [field]: nextValue }));
          if ((kind === "testimonials" && field === "quote") || (kind === "faqs" && field === "answer")) {
            return <TextAreaField key={field} label={label} value={value} onChange={onChange} rows={4} />;
          }
          return <TextField key={field} label={label} value={value} onChange={onChange} />;
        })}
        {error && <p role="alert" className="text-sm text-error">{error}</p>}
        <div className="flex gap-2">
          <button className={buttonClass} type="submit">{editId ? "Save changes" : `Add ${singularTitle.toLowerCase()}`}</button>
          {editId && <button className={secondaryButtonClass} type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>
    </div>
  </div>;
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <header className="border-b border-border pb-5">
      <h2 className="font-heading text-2xl font-bold text-heading">{title}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </header>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">{label}</div>;
}

function AdminLogin({ onLogin }: { onLogin: (admin: AdminUser) => Promise<void> }) {
  const [creating, setCreating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bootstrapSecret, setBootstrapSecret] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      if (creating) {
        const setup = await fetch("/api/auth/bootstrap", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-bootstrap-secret": bootstrapSecret },
          body: JSON.stringify({ email, password }),
        });
        const payload = await setup.json() as { error?: string };
        if (!setup.ok) throw new Error(payload.error ?? "Could not create the first admin account.");
      }
      const response = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }),
      });
      const result = await response.json() as { admin?: AdminUser; error?: string };
      if (!response.ok || !result.admin) throw new Error(result.error ?? "Sign in failed.");
      await onLogin(result.admin);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Sign in failed.");
    } finally { setBusy(false); }
  }

  return <main id="main-content" className="grid min-h-[70vh] place-items-center bg-background-subtle px-4 py-12">
    <form onSubmit={handleSubmit} className="grid w-full max-w-md gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Activewear Custom</p><h1 className="mt-1 font-heading text-3xl font-extrabold text-heading">{creating ? "Create first admin" : "Admin sign in"}</h1></div>
      <TextField label="Email" value={email} onChange={setEmail} placeholder="admin@example.com" />
      <Field label="Password"><div className="relative"><input className={`${inputClass} pr-16`} type={showPassword ? "text" : "password"} autoComplete={creating ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={12} required /><button type="button" className="absolute inset-y-0 right-3 text-sm font-semibold text-brand" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Hide" : "Show"}</button></div>{creating && <span className="mt-1 block text-xs text-muted">Use 8–12 characters.</span>}</Field>
      {creating && <Field label="One-time setup secret"><input className={inputClass} type="password" autoComplete="off" value={bootstrapSecret} onChange={(event) => setBootstrapSecret(event.target.value)} required /></Field>}
      {error && <p role="alert" className="text-sm text-error">{error}</p>}
      <button type="submit" disabled={busy} className={buttonClass}>{busy ? "Please wait…" : creating ? "Create account and sign in" : "Sign in"}</button>
      <button type="button" className="text-sm font-semibold text-brand hover:underline" onClick={() => { setCreating((value) => !value); setError(""); }}>{creating ? "Back to sign in" : "Set up the first admin account"}</button>
    </form>
  </main>;
}

function AdminUserManager({ currentAdmin, requestConfirm }: { currentAdmin: AdminUser; requestConfirm: (action: ConfirmAction) => void }) {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadAdmins() {
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const payload = await response.json() as { admins?: AdminUser[]; error?: string };
    if (!response.ok || !payload.admins) throw new Error(payload.error ?? "Unable to load admin users.");
    setAdmins(payload.admins);
  }

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/users", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json() as { admins?: AdminUser[]; error?: string };
        if (!response.ok || !payload.admins) throw new Error(payload.error ?? "Unable to load admin users.");
        if (mounted) setAdmins(payload.admins);
      })
      .catch((loadError: unknown) => { if (mounted) setError(loadError instanceof Error ? loadError.message : "Unable to load admin users."); });
    return () => { mounted = false; };
  }, []);

  async function addUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const response = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to create admin user.");
      setEmail(""); setPassword(""); await loadAdmins();
    } catch (createError) { setError(createError instanceof Error ? createError.message : "Unable to create admin user."); }
    finally { setBusy(false); }
  }

  function removeUser(user: AdminUser) {
    requestConfirm({
      title: `Remove ${user.email}?`, description: "This account will lose access to the admin dashboard.",
      run: () => { void fetch("/api/admin/users/delete", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: user.id }) }).then(async (response) => {
        const payload = await response.json() as { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Unable to remove admin account.");
        await loadAdmins();
      }).catch((removeError: unknown) => setError(removeError instanceof Error ? removeError.message : "Unable to remove admin account.")); },
    });
  }

  return <div>
    <SectionHeading title="Admin users" description="Add and remove accounts that can manage site content." />
    <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid content-start gap-3">{admins.map((user) => <article key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"><div><p className="font-semibold text-heading">{user.email}{user.id === currentAdmin.id ? " (you)" : ""}</p><p className="text-xs text-muted">Added {new Date(user.createdAt).toLocaleDateString()}</p></div><button type="button" disabled={user.id === currentAdmin.id} className="rounded-lg px-3 py-2 text-sm font-semibold text-error hover:bg-red-50 disabled:opacity-40" onClick={() => removeUser(user)}>Remove</button></article>)}</div>
      <form className="grid content-start gap-4 rounded-xl bg-background-subtle p-4" onSubmit={addUser}><h3 className="font-heading text-xl font-bold">Add an admin user</h3><TextField label="Email" value={email} onChange={setEmail} placeholder="admin@example.com" /><Field label="Password"><div className="relative"><input className={`${inputClass} pr-16`} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={12} autoComplete="new-password" required /><button type="button" className="absolute inset-y-0 right-3 text-sm font-semibold text-brand" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Hide" : "Show"}</button></div></Field><p className="text-xs text-muted">Use 8–12 characters. Share the password securely; the app stores only a salted hash.</p><button className={buttonClass} disabled={busy} type="submit">{busy ? "Adding…" : "Add admin"}</button></form>
    </div>
    {error && <p className="mt-4 text-sm text-error" role="alert">{error}</p>}
  </div>;
}
