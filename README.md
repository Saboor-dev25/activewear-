# Activewear Custom

Next.js App Router storefront with a MongoDB content API, Cloudinary image uploads, and session-protected admin tools. It deploys as one Node.js Next.js application on Vercel; no Express server is used.

The MongoDB Node.js driver requires Node.js 20.19.0 or newer; `package.json` declares that minimum. Vercel's current default Node.js runtime meets it. [MongoDB driver compatibility](https://www.mongodb.com/docs/drivers/compatibility/) · [Vercel Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)

## Backend layout

- `backend/models/`: content and admin document types.
- `backend/controllers/`: request-level content, auth, admin, and upload operations.
- `backend/services/`: MongoDB content persistence, password/session management, and Cloudinary operations.
- `backend/middleware/`: admin-session and same-origin request checks.
- `backend/validation/`: API payload validation and legacy browser-content parsing.
- `backend/config/`: lazy MongoDB and Cloudinary clients.
- `backend/routes/`: thin error-handling adapters used by the App Router handlers.
- `backend/utils/`: common HTTP errors and JSON helpers.
- `app/api/`: thin Next.js Route Handlers that call the backend controllers.
- `backend/data/`: existing demo content retained as the empty-database fallback and first-run migration source.

## Local setup

1. Install the project dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set the MongoDB Atlas and Cloudinary values. Create a database user with access only to the app database and allow the deployment/local IPs in the Atlas network access list.
3. Generate two unrelated secrets of at least 32 characters. For example, run `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"` twice. Use one for `SESSION_SECRET` and the other for `ADMIN_BOOTSTRAP_SECRET`.
4. Run `npm run dev`, visit `/admin`, choose **Set up the first admin account**, and enter the one-time `ADMIN_BOOTSTRAP_SECRET` along with the first admin email and a password of 8–12 characters. The bootstrap endpoint only works once per database. Passwords are stored as salted scrypt hashes.
5. Sign in. On the first admin session, the app imports the browser's existing `activewear-content-v1` content, filling only record IDs that are not already present in MongoDB. If no legacy browser content exists, it imports the demo content. The migration marker prevents duplicate imports, and repeated imports do not replace existing MongoDB records. Further browsers/users load the shared MongoDB content.
6. Once the first admin is created, rotate or remove `ADMIN_BOOTSTRAP_SECRET` from the environment. Add later admins from the **Admin users** tab.

The content API uses MongoDB collections `categories`, `products`, `companies`, `testimonials`, `faqs`, `admins`, and `sessions`, plus `app_metadata` for the one-time migration marker and `login_attempts` for sign-in throttling. Existing IDs are used as MongoDB `_id` values, so repeating a content save replaces records by ID instead of creating duplicates. Subcategories remain nested under their category to match the current UI and product relationships.

The API routes are `GET/PUT /api/content`, `POST /api/content/migrate`, `POST /api/auth/bootstrap`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `GET/POST /api/admin/users`, `DELETE /api/admin/users/delete`, and `POST /api/admin/upload`. Reads of public content are unauthenticated; all writes and admin operations require a valid HTTP-only session cookie. Unsafe requests require a same-origin `Origin` header. Sessions are signed with `SESSION_SECRET`, stored as hashes in MongoDB, and expire after seven days.

Cloudinary uploads are restricted to JPEG, PNG, WebP, and AVIF files up to 4 MB. Images are stored in `activewear/`, resized to a 2400px limit, and use automatic quality/format. A replaced or deleted image is removed only after the content update succeeds and only when no remaining content entry references that Cloudinary asset. Static assets under `public/`, including size-chart PDFs, remain local and are not uploaded or deleted.

## Environment variables

See `.env.example`. Set the same server-side variables in Vercel **Project Settings → Environment Variables** for each environment. Never prefix database, Cloudinary API secrets, bootstrap secrets, or session secrets with `NEXT_PUBLIC_`. `MONGODB_DB` and `NEXT_PUBLIC_SITE_URL` are optional; the Mongo database name can be included in `MONGODB_URI`.

## Checks

Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`. Live MongoDB, Cloudinary, migration, and session CRUD checks require valid external service credentials and are not run as part of a local build.
