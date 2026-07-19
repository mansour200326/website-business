import { site } from "@/config/site";

/**
 * Build a wa.me link from the configured WhatsApp number with a pre-filled
 * message. Pass a service subject to name it in the message.
 *
 * The number is reduced to digits (wa.me requires digits only). With the
 * "+9715XXXXXXXX" placeholder this yields a non-functional link by design —
 * set a real number in config/site.ts to make every CTA live.
 */
export function waLink(subject?: string): string {
  const digits = site.whatsappNumber.replace(/\D/g, "");
  const message = subject
    ? site.whatsapp.quoteTemplate.replace("{service}", subject)
    : site.whatsapp.general;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
