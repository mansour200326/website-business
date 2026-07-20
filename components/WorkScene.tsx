import Image from "next/image";
import type { Scene } from "@/config/site";
import type { WorkShot } from "@/lib/workShots";

export default function WorkScene({
  scene,
  shot,
}: {
  scene: Scene;
  shot: WorkShot;
}) {
  const hue = { ["--hue" as string]: scene.hue, ["--hue2" as string]: scene.hue2 } as React.CSSProperties;
  return (
    <div className="workcard rv">
      <span className="wno">{scene.wno}</span>
      {shot.has ? (
        <div className="shot" style={hue}>
          <Image
            src={shot.src}
            alt={`${scene.title} — website`}
            width={shot.width}
            height={shot.height}
            sizes="(max-width: 760px) 90vw, 580px"
          />
        </div>
      ) : (
        <div className="shot fallback" style={hue}>
          <span className="fw">{scene.title}</span>
        </div>
      )}
      <div className="winfo">
        <h3>{scene.title}</h3>
        <div className="meta">{scene.meta}</div>
        <p>{scene.description}</p>
      </div>
    </div>
  );
}
