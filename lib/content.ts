export const CONTENT_ORIGIN = "https://content.cesrb.com";
export const CONTENT_SITE = "aljthings";

export type ContentProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  currency: string;
  category: string | null;
  availability: "available" | "sold" | "hidden";
  featured: boolean;
  images: Array<{ url: string; alt_text: string }>;
};

export type ContentSnapshot = {
  content: Record<string, unknown>;
  storefront?: { products?: ContentProduct[] };
};

export function contentMediaUrl(path: string | undefined) {
  return path ? new URL(path, CONTENT_ORIGIN).href : "/brand/aj-monogram-spaced.png";
}

export async function loadContent(signal?: AbortSignal): Promise<ContentSnapshot> {
  const response = await fetch(
    `${CONTENT_ORIGIN}/public/v1/sites/${CONTENT_SITE}/snapshot?frontend=2`,
    { cache: "no-store", signal },
  );
  if (!response.ok) throw new Error(`content_${response.status}`);
  return response.json() as Promise<ContentSnapshot>;
}

export function contentText(
  content: Record<string, unknown>,
  key: string,
  fallback: string,
) {
  const value = content[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function contentProductToListing(product: ContentProduct) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category || "Current find",
    price: product.price_cents / 100,
    condition: "See listing details",
    fulfillment: "both" as const,
    status: product.availability === "sold" ? ("sold" as const) : ("available" as const),
    art: "photo",
    image: contentMediaUrl(product.images?.[0]?.url),
    description: product.description || "See the current listing for details.",
    details: product.description ? [product.description] : [],
  };
}
