import { site } from "@/config/site";
import { workShots } from "@/lib/workShots";
import WorkScene from "./WorkScene";

export default function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <div className="eyebrow mono">{site.labels.work}</div>
        <div className="scenes">
          {site.scenes.map((scene, i) => (
            <WorkScene
              key={scene.prj}
              scene={scene}
              flip={i % 2 === 1}
              shots={workShots(scene.slug)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
