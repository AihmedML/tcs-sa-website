# Cloudflare Pages Deployment

Deploy this site as a static Vite project on Cloudflare Pages.

## Cloudflare Pages Settings

- Platform: Cloudflare Pages
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`
- Root directory: leave blank unless the project is inside a subfolder
- Node version: Cloudflare default is fine for this project

## If Cloudflare Shows The Worker Flow

Cloudflare may show the newer Workers deployment screen with:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

This is also supported. The repository includes `wrangler.jsonc`, which tells Cloudflare to deploy the built static files from `dist/` as Worker static assets.

## Deploy From Git

1. Push this project to a GitHub or GitLab repository.
2. In Cloudflare, open **Workers & Pages**.
3. Select **Create application**.
4. Select **Pages**.
5. Select **Connect to Git**.
6. Choose the repository for this site.
7. Use these build settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
8. Select **Save and Deploy**.
9. Wait for the deployment to finish and open the generated `*.pages.dev` URL.

## Custom Domains

After the Pages deployment works:

1. Open the Pages project in Cloudflare.
2. Go to **Custom domains**.
3. Select **Set up a domain**.
4. Add `tcs.sa`.
5. Add `www.tcs.sa`.
6. If `tcs.sa` is managed in Cloudflare DNS, Cloudflare will create the required DNS records automatically.
7. If DNS is managed outside Cloudflare, add the CNAME records Cloudflare shows during setup.
8. Wait for SSL/status to become active for both custom domains.

## Production Checks

Run these locally before deploying:

```bash
npm install
npm run build
npm run test:smoke
```

The generated production files are in `dist/`. Do not commit `dist/`; Cloudflare builds it during deployment.

## Notes

- The site is Arabic RTL through `<html lang="ar" dir="rtl">`.
- Static assets are referenced from `/assets/...`, which Cloudflare Pages serves from the built `dist` output.
- SEO files included for production: `robots.txt`, `sitemap.xml`, canonical metadata, Open Graph metadata, and favicon metadata.
- Cloudflare Pages support files included: `_headers` for basic security headers and `_redirects` so old section URLs such as `/packages` land on the matching one-page section.
