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
  commerce?: {
    productId: string;
    publishedRevisionId: string;
    variantId: string;
    variantRevision: string;
  };
};

export type ContentCollection = {
  key: string;
  name: string;
  description?: string;
  items?: Array<{ id: string; values: Record<string, unknown> }>;
};

export type ContentPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  published_at?: string;
  featured_image?: { url: string; alt_text: string } | null;
};

export type GalleryItem = {
  id: string;
  title?: string;
  caption?: string;
  alt_text: string;
  url: string;
};

export type ContentSnapshot = {
  content: Record<string, unknown>;
  storefront?: { products?: ContentProduct[] };
  collections?: ContentCollection[];
  blog?: ContentPost[];
};

export function contentMediaUrl(path: string | undefined) {
  return path ? new URL(path, CONTENT_ORIGIN).href : "/brand/aj-monogram-spaced.png";
}

export function contentImage(
  content: Record<string, unknown>,
  key: string,
  fallback: string,
) {
  const value = content[key];
  if (value && typeof value === "object" && "url" in value) {
    const image = value as { url?: unknown; alt_text?: unknown };
    if (typeof image.url === "string" && image.url) {
      return {
        url: contentMediaUrl(image.url),
        alt: typeof image.alt_text === "string" ? image.alt_text : "",
      };
    }
  }
  return { url: fallback, alt: "" };
}

export async function loadContent(
  signal?: AbortSignal,
  cache: RequestCache = "no-store",
): Promise<ContentSnapshot> {
  const response = await fetch(
    `${CONTENT_ORIGIN}/public/v1/sites/${CONTENT_SITE}/snapshot?frontend=2`,
    { cache, signal },
  );
  if (!response.ok) throw new Error(`content_${response.status}`);
  return response.json() as Promise<ContentSnapshot>;
}

export async function loadGallery(signal?: AbortSignal): Promise<GalleryItem[]> {
  const response = await fetch(
    `${CONTENT_ORIGIN}/public/v1/sites/${CONTENT_SITE}/gallery`,
    { cache: "no-store", signal },
  );
  if (response.status === 403 || response.status === 404) return [];
  if (!response.ok) throw new Error(`gallery_${response.status}`);
  const payload = await response.json() as { gallery?: GalleryItem[] };
  return payload.gallery || [];
}

export function contentText(
  content: Record<string, unknown>,
  key: string,
  fallback: string,
) {
  const value = content[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function productDescriptionParts(description: string | undefined) {
  const raw = description?.trim() || "";
  const condition = raw.match(/\bCondition:\s*(.*?)(?=\.\s+(?:Example status|Fulfillment|Details):|$)/i)?.[1]?.trim();
  const fulfillmentText = raw.match(/\bFulfillment:\s*(.*?)(?=\.\s+(?:Details):|$)/i)?.[1]?.trim().toLowerCase();
  const detailsText = raw.match(/\bDetails:\s*(.*)$/i)?.[1]?.trim().replace(/\.$/, "");
  const summary = raw.split(/\s+(?=(?:Condition|Example status|Fulfillment|Details):)/i)[0]?.trim();
  const fulfillment = fulfillmentText === "local pickup"
    ? "pickup"
    : fulfillmentText === "shipping"
      ? "shipping"
      : "both";

  return {
    condition: condition || "See listing details",
    fulfillment: fulfillment as "shipping" | "pickup" | "both",
    description: summary || "See the current listing for details.",
    details: detailsText
      ? detailsText.split(";").map((detail) => detail.trim()).filter(Boolean)
      : [],
  };
}

export function contentProductToListing(product: ContentProduct) {
  const description = productDescriptionParts(product.description);
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category || "Current find",
    price: product.price_cents / 100,
    condition: description.condition,
    fulfillment: description.fulfillment,
    status: product.availability === "sold" ? ("sold" as const) : ("available" as const),
    art: "photo",
    image: contentMediaUrl(product.images?.[0]?.url),
    description: description.description,
    details: description.details,
    commerce: product.commerce,
  };
}
