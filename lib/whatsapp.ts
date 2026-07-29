import { site } from "@/config/site";

/**
 * Build a wa.me link from the configured WhatsApp number with a pre-filled
 * message. Pass a service subject to name it in the message.
 *
 * The number is reduced to digits (wa.me requires digits only), e.g.
 * "+971 58 546 1253" → https://wa.me/971585461253. The number lives in
 * config/site.ts.
 */
export function waLink(subject?: string): string {
  const digits = site.whatsappNumber.replace(/\D/g, "");
  const message = subject
    ? site.whatsapp.quoteTemplate.replace("{service}", subject)
    : site.whatsapp.general;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
