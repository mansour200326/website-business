/**
 * config/site.ts — single source of truth for the whole site.
 *
 * Change values here and the entire site updates:
 *  - studioName:      leave "" to render the "name in production" placeholder
 *                     treatment in the nav/footer; set it to your real studio
 *                     name to show it everywhere.
 *  - whatsappNumber:  placeholder "+9715XXXXXXXX". Every WhatsApp CTA builds a
 *                     wa.me link from this, with a pre-filled message (naming
 *                     the service where relevant).
 */

export interface Scene {
  /** url-safe id used to locate screenshots in /public/work (`${slug}-desktop.(png|jpeg)` etc.) */
  slug: string;
  /** project title */
  title: string;
  /** sector / category line */
  sector: string;
  /** short description paragraph */
  description: string;
  /** capability tags (rendered as plain text, no boxes) */
  tags: string[];
  /** primary brand-glow hue behind the screenshot display */
  hue: string;
  /** secondary brand-glow hue */
  hue2: string;
  /** word shown inside the gradient fallback frame (only when no screenshot exists) */
  frame: string;
  /** project index label, e.g. "03" */
  prj: string;
}

export interface Service {
  /** service name (sentence case) */
  name: string;
  /** name inserted into the pre-filled WhatsApp quote message */
  subject: string;
  /** two-line, plain-language description — no tiers, no numbers */
  description: string;
}

export interface ProcessStep {
  /** day marker, e.g. "D0" or "D2–4" */
  day: string;
  /** step title */
  title: string;
  /** step description */
  text: string;
}

export const site = {
  /** "" → nav/footer show the "name in production" placeholder treatment. */
  studioName: "",

  /** Placeholder. Every CTA builds a wa.me link from this. */
  whatsappNumber: "+9715XXXXXXXX",

  /** Pre-filled WhatsApp messages. `{service}` is swapped for the service name. */
  whatsapp: {
    general: "Hi — I'd like to get a quote for a website.",
    quoteTemplate: "Hi — I'd like a quote for {service}.",
  },

  /** SEO / metadata */
  meta: {
    /** swapped to studioName when set */
    title: "Independent Web Studio — Dubai",
    description:
      "Design, build, animation, and native Arabic — one studio, no agency overhead, no templates, no six-week timelines.",
    /** absolute base URL of the deployed site, used for OG tags */
    url: "https://independent-web-studio.example",
    themeColor: "#E9F2FB",
  },

  /** HERO */
  hero: {
    eyebrow: "Independent web studio — Dubai",
    /** headline lines, rendered sentence case with generous line-height */
    headline: ["Sites that ship in days —", "and look like they took months."],
    sub: "Design, build, animation, and native Arabic — one studio, no agency overhead, no templates, no six-week timelines.",
    ctaPrimary: "Get a quote on WhatsApp",
    ctaSecondary: "See the work",
  },

  /** SECTION LABELS (small mono eyebrows, used sparingly) */
  labels: {
    work: "Selected work",
    services: "What we make",
    process: "How it works",
    bilingual: "Two languages, one build",
  },

  /** WORK SCENES — the visual heroes of the site */
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
      prj: "03",
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
      prj: "02",
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
      prj: "01",
    },
  ] as Scene[],

  /** SERVICES — plain language, no tiers, no numbers */
  services: [
    {
      name: "Websites",
      subject: "a website",
      description:
        "Custom-designed brand sites, built in days. Fast, refined, and unmistakably yours — never a template.",
    },
    {
      name: "Online stores",
      subject: "an online store",
      description:
        "E-commerce that's ready to sell. Products, payments, and checkout set up properly from the first day.",
    },
    {
      name: "Signature builds",
      subject: "a signature build",
      description:
        "Full brand-level design and animation. A considered, cinematic site that makes your brand lead its category.",
    },
  ] as Service[],

  /** PROCESS — measured in days */
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

/** Nav/footer initial letter for the monogram. */
export function monogram(studioName: string): string {
  return studioName ? studioName.trim().charAt(0).toUpperCase() : "M";
}
