import { GalleryViewer } from "@/components/products/GalleryViewer";

export default function GalleryPage() {
  return <main id="main-content" className="container-site section-padding"><header className="mb-10 max-w-2xl"><p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-brand">On the move</p><h1 className="heading-display">A little team inspiration.</h1><p className="mt-4 text-lg text-muted">A few snapshots of the people and moments that make custom gear worthwhile.</p></header><GalleryViewer /></main>;
}
