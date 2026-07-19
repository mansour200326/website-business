import { site } from "@/config/site";

export default function Bilingual() {
  const { en, ar } = site.bilingual;
  return (
    <section id="bilingual">
      <div className="wrap">
        <div className="bi rv">
          <div className="rv">
            <h3>{en.heading}</h3>
            <p>{en.body}</p>
          </div>
          <div className="ar rv" lang="ar" dir="rtl">
            <h3>{ar.heading}</h3>
            <p>{ar.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
