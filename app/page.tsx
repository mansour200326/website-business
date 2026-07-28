import Home from "@/components/Home";
import { site } from "@/config/site";
import { portfolioImage, type PortfolioImage } from "@/lib/portfolio";

export default function Page() {
  // Resolve portfolio screenshots (with intrinsic sizes) at build time — no CLS.
  const images: Record<string, PortfolioImage> = {};
  for (const p of site.portfolio) images[p.slug] = portfolioImage(p.slug);
  return <Home images={images} />;
}
