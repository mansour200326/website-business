import Home from "@/components/Home";
import { site } from "@/config/site";
import { portfolioMedia, type PortfolioMedia } from "@/lib/portfolio";

export default function Page() {
  // Resolve portfolio motion assets (poster still + video sources, with the
  // poster's intrinsic size) at build time — no CLS.
  const media: Record<string, PortfolioMedia> = {};
  for (const p of site.portfolio) media[p.slug] = portfolioMedia(p.slug);
  return <Home media={media} />;
}
