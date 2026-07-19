/**
 * config/site.ts — single source of truth for the whole site.
 *
 * Change values here and the entire site updates:
 *  - studioName:      leave "" to render the prototype's "name in production"
 *                     placeholder treatment in the nav/footer; set it to your
 *                     real studio name to show it everywhere.
 *  - whatsappNumber:  placeholder "+9715XXXXXXXX". Every WhatsApp CTA builds a
 *                     wa.me link from this, with a pre-filled message (including
 *                     the package name where relevant).
 */

export interface Scene {
  /** url-safe id used to locate screenshots in /public/work (`${slug}-desktop.png` / `${slug}-mobile.png`) */
  slug: string;
  /** project title */
  title: string;
  /** sector / category line */
  sector: string;
  /** longer description paragraph */
  description: string;
  /** capability tags */
  tags: string[];
  /** primary bleed hue (scene hover + frame gradient) */
  hue: string;
  /** secondary frame gradient hue */
  hue2: string;
  /** big word rendered inside the project frame */
  frame: string;
  /** project number, e.g. "PRJ 003" */
  prj: string;
}

export interface Plan {
  /** small tier label, e.g. "01" or "02 — most booked" */
  tier: string;
  /** package name */
  name: string;
  /** price string, e.g. "AED 4,500" */
  price: string;
  /** timeline string, e.g. "5–7 days" */
  days: string;
  /** feature bullets */
  features: string[];
  /** highlighted (most booked) package */
  hot: boolean;
}

export interface Addon {
  /** short bold label, e.g. "Arabic +35%" */
  label: string;
  /** one-line description */
  text: string;
}

export interface ProcessStep {
  /** day marker, e.g. "D0" or "D2–4" */
  day: string;
  /** step title */
  title: string;
  /** step description */
  text: string;
}

export interface FooterMetaItem {
  /** a footer meta line; may be the studioName-driven copyright */
  text: string;
}

