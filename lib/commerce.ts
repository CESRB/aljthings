import type { Listing } from "@/lib/catalog";

const API = "/_cesrb/commerce";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    credentials: "same-origin",
    headers: init?.body ? { "content-type": "application/json", ...init.headers } : init?.headers,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : `commerce_${response.status}`);
  return body as T;
}

export async function addCommerceItem(item: Listing) {
  if (!item.commerce) throw new Error("product_not_ready");
  await request<{ cart: unknown }>("/cart");
  return request<{ itemId: string; unitPriceMinor: number; currency: string }>("/cart/items", {
    method: "POST",
    body: JSON.stringify({ ...item.commerce, quantity: 1 }),
  });
}

export type ShippingAddress = {
  recipientName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  countryCode: string;
};

export type ShippingQuote = { methodId: string; name: string; amountMinor: number; currency: string; kind: string };

export function shippingQuotes(shippingAddress: ShippingAddress) {
  return request<{ shipping: ShippingQuote[] }>("/checkout/quote", {
    method: "POST",
    body: JSON.stringify({ shippingAddress }),
  });
}

export function startCheckout(input: {
  requestId: string;
  shippingMethodId: string;
  shippingAddress: ShippingAddress;
  customerName: string;
  customerEmail: string;
}) {
  return request<{ orderId: string; orderPublicToken: string; hostedUrl: string }>("/checkout/start", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function removeCommerceItem(itemId: string) {
  const response = await fetch(`${API}/cart/items/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  if (!response.ok && response.status !== 204) throw new Error(`commerce_${response.status}`);
}
