import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/config/site";

const studio = site.studioName || "the studio";

export const metadata: Metadata = {
  title: `Privacy — ${site.studioName || site.meta.title}`,
  description: `How ${studio} handles the information you share through this website and the WhatsApp intake assistant.`,
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <>
      <Nav />
      <main className="legal-page">
        <div className="wrap">
          <div className="sec-head-row">
            <span className="mono">Privacy</span>
          </div>
          <h1>Your information, handled with care.</h1>
          <div className="legal">
            <p className="lead">
              This website is how most projects with {studio} begin — so here is exactly what happens
              to anything you share through it. {studio} is operated by Web Smith FZCO (Dubai, UAE),
              which is responsible for the information described below.
            </p>

            <h2>What we collect</h2>
            <p>
              Through the website contact form and the WhatsApp intake assistant, we collect the
              details you choose to share with us — typically your name, your business details, and
              your project requirements. Nothing is required beyond what you send.
            </p>

            <h2>How we use it</h2>
            <p>
              We use this information solely to prepare your proposal and to communicate with you
              about your project. That is the only reason we hold it.
            </p>

            <h2>Sharing</h2>
            <p>
              We do not sell your information, and we do not share it with third parties. It stays
              between you and Web Smith FZCO.
            </p>

            <h2>Questions or removal</h2>
            <p>
              Have a question about your data, or want it deleted? Email{" "}
              <a className="tlink" href={`mailto:${site.contactEmail}`}>
                {site.contactEmail}
              </a>{" "}
              and we will take care of it.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
