import { site } from "@/config/site";
import WorkScene from "./WorkScene";

export default function Work() {
  return (
    <section id="work">
      <div className="sec-label mono">{site.labels.work}</div>
      {site.scenes.map((scene, i) => (
        <WorkScene key={scene.prj} scene={scene} flip={i % 2 === 1} />
      ))}
    </section>
  );
}