export const site = {
  /** "" → nav/footer show the "name in production" placeholder treatment. */
  studioName: "",

  /** Placeholder. Every CTA builds a wa.me link from this. */
  whatsappNumber: "+9715XXXXXXXX",

  /** Pre-filled WhatsApp messages. `{package}` is swapped for the package name. */
  whatsapp: {
    general: "Hi — I'd like to start a web project with your studio.",
    packageTemplate: "Hi — I'd like to request the {package} package.",
  },

  /** SEO / metadata */
  meta: {
    /** swapped to studioName when set */
    title: "Independent Web Studio — Dubai",
    description:
      "Design, build, animation, and native Arabic — one studio, no agency overhead, no templates, no six-week timelines.",
    /** absolute base URL of the deployed site, used for OG tags */
    url: "https://independent-web-studio.example",
    themeColor: "#081426",
  },

  /** HERO */
  hero: {
    eyebrow: "Independent web studio — Dubai — Reel 2026",
    /** headline lines; `thin` renders the hollow-stroke weight, `d` is the rise delay */
    headline: [
      { text: "Sites that ship", thin: false, d: ".55s" },
      { text: "in days —", thin: false, d: ".7s" },
      { text: "and look like", thin: true, d: ".85s" },
      { text: "they took months.", thin: true, d: "1s" },
    ],
    sub: "Design, build, animation, and native Arabic — one studio, no agency overhead, no templates, no six-week timelines.",
    ctaPrimary: "Start a project",
    ctaSecondary: "Watch the reel",
  },

  /** REEL MARQUEE — decorative words that scroll */
  reel: ["Grailhaus", "Sumou Jet", "Maison Padel", "Your brand next"],

  /** SECTION LABELS */
  labels: {
    work: "Selected work — 2026",
    plans: "Fixed-scope pricing — AED",
    process: "Process — measured in days",
    bilingual: "Two languages, one build",
  },

  /** WORK SCENES */
  scenes: [
    {
      slug: "grailhaus",
      title: "Grailhaus",
      sector: "Sports collectibles · e-commerce",
      description:
        "A one-of-one card shop with a title-sequence hero, holo-shine product hovers, and an archive that takes offers, not orders.",
      tags: ["Shopify", "Custom theme", "Animation"],
      hue: "#C9943A",
      hue2: "#7D1F1F",
      frame: "The Locker Room Archive",
      prj: "PRJ 003",
    },
    {
      slug: "sumoujet",
      title: "Sumou Jet",
      sector: "Private aviation · luxury brand",
      description:
        "Cinematic charter site for Gulf royalty and HNWIs — hero film, custom booking bar, and a server-rendered Arabic mirror written by native hands.",
      tags: ["Next.js", "EN / AR", "Brand system"],
      hue: "#D8CFC0",
      hue2: "#1A2436",
      frame: "نفتخر بخدمة سموكم",
      prj: "PRJ 002",
    },
    {
      slug: "maisonpadel",
      title: "Maison Padel",
      sector: "Members' club · hospitality & sport",
      description:
        "Dubai's first luxury indoor padel members' club — brand system, bilingual booking experience, and an interactive floor plan, built ahead of opening.",
      tags: ["Brand system", "Booking app", "EN / AR"],
      hue: "#1F4A38",
      hue2: "#8B5A2B",
      frame: "Le Court Privé",
      prj: "PRJ 001",
    },
  ] as Scene[],

  /** PRICING */
  plans: [
    {
      tier: "01",
      name: "Launch",
      price: "AED 4,500",
      days: "5–7 days",
      features: [
        "Up to 6 pages, fully custom design",
        "Motion where it earns its place",
        "WhatsApp & contact integration",
        "Foundational SEO & analytics",
      ],
      hot: false,
    },
    {
      tier: "02 — most booked",
      name: "Store",
      price: "AED 9,500",
      days: "10–14 days",
      features: [
        "Full e-commerce — Shopify or headless",
        "Payments, variants, filtering, checkout",
        "Product setup guidance",
        "Everything in Launch, included",
      ],
      hot: true,
    },
    {
      tier: "03",
      name: "Signature",
      price: "from AED 15,000",
      days: "2–3 weeks",
      features: [
        "Brand-level art direction & animation",
        "Cinematic hero, editorial sections",
        "A design system your brand keeps",
        "Priority build slot",
      ],
      hot: false,
    },
  ] as Plan[],

  /** PRICING add-ons */
  addons: [
    { label: "Arabic +35%", text: "Server-rendered عربي. Real RTL. Native copy. Not a plugin." },
    { label: "Rush +25%", text: "Half the timeline, same bar." },
    { label: "Copy 1,500–3,000", text: "On-brand words, EN/AR, written with the design." },
  ] as Addon[],

  /** small print under the pricing grid */
  pricingFine: "50% deposit to book · two revision rounds included · you own everything",

  /** PROCESS timeline */
  process: [
    { day: "D0", title: "Brief", text: "One call or one voice note. I extract what your brand actually needs." },
    { day: "D1", title: "Draft", text: "A working prototype in your hands — real motion, not a static mockup." },
    { day: "D2–4", title: "Build", text: "The full site, previewed live as it grows. Two revision rounds included." },
    { day: "D5", title: "Ship", text: "Your domain, your accounts, your keys. You own everything — no dependency." },
  ] as ProcessStep[],

  /** BILINGUAL panel */
  bilingual: {
    en: {
      heading: "Your site, in English.",
      body: "Structured, typeset, and written for the reader — not translated at them. Every build ships ready for its Arabic mirror.",
    },
    ar: {
      heading: "موقعك، بالعربية.",
      body: "نسخة عربية أصلية — اتجاه صحيح، خط مدروس، ونصوص مكتوبة للقارئ العربي. ليست ترجمة مركّبة على تصميم إنجليزي.",
    },
  },

  /** FOOTER */
  footer: {
    big: "Let's build →",
    /** meta line strings; the copyright line is generated from studioName */
    meta: [
      "Dubai, UAE — ships worldwide",
      "WhatsApp — replies within hours",
      "EN / العربية",
    ],
  },
};

export type Site = typeof site;

/** Placeholder shown wherever the studio name isn't set yet. */
export const NAME_PLACEHOLDER = "name in production";

/** Nav/footer initial letter for the boxed monogram. */
export function monogram(studioName: string): string {
  return studioName ? studioName.trim().charAt(0).toUpperCase() : "M";
}
