import logo from "@/assets/logo.png";

/**
 * Single source of truth for business information.
 * Values marked PLACEHOLDER should be replaced with the real details.
 */
export const siteConfig = {
  name: "sNeha's Makeover",
  tagline: "Khud Se Milo – Naye Look Ke Saath.",
  intro: "Makeup, Hair, Nails & Skin Care crafted to bring out your best look.",
  logoUrl: logo,

  // Contact — replace placeholders with the real details.
  phone: "+91 8780172428",
  whatsapp: "918780172428", // country code + number, digits only
  email: "solankineha855@gmail.com", // PLACEHOLDER
  address: "No. 222, near Police Station Road, Ward 12B, Gandhidham, Gujarat 370201", // PLACEHOLDER
  openingHours: "11 am - 7 pm", // PLACEHOLDER
  instagram: "https://instagram.com/sneha_makeover1111",
  instagramHandle: "@sneha_makeover1111",
  mapsUrl: "https://maps.app.goo.gl/Dt2vPFPD6ocPGTwZ8", // PLACEHOLDER — paste a Google Maps link
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
