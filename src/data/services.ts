/**
 * Service data — sourced strictly from Menu_Final_Draft.pdf.
 * Prices are stored here as data so the UI never hardcodes them.
 * `startingFrom: true` renders a "Starting From" label.
 */

export type ServiceItem = {
  name: string;
  price: number | null; // null => custom / contact us
  startingFrom?: boolean;
  note?: string;
};

export type ServiceGroup = {
  title: string;
  items: ServiceItem[];
};

export type ServiceCategory = {
  slug: string;
  title: string;
  short: string;
  description: string;
  groups: ServiceGroup[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "hair",
    title: "Hair Care & Styling",
    short: "Hair",
    description:
      "Cuts, styling, treatments and colour — finished with care from wash to last strand.",
    groups: [
      {
        title: "Cut & Style",
        items: [
          { name: "Hair Cut", price: 200, startingFrom: true },
          { name: "Head Massage", price: 200, startingFrom: true },
          { name: "Hair Spa Treatment", price: 700, startingFrom: true, note: "Mid-length" },
        ],
      },
      {
        title: "Hair Styling",
        items: [
          { name: "Hair Styling (General)", price: 500, startingFrom: true },
          { name: "Blow Dry", price: 200, startingFrom: true },
          { name: "Ironing", price: 350, startingFrom: true, note: "Mid-length" },
          { name: "Curling", price: 500, startingFrom: true, note: "Mid-length" },
        ],
      },
      {
        title: "Advanced Hair Treatments",
        items: [
          { name: "Hair Straightening", price: 3000, startingFrom: true, note: "Mid-length" },
          { name: "Keratin Treatment", price: 1500, startingFrom: true, note: "Mid-length" },
          { name: "Hair Botox", price: 3000, startingFrom: true, note: "Mid-length" },
          { name: "Nano Plastia", price: 3000, startingFrom: true, note: "Mid-length" },
        ],
      },
      {
        title: "Hair Coloring",
        items: [
          { name: "Full / Global Color", price: 2000, startingFrom: true },
          { name: "Root Touch-Up", price: 500, startingFrom: true },
          { name: "Highlights", price: 2000, startingFrom: true },
        ],
      },
    ],
  },
  {
    slug: "skin",
    title: "Face & Skin Care",
    short: "Skin",
    description: "Facials, cleansing and grooming for skin that looks rested and even.",
    groups: [
      {
        title: "Facials & Treatments",
        items: [
          { name: "Facial", price: 500, startingFrom: true },
          { name: "Face Cleansing", price: 400, startingFrom: true },
          { name: "De-Tan", price: 250, startingFrom: true },
          { name: "Bleaching", price: 250, startingFrom: true },
        ],
      },
      {
        title: "Threading & Grooming",
        items: [
          { name: "Eyebrow Threading", price: 60 },
          { name: "Full Face Threading", price: 80 },
        ],
      },
      {
        title: "Manicure & Pedicure",
        items: [
          { name: "Manicure", price: 300, startingFrom: true },
          { name: "Pedicure", price: 400, startingFrom: true },
        ],
      },
    ],
  },
  {
    slug: "makeup",
    title: "Makeup & Makeovers",
    short: "Makeup",
    description:
      "From a quick party look to a full bridal makeover, shaped around your features and outfit.",
    groups: [
      {
        title: "Makeup",
        items: [
          { name: "Party Makeup", price: 1000, startingFrom: true },
          { name: "Engagement Makeup", price: 4000, startingFrom: true },
          { name: "Sider Makeup", price: 1500, startingFrom: true },
          { name: "Pre-Wedding Makeup", price: 2000, startingFrom: true },
          { name: "Bridal Makeup", price: 10000, startingFrom: true },
          { name: "Baby Shower Look", price: 2000, startingFrom: true },
        ],
      },
    ],
  },
  {
    slug: "nails",
    title: "Nail Enhancement",
    short: "Nails",
    description: "Gel finishes and extensions, shaped and set to last through the occasion.",
    groups: [
      {
        title: "Nail Paint",
        items: [
          { name: "Gel Nail Paint (Hands)", price: 300, startingFrom: true },
          { name: "Gel Nail Paint (Feet)", price: 300, startingFrom: true },
          { name: "Gel Nail Paint (Hand + Leg)", price: 500, startingFrom: true },
        ],
      },
      {
        title: "Nail Extensions",
        items: [
          { name: "Semi Nail Extension", price: 800, startingFrom: true },
          { name: "Acrylic Nail Extension", price: 1000, startingFrom: true },
          { name: "Polygel Nail Extension", price: null },
          { name: "Gel Nail Extension", price: null },
        ],
      },
    ],
  },
  {
    slug: "waxing",
    title: "Waxing Services",
    short: "Waxing",
    description: "Sugar, cream, rica and confidence care ranges — choose what suits your skin.",
    groups: [
      {
        title: "Sugar Wax",
        items: [
          { name: "Half Hand", price: 150 },
          { name: "Full Hand", price: 180 },
          { name: "Half Leg", price: 180 },
          { name: "Full Leg", price: 350 },
          { name: "Full Body", price: null },
        ],
      },
      {
        title: "Cream Wax",
        items: [
          { name: "Half Hand", price: 200 },
          { name: "Full Hand", price: 250 },
          { name: "Half Leg", price: 250 },
          { name: "Full Leg", price: 400 },
          { name: "Full Body", price: null },
          { name: "Special Care Wax", price: 800 },
        ],
      },
      {
        title: "Rica Wax",
        items: [
          { name: "Half Hand", price: 300 },
          { name: "Full Hand", price: 350 },
          { name: "Half Leg", price: 350 },
          { name: "Full Leg", price: 500 },
          { name: "Special Care Wax", price: 1000 },
        ],
      },
      {
        title: "Confidence Care Wax (Brazilian Range)",
        items: [
          { name: "Underarms", price: 100 },
          { name: "Full Face Wax", price: 300 },
          { name: "Special Care Wax", price: 1300 },
        ],
      },
    ],
  },
];

export const featuredServices: { name: string; price: number; category: string }[] = [
  { name: "Party Makeup", price: 1000, category: "Makeup" },
  { name: "Bridal Makeup", price: 10000, category: "Makeup" },
  { name: "Hair Cut", price: 200, category: "Hair" },
  { name: "Facial", price: 500, category: "Skin" },
  { name: "Manicure", price: 300, category: "Skin" },
  { name: "Pedicure", price: 400, category: "Skin" },
];

export function formatPrice(price: number | null) {
  return price === null ? "Custom" : `₹${price.toLocaleString("en-IN")}`;
}

export function allServiceNames() {
  return serviceCategories.flatMap((c) => c.groups.flatMap((g) => g.items.map((i) => `${c.title} — ${g.title !== c.title ? g.title + " " : ""}${i.name}`)));
}
