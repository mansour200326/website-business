/**
 * config/site.ts — single source of truth for the whole site.
 *
 *  - studioName:      name used in <title> / metadata. The visual wordmark
 *                     ("Websmith.") renders from the Instrument Serif treatment
 *                     (components/Logo.tsx), not this string.
 *  - whatsappNumber:  the business WhatsApp number. Every WhatsApp CTA builds a
 *                     wa.me link from this, with a pre-filled message.
 */

export interface Project {
  /** url-safe id; screenshot lives at /public/portfolio/${slug}.(jpg|jpeg|png) */
  slug: string;
  /** project name, shown in oversized serif */
  name: string;
  /** one-line description */
  blurb: string;
  /** live site URL. Leave "" to hide the "Visit live site" link (e.g. while DNS is broken). */
  liveUrl: string;
  /** small label above the name, e.g. "Client" */
  kind?: string;
  /** very-low-saturation background tint for this project's moment */
  tint: string;
}

export interface Package {
  /** package name (Launch / Store / Signature) */
  name: string;
  /** inserted into the pre-filled WhatsApp quote message */
  subject: string;
  /** one/two-line description */
  description: string;
  /** price line shown on the card */
  price: string;
}

export interface Concept {
  /** image at /public/concepts/${id}.webp (from ~/projects/leads/shots) */
  id: string;
  /** what the business is, shown as the title (not presented as a client) */
  title: string;
  /** where */
  place: string;
  /** the live concept page */
  url: string;
}

export interface Phase {
  /** phase label, e.g. "Day 0" */
  label: string;
  /** phase title */
  title: string;
  /** phase description */
  text: string;
}

export const site = {
  /** Studio name for <title> / metadata. The visual wordmark is rendered separately. */
  studioName: "Websmith",

  /** Business WhatsApp number. Every CTA builds a wa.me link from this. */
  whatsappNumber: "+971 58 546 1253",

  /** Contact email for data / privacy questions. Replace with your real address. */
  contactEmail: "privacy@websmith.ae",

  /** Main contact email, shown in the footer and contact block. */
  email: "mansour@websmith.ae",

  /** The offer, exactly as in the outreach emails. */
  offer: {
    short: "AED 1,850 · live in 2 working days · free concept first",
    line: "Websites for UAE businesses from AED 1,850, live in 2 working days. See your free concept first.",
  },

  /** Company details for the footer (trust). */
  company: "Web Smith FZCO · IFZA licence 90841 · Dubai Silicon Oasis, Dubai, UAE",

  /** Pre-filled WhatsApp messages. `{service}` is swapped for the package name. */
  whatsapp: {
    general: "Hi Websmith, I'd like a free concept for my business website.",
    quoteTemplate: "Hi Websmith, I'm interested in the {service} package. Can you send me a free concept first?",
  },

  /** SEO / metadata */
  meta: {
    title: "Websmith — Independent Web Studio, Dubai",
    description:
      "Websites for UAE businesses from AED 1,850, live in 2 working days, and you see a free concept first. Custom design, real motion, Arabic and English. Websmith, a Web Smith FZCO company in Dubai.",
    url: "https://websmith.ae",
    themeColor: "#F6F4EF",
  },

  /** HERO — the wordmark is drawn by the intro; these are the lines beneath it */
  hero: {
    tagline: "Websites, forged properly.",
    support:
      "Custom design, real motion, and native Arabic — one independent studio in Dubai, no agency overhead.",
    cta: "Get my free concept",
  },

  /** PORTFOLIO — exactly three projects, each a full-viewport moment */
  portfolio: [
    {
      slug: "sumou-jet",
      name: "Sumou Jet",
      blurb: "Private jet charter, forged for the Gulf's most demanding travellers.",
      liveUrl: "https://sumoujet.com",
      kind: "Client",
      tint: "#EDF0F3",
    },
    {
      slug: "grailhaus",
      name: "Grailhaus",
      blurb: "A one-of-one trading-card vault where collectors make offers, not orders.",
      // Live link hidden: grailhaus.com returns Cloudflare error 1014 (CNAME
      // cross-user banned). Put "https://grailhaus.com" back once DNS is fixed.
      liveUrl: "",
      kind: "Client",
      tint: "#F4EFE6",
    },
    {
      slug: "maison-padel",
      name: "Maison Padel",
      blurb: "A private padel club in Dubai — brand, booking, and a bilingual members' world.",
      liveUrl: "https://maisonpadel.ae",
      kind: "Client",
      tint: "#ECF1EE",
    },
  ] as Project[],

  /** CONCEPTS — free concepts we made for UAE businesses from their own sites.
   *  Shown ONLY as concepts, clearly labelled; these are not clients. */
  concepts: [
    { id: "al-qaser", title: "Steel fabrication workshop", place: "Al Quoz, Dubai", url: "https://preview.websmith.ae/al-qaser/" },
    { id: "magic-colour", title: "Exhibition stands & kiosks", place: "Al Quoz, Dubai", url: "https://preview.websmith.ae/magic-colour/" },
    { id: "al-salik-interiors", title: "Interior fit-out & joinery", place: "Dubai", url: "https://preview.websmith.ae/al-salik-interiors/" },
  ] as Concept[],

  /** PACKAGES */
  packages: [
    {
      name: "Launch",
      subject: "Launch",
      price: "AED 1,850 · live in 2 working days",
      description:
        "A custom brand site that makes you look established from the first visit — structure, design, and content, done properly.",
    },
    {
      name: "Store",
      subject: "Store",
      price: "Quoted per project",
      description:
        "A storefront that's ready to sell — products, payments, and a checkout that actually converts.",
    },
    {
      name: "Signature",
      subject: "Signature",
      price: "Quoted per project",
      description:
        "Brand-level art direction and custom motion, built from the ground up — a site nobody scrolls past.",
    },
  ] as Package[],

  /** ABOUT / PROCESS — matches the outreach offer: free concept, then 2 working days */
  about: {
    title: "One smith. Your site live in 2 working days.",
    body: "Websmith is one independent studio in Dubai — design, build, motion, and native Arabic under one roof. No agency overhead, no drawn-out timelines. You talk to Mansour, the person doing the work.",
  },
  process: [
    { label: "Day 0", title: "Your free concept", text: "We design a concept of your new site from your own content and photos. You see it before you pay anything." },
    { label: "Day 1", title: "You approve, we build", text: "Say yes, pay by Stripe link, and we build the full site with your pages, text and photos." },
    { label: "Day 2", title: "Live on your domain", text: "Checked on every device, then live on your own domain. Two rounds of changes included." },
  ] as Phase[],

  /** CLOSE — where the dot lands, in the WhatsApp CTA */
  close: {
    title: "Tell us about your business. We'll send a free concept.",
    support: "AED 1,850 · live in 2 working days · free concept first.",
    cta: "Message on WhatsApp",
  },

  /** FOOTER */
  footer: {
    legal: "Websmith is a Web Smith FZCO company",
    terms: "Pay 50% to start (or 100% up front) by Stripe link · 2 rounds of changes included · full refund if we don't deliver the agreed site.",
    copyright: "© 2026 Web Smith FZCO. All rights reserved.",
  },
};

export type Site = typeof site;
