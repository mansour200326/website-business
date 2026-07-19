import Image from "next/image";
import type { Scene } from "@/config/site";
import type { WorkShots } from "@/lib/workShots";

export default function WorkScene({
  scene,
  flip,
  shots,
}: {
  scene: Scene;
  flip: boolean;
  shots: WorkShots;
}) {
  return (
    <article
      className={`scene${flip ? " flip" : ""} rv`}
      style={
        { ["--hue" as string]: scene.hue, ["--hue2" as string]: scene.hue2 } as React.CSSProperties
      }
    >
      <div>
        <span className="no">{scene.prj}</span>
        <h3>{scene.title}</h3>
        <div className="meta">{scene.sector}</div>
        <p>{scene.description}</p>
        <div className="tags">
          {scene.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {shots.hasDesktop ? (
        <div className="display">
          <div className="browser">
            <div className="bar" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="shot">
              <Image
                src={shots.desktopSrc}
                alt={`${scene.title} — desktop site`}
                fill
                sizes="(max-width: 820px) 90vw, 55vw"
              />
            </div>
          </div>
          {shots.hasMobile && (
            <div className="phone">
              <Image
                src={shots.mobileSrc}
                alt={`${scene.title} — mobile site`}
                fill
                sizes="(max-width: 820px) 26vw, 15vw"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="frame">
          <span className="fword">{scene.frame}</span>
        </div>
      )}
    </article>
  );
}
