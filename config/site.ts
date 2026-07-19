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
  /** url-safe id used to locate the screenshot in /public/work (`${slug}-desktop.(png|jpeg)`) */
  slug: string;
  /** work index label, e.g. "W·01" */
  wno: string;
  /** project title (also the wordmark shown in the gradient fallback) */
  title: string;
  /** sector / category line */
  meta: string;
  /** short description paragraph */
  description: string;
  /** primary gradient hue for the fallback treatment */
  hue: string;
  /** secondary gradient hue for the fallback treatment */
  hue2: string;
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
  /** day marker, e.g. "Day 0" or "Days 2–4" */
  day: string;
  /** step title */
  title: string;
  /** step description */
  text: string;
}

export interface SectionHead {
  /** small mono eyebrow label */
  eyebrow: string;
  /** index shown at the right of the ruled header row */
  idx: string;
  /** section title */
  title: string;
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
      "Custom design, real animation, and native Arabic — one independent studio in Dubai, no agency overhead.",
    /** absolute base URL of the deployed site, used for OG tags */
    url: "https://independent-web-studio.example",
    themeColor: "#F6F4EF",
  },

  /** HERO */
  hero: {
    headline: "Sites that ship in days — and look like they took months.",
    sub: "Custom design, real animation, and native Arabic — one independent studio in Dubai, no agency overhead.",
    ctaPrimary: "Get a quote on WhatsApp",
    ctaSecondary: "See the work",
  },

  /** RULED SECTION HEADERS */
  sections: {
    work: { eyebrow: "Selected work", idx: "01", title: "Three brands, three worlds — one studio." },
    services: { eyebrow: "Services", idx: "02", title: "Whatever you're building, it deserves better than a template." },
    process: { eyebrow: "Process", idx: "03", title: "Measured in days, not months." },
  } as Record<"work" | "services" | "process", SectionHead>,

  /** WORK — three alternating cards; screenshots fill the cards when present */
  scenes: [
    {
      slug: "grailhaus",
      wno: "W·01",
      title: "Grailhaus",
      meta: "Sports collectibles · online store",
      description:
        "A one-of-one trading card shop with an animated identity, custom storefront, and an archive that takes offers, not orders.",
      hue: "#C9943A",
      hue2: "#7D1F1F",
    },
    {
      slug: "sumoujet",
      wno: "W·02",
      title: "Sumou Jet",
      meta: "Private aviation · brand site",
      description:
        "Cinematic charter website for Gulf clientele — hero film, custom booking flow, and a native Arabic edition throughout.",
      hue: "#D8CFC0",
      hue2: "#1A2436",
    },
    {
      slug: "maisonpadel",
      wno: "W·03",
      title: "Maison Padel",
      meta: "Members' club · brand & booking",
      description:
        "Dubai's first luxury indoor padel club — brand system, bilingual booking experience, and interactive floor plan, built ahead of opening.",
      hue: "#1F4A38",
      hue2: "#8B5A2B",
    },
  ] as Scene[],

  /** SERVICES — plain language, no tiers, no numbers */
  services: [
    {
      name: "Websites",
      subject: "a website",
      description:
        "Custom-designed brand sites — built in days, made to make you look established from the first click.",
    },
    {
      name: "Online stores",
      subject: "an online store",
      description:
        "E-commerce that's ready to sell — payments, products, and a storefront your customers actually enjoy.",
    },
    {
      name: "Signature builds",
      subject: "a signature build",
      description:
        "The full treatment — brand-level art direction, custom animation, and a site nobody scrolls past.",
    },
  ] as Service[],

  /** PROCESS — Day 0 → Day 5 */
  process: [
    { day: "Day 0", title: "Brief", text: "One call or one voice note — I take it from there." },
    { day: "Day 1", title: "Draft", text: "A working design in your hands, with real motion." },
    { day: "Days 2–4", title: "Build", text: "The full site, previewed live as it grows." },
    { day: "Day 5", title: "Ship", text: "Your domain, your accounts, your keys." },
  ] as ProcessStep[],

  /** BILINGUAL split */
  bilingual: {
    en: {
      heading: "Your site, in English.",
      body: "Structured and written for the reader — and every build ships ready for its Arabic mirror.",
    },
    ar: {
      heading: "موقعك، بالعربية.",
      body: "نسخة عربية أصلية — اتجاه صحيح، خط مدروس، ونصوص مكتوبة للقارئ العربي.",
    },
  },

  /** FOOTER */
  footer: {
    title: "Let's build yours.",
    sub: "Tell me what you do — I'll tell you what your website should do. Quotes over WhatsApp, usually within hours.",
    button: "Message on WhatsApp",
    /** meta line strings; the copyright line is generated from studioName */
    meta: ["Dubai, UAE — ships worldwide", "English / العربية"],
  },
};

export type Site = typeof site;

/** Placeholder shown wherever the studio name isn't set yet. */
export const NAME_PLACEHOLDER = "name in production";

/** Nav monogram / logo initial. */
export function monogram(studioName: string): string {
  return studioName ? studioName.trim().charAt(0).toUpperCase() : "M";
}
