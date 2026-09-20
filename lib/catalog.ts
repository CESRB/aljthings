export type Fulfillment = "shipping" | "pickup" | "both";
export type ListingStatus = "available" | "reserved" | "sold";

export type Listing = {
  id: number | string;
  slug: string;
  name: string;
  category: string;
  price: number;
  condition: string;
  fulfillment: Fulfillment;
  status: ListingStatus;
  art: string;
  image: string;
  description: string;
  details: string[];
  commerce?: {
    productId: string;
    publishedRevisionId: string;
    variantId: string;
    variantRevision: string;
  };
};

export function fulfillmentLabel(value: Fulfillment) {
  if (value === "pickup") return "Local pickup";
  if (value === "shipping") return "Shipping available";
  return "Shipping or pickup";
}
