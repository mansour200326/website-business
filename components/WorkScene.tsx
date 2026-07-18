import type { Scene } from "@/config/site";

export default function WorkScene({
  scene,
  flip,
}: {
  scene: Scene;
  flip: boolean;
}) {
  return (
    <article
      className={`scene${flip ? " flip" : ""} rv`}
      style={
        { ["--hue" as string]: scene.hue, ["--hue2" as string]: scene.hue2 } as React.CSSProperties
      }
    >
      <div>
        <h3>{scene.title}</h3>
        <div className="meta mono">{scene.sector}</div>
        <p>{scene.description}</p>
        <div className="tags">
          {scene.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="frame">
        <span className="fword">{scene.frame}</span>
      </div>
      <span className="no">{scene.prj}</span>
    </article>
  );
}
