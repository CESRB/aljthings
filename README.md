# AJ's Closet & Things

A responsive secondhand storefront for one-of-one clothing, shoes, watches,
furniture, tools, and other finds.

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npx serve out
```

## Project structure

- `app/` — pages, CESRB Commerce checkout, and styling
- `lib/content.ts` — CESRB Content snapshot, Storefront, Lists, Blog, and Gallery adapters
- `lib/commerce.ts` — same-origin Pagesby Commerce cart and checkout adapter
- `lib/catalog.ts` — launch-preview listing data used only while no products are published
- `public/brand/` — AJ's Closet & Things logo assets
- `public/listings/` — sample product photography

Production content is owned by CESRB Content under the `aljthings` site. Published
products replace preview inventory automatically; published Lists, Gallery images,
Blog posts, and Site Content render without a code change. Checkout uses the
Pagesby same-origin `/_cesrb/commerce/*` gateway and redirects to the payment URL
returned by CESRB Commerce/Billing. Card data is never collected by this site.

The preview inventory is intentionally non-purchasable. Before customer launch,
complete Onboarding activation so Commerce provisions the store, configure at
least one shipping or pickup method, and publish real inventory in Content.

Built by [CESRB](https://tech.cesrb.com).
