import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/config/site";

const studio = site.studioName || "the studio";

export const metadata: Metadata = {
  title: `Terms — ${site.studioName || site.meta.title}`,
  description: `The terms that govern website design and development projects with ${studio} (Web Smith FZCO).`,
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <>
      <Nav />
      <main className="legal-page">
        <div className="wrap">
          <div className="sec-head-row">
            <span className="mono">Terms &amp; Conditions</span>
          </div>
          <h1>The terms we work by.</h1>
          <div className="legal">
            <p className="lead">
              These are the plain-language terms for working with {studio}, operated by Web Smith
              FZCO (Dubai, UAE). They cover website design and development projects. The specifics of
              each project — scope, deliverables, timeline, and price — live in the individual
              proposal we send you; where a proposal and these terms differ, the proposal wins.
            </p>

            <h2>The services</h2>
            <p>
              We design and build websites. What we&apos;re building for you is described in the
              proposal for your project — that document defines the scope and the deliverables.
            </p>

            <h2>Quotes and proposals</h2>
            <p>
              A quote or proposal is valid for 14 days from the date we send it. Work begins once you
              accept it in writing and the deposit has been paid — that&apos;s what reserves your slot
              and starts the clock.
            </p>

            <h2>Payment</h2>
            <p>
              Projects are split into two payments: a 50% deposit to commence the work, and the
              remaining balance on completion, due before final handover and launch. We hand over
              files, accounts, and go live once the balance is settled.
            </p>

            <h2>Your responsibilities</h2>
            <p>
              For the project to stay on schedule, we need you to provide your content and materials
              (text, images, logos, access, and anything the proposal lists) and to give feedback in
              good time. Delays in content or feedback move the timeline accordingly.
            </p>

            <h2>Revisions</h2>
            <p>
              The project includes reasonable rounds of refinement within the scope set out in the
              proposal — we want it right. Anything that goes beyond that scope, or introduces new
              requirements, is quoted separately before we take it on.
            </p>

            <h2>Ownership</h2>
            <p>
              Once final payment is received, full ownership of the delivered website transfers to
              you. We may display the finished work — screenshots, recordings, and a link — in our
              own portfolio and promotional materials, unless we agree otherwise in writing.
            </p>

            <h2>Confidentiality</h2>
            <p>
              Everything you share with us to get your project built — your business details, project
              requirements, briefs, unlaunched designs, and commercial information — is treated as
              confidential. We use it only to deliver your project, and we don&apos;t share it with
              third parties, except where it&apos;s needed to provide the service itself (for
              example, setting up your hosting platform) or where the law requires it.
            </p>
            <p>
              How this fits with the portfolio right above: once your website is publicly launched,
              we may show the finished, public work in our portfolio and marketing. Your private
              business information is never part of that. And if you&apos;d rather your site not
              appear in our portfolio at all, just tell us in writing and we&apos;ll leave it out.
            </p>

            <h2>Third-party services</h2>
            <p>
              Hosting, domain registration, and any platforms or services your site relies on are
              provided by third parties and governed by their own terms and pricing. We&apos;ll help
              you set them up, but those relationships and their ongoing fees are between you and the
              provider.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              To the extent the law allows, our total liability for anything arising from a project
              is limited to the fees you have paid us for that project. We aren&apos;t liable for
              indirect or consequential losses.
            </p>

            <h2>Intellectual property of this website</h2>
            <p>
              All content, design, and code on websmith.ae is the property of Web Smith FZCO and may
              not be copied or reproduced without permission.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of the United Arab Emirates, and any dispute falls
              under the jurisdiction of its courts.
            </p>

            <h2>Questions</h2>
            <p>
              Anything unclear? Email{" "}
              <a className="tlink" href={`mailto:${site.contactEmail}`}>
                {site.contactEmail}
              </a>{" "}
              and we&apos;ll walk you through it.
            </p>

            <p className="legal-note">
              These terms are provided for general use and written in plain language for clarity —
              they are not a substitute for tailored legal advice. The proposal for your specific
              project always takes precedence.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
