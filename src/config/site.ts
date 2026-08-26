import logo from "@/assets/logo.png.asset.json";

/**
 * Single source of truth for business information.
 * Values marked PLACEHOLDER should be replaced with the real details.
 */
export const siteConfig = {
  name: "sNeha's Makeover",
  tagline: "Khud Se Milo – Naye Look Ke Saath.",
  intro: "Makeup, Hair, Nails & Skin Care crafted to bring out your best look.",
  logoUrl: logo.url,

  // Contact — replace placeholders with the real details.
  phone: "87801 72428",
  whatsapp: "918780172428", // country code + number, digits only
  email: "Your email here", // PLACEHOLDER
  address: "Your address here", // PLACEHOLDER
  openingHours: "Your opening hours here", // PLACEHOLDER
  instagram: "https://instagram.com/sneha_makeover1111",
  instagramHandle: "@sneha_makeover1111",
  mapsUrl: "", // PLACEHOLDER — paste a Google Maps link
  note: "Only For Ladies",
} as const;

export const whatsappMessage =
  "Hi, I would like to know more about the services/products available at sNeha's Makeover.";

export function whatsappLink(message: string = whatsappMessage) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telLink() {
  return `tel:+${siteConfig.whatsapp}`;
}
