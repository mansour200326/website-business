/**
 * config/site.ts — single source of truth for the whole site.
 *
 *  - studioName:      name used in <title> / metadata. The visual wordmark
 *                     ("Websmith.") renders from the Instrument Serif treatment
 *                     (components/Logo.tsx), not this string.
 *  - whatsappNumber:  placeholder "+9715XXXXXXXX". Every WhatsApp CTA builds a
 *                     wa.me link from this, with a pre-filled message.
 */

export interface Project {
  /** url-safe id; screenshot lives at /public/portfolio/${slug}.(jpg|jpeg|png) */
  slug: string;
  /** project name, shown in oversized serif */
  name: string;
  /** one-line description */
  blurb: string;
  /** live site URL (placeholder .example domains — replace with real URLs) */
  liveUrl: string;
  /** very-low-saturation background tint for this project's moment */
  tint: string;
}

export interface Package {
  /** package name (Launch / Store / Signature) */
  name: string;
  /** inserted into the pre-filled WhatsApp quote message */
  subject: string;
  /** one/two-line description — no prices */
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

export const site = {
  /** Studio name for <title> / metadata. The visual wordmark is rendered separately. */
  studioName: "Websmith",

  /** Placeholder. Every CTA builds a wa.me link from this. */
  whatsappNumber: "+9715XXXXXXXX",

  /** Contact email for data / privacy questions. Replace with your real address. */
  contactEmail: "privacy@websmith.ae",

  /** Pre-filled WhatsApp messages. `{service}` is swapped for the package name. */
  whatsapp: {
    general: "Hi Atlas — I'd like to talk about a website for my business.",
    quoteTemplate: "Hi Atlas — I'd like a quote for the {service} package.",
  },

  /** SEO / metadata */
  meta: {
    title: "Websmith — Independent Web Studio, Dubai",
    description:
      "Websmith forges custom brand websites in Dubai — real motion, native Arabic, shipped in days. A Web Smith FZCO company.",
    url: "https://websmith.ae",
    themeColor: "#F6F4EF",
  },

  /** HERO — the wordmark is drawn by the intro; these are the lines beneath it */
  hero: {
    tagline: "Websites, forged properly.",
    support:
      "Custom design, real motion, and native Arabic — one independent studio in Dubai, no agency overhead.",
    cta: "Start on WhatsApp",
  },

  /** PORTFOLIO — each project is a full-viewport moment */
  portfolio: [
    {
      slug: "sumou-jet",
      name: "Sumou Jet",
      blurb: "Private jet charter, forged for the Gulf's most demanding travellers.",
      liveUrl: "https://sumou-jet.example",
      tint: "#EDF0F3",
    },
    {
      slug: "grailhaus",
      name: "Grailhaus",
      blurb: "A one-of-one trading-card vault where collectors make offers, not orders.",
      liveUrl: "https://grailhaus.example",
      tint: "#F4EFE6",
    },
    {
      slug: "rack-on",
      name: "Rack On",
      blurb: "Barbell-grade e-commerce for a strength brand that doesn't do subtle.",
      liveUrl: "https://rack-on.example",
      tint: "#F1EFEA",
    },
    {
      slug: "prairies-fodder",
      name: "Prairies Fodder",
      blurb: "Farm-to-trough commerce for a prairie feed supplier, built to move tonnes.",
      liveUrl: "https://prairies-fodder.example",
      tint: "#EDF1EA",
    },
  ] as Project[],

  /** PACKAGES — no prices */
  packages: [
    {
      name: "Launch",
      subject: "Launch",
      description:
        "A custom brand site, forged in days — everything you need to look established from day one.",
    },
    {
      name: "Store",
      subject: "Store",
      description:
        "A storefront that's ready to sell — products, payments, and a checkout that actually converts.",
    },
    {
      name: "Signature",
      subject: "Signature",
      description:
        "Brand-level art direction and custom motion, built from the ground up — a site nobody scrolls past.",
    },
  ] as Package[],

  /** ABOUT / PROCESS */
  about: {
    title: "One smith. Measured in days, not months.",
    body: "Websmith is one independent studio in Dubai — design, build, motion, and native Arabic under one roof. No agency overhead, no six-week timelines. You talk to the person doing the work.",
  },
  process: [
    { day: "Day 0", title: "Brief", text: "One call or one voice note — I take it from there." },
    { day: "Day 1", title: "Draft", text: "A working design in your hands, with real motion." },
    { day: "Days 2–4", title: "Build", text: "The full site, previewed live as it grows." },
    { day: "Day 5", title: "Ship", text: "Your domain, your accounts, your keys." },
  ] as ProcessStep[],

  /** CLOSE — where the dot lands, in the WhatsApp CTA */
  close: {
    title: "Tell Atlas what you need.",
    support: "Quotes over WhatsApp, usually within hours.",
    cta: "Message on WhatsApp",
  },

  /** FOOTER */
  footer: {
    legal: "Websmith is a Web Smith FZCO company · websmith.ae",
  },
};

export type Site = typeof site;
