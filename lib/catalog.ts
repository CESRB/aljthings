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

// Preview adapter. Replace this export with the CESRB Content response at launch.
export const listings: Listing[] = [
  {
    id: 1,
    slug: "leather-wingtip-shoes",
    name: "Leather Wingtip Shoes",
    category: "Shoes",
    price: 65,
    condition: "Excellent",
    fulfillment: "both",
    status: "available",
    art: "shoes",
    image: "/listings/leather-wingtip-shoes.png",
    description:
      "Classic leather wingtips with light wear and plenty of life left.",
    details: [
      "Men’s size 11",
      "Brown leather",
      "Minor sole wear",
      "Original box not included",
    ],
  },
  {
    id: 2,
    slug: "stainless-chronograph",
    name: "Stainless Chronograph",
    category: "Watches",
    price: 110,
    condition: "Very good",
    fulfillment: "both",
    status: "available",
    art: "watch",
    image: "/listings/stainless-chronograph.png",
    description: "A clean stainless chronograph suitable for everyday wear.",
    details: [
      "Stainless bracelet",
      "Working chronograph",
      "Fresh battery",
      "Light surface wear",
    ],
  },
  {
    id: 3,
    slug: "wool-quarter-zip",
    name: "Wool Quarter-Zip",
    category: "Clothing",
    price: 32,
    condition: "Gently worn",
    fulfillment: "both",
    status: "reserved",
    art: "sweater",
    image: "/listings/wool-quarter-zip.png",
    description: "Midweight quarter-zip in a versatile charcoal tone.",
    details: [
      "Men’s large",
      "Wool blend",
      "No stains or holes",
      "Machine washable",
    ],
  },
  {
    id: 4,
    slug: "walnut-side-table",
    name: "Walnut Side Table",
    category: "Furniture",
    price: 85,
    condition: "Good",
    fulfillment: "pickup",
    status: "available",
    art: "table",
    image: "/listings/walnut-side-table.png",
    description:
      "Solid side table with a warm walnut finish and everyday character.",
    details: [
      "24 × 20 × 22 inches",
      "Solid wood construction",
      "Minor finish marks",
      "Tucson-area pickup only",
    ],
  },
  {
    id: 5,
    slug: "cast-iron-grill-set",
    name: "Cast-Iron Grill Set",
    category: "BBQ & Kitchen",
    price: 40,
    condition: "Seasoned",
    fulfillment: "pickup",
    status: "sold",
    art: "grill",
    image: "/listings/cast-iron-grill-set.png",
    description: "Heavy-duty grill tools ready for another season outside.",
    details: [
      "Four-piece set",
      "Cast iron and hardwood",
      "Cleaned and seasoned",
      "Tucson-area pickup only",
    ],
  },
  {
    id: 6,
    slug: "vintage-floor-lamp",
    name: "Vintage Floor Lamp",
    category: "Home",
    price: 55,
    condition: "Good",
    fulfillment: "pickup",
    status: "available",
    art: "lamp",
    image: "/listings/vintage-floor-lamp.png",
    description:
      "Warm floor lamp with a compact footprint and simple vintage shape.",
    details: [
      "61 inches tall",
      "Standard bulb socket",
      "Tested and working",
      "Tucson-area pickup only",
    ],
  },
  {
    id: 7,
    slug: "polarized-sunglasses",
    name: "Polarized Sunglasses",
    category: "Accessories",
    price: 24,
    condition: "Very good",
    fulfillment: "shipping",
    status: "available",
    art: "glasses",
    image: "/listings/polarized-sunglasses.png",
    description: "Classic polarized sunglasses with a lightweight black frame.",
    details: [
      "Polarized lenses",
      "Black frame",
      "Minor wear on arms",
      "Protective case included",
    ],
  },
  {
    id: 8,
    slug: "cordless-drill-kit",
    name: "Cordless Drill Kit",
    category: "Tools",
    price: 70,
    condition: "Good",
    fulfillment: "pickup",
    status: "available",
    art: "drill",
    image: "/listings/cordless-drill-kit.png",
    description:
      "Dependable cordless drill kit for household and garage projects.",
    details: [
      "Drill and driver",
      "Two batteries",
      "Charger included",
      "Tucson-area pickup only",
    ],
  },
  {
    id: 9,
    slug: "counter-height-stools",
    name: "Counter-Height Stools",
    category: "Furniture",
    price: 90,
    condition: "Good",
    fulfillment: "pickup",
    status: "reserved",
    art: "stools",
    image: "/listings/counter-height-stools.png",
    description: "A matching pair of sturdy counter-height stools.",
    details: [
      "Set of two",
      "24-inch seat height",
      "Black steel and wood",
      "Tucson-area pickup only",
    ],
  },
  {
    id: 10,
    slug: "portable-bluetooth-speaker",
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 38,
    condition: "Excellent",
    fulfillment: "both",
    status: "available",
    art: "speaker",
    image: "/listings/portable-bluetooth-speaker.png",
    description:
      "Compact rechargeable speaker with clear sound and simple controls.",
    details: [
      "Bluetooth connectivity",
      "Charging cable included",
      "Tested and working",
      "Light cosmetic wear",
    ],
  },
  {
    id: 11,
    slug: "hard-sided-cooler",
    name: "Hard-Sided Cooler",
    category: "Outdoor",
    price: 45,
    condition: "Good",
    fulfillment: "pickup",
    status: "available",
    art: "cooler",
    image: "/listings/hard-sided-cooler.png",
    description: "Roomy hard-sided cooler for cookouts, camping, or game day.",
    details: [
      "Approximately 48-quart capacity",
      "Drain plug",
      "Clean interior",
      "Tucson-area pickup only",
    ],
  },
  {
    id: 12,
    slug: "mens-leather-belt",
    name: "Men’s Leather Belt",
    category: "Accessories",
    price: 18,
    condition: "Gently worn",
    fulfillment: "shipping",
    status: "sold",
    art: "belt",
    image: "/listings/mens-leather-belt.png",
    description: "Simple brown leather belt with a brushed metal buckle.",
    details: [
      "Fits approximately 36–40 inches",
      "Brown leather",
      "Brushed metal buckle",
      "Normal wear near adjustment holes",
    ],
  },
];

export const categories = [
  "Everything",
  ...Array.from(new Set(listings.map((item) => item.category))),
];

export function fulfillmentLabel(value: Fulfillment) {
  if (value === "pickup") return "Local pickup";
  if (value === "shipping") return "Shipping available";
  return "Shipping or pickup";
}

export function findListing(slug: string) {
  return listings.find((item) => item.slug === slug);
}
