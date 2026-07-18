import { site } from "@/config/site";

export default function Bilingual() {
  const { en, ar } = site.bilingual;
  return (
    <section id="bi">
      <div className="sec-label mono" style={{ padding: 0, marginBottom: 60 }}>
        {site.labels.bilingual}
      </div>
      <div className="bi-box">
        <div className="bi-cell rv">
          <h3>{en.heading}</h3>
          <p>{en.body}</p>
        </div>
        <div className="bi-cell ar rv" lang="ar" dir="rtl">
          <h3>{ar.heading}</h3>
          <p>{ar.body}</p>
        </div>
      </div>
    </section>
  );
}
