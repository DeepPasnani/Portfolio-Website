import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Magnet } from "@/components/ui/Magnet";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { person } from "@/content/site";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Deep Pasnani" },
      {
        name: "description",
        content:
          "Get in touch with Deep Pasnani about quant and ML internships, research collaboration, or full-stack builds. Usual response time within 48 hours.",
      },
      { property: "og:title", content: "Contact — Deep Pasnani" },
      {
        property: "og:description",
        content: "Email, GitHub and LinkedIn — quant, ML and full-stack enquiries welcome.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function Contact() {
  return (
    <PageShell
      eyebrow="Contact"
      title="I read every message."
      intro="Quant and ML internships, research collaboration, or a serious full-stack build — all welcome."
    >
      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="space-y-4">
            {[
              { label: "Email", value: person.email, href: `mailto:${person.email}` },
              { label: "GitHub", value: person.githubLabel, href: person.github },
              { label: "LinkedIn", value: person.linkedinLabel, href: person.linkedin },
            ].map((c) => (
              <SpotlightCard key={c.label} className="p-5">
                <a
                  className="group flex items-baseline justify-between gap-4"
                  href={c.href}
                  target={c.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                >
                  <span>
                    <dt className="num text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {c.label}
                    </dt>
                    <dd className="link-underline mt-1.5 break-all text-sm">{c.value}</dd>
                  </span>
                  <span
                    aria-hidden="true"
                    className="num text-[10px] text-muted-foreground/70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              </SpotlightCard>
            ))}
          </div>
          <p className="num mt-6 text-[11px] text-muted-foreground">
            Response time — usually within 48 hours.
          </p>
        </div>

        <div className="md:col-span-7">
          <Magnet padding={60} magnetStrength={3}>
            <a
              href={`mailto:${person.email}?subject=Hello%20Deep`}
              className="inline-flex items-center bg-primary px-6 py-3 text-sm text-primary-foreground transition-opacity duration-200 hover:opacity-90"
            >
              Send Message
            </a>
          </Magnet>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-foreground/70">
            Email reaches me fastest. If you're writing about a role, a short note on the problem
            you're working on is more useful than a formal brief.
          </p>
        </div>
      </div>
      <hr className="rule-line mt-16" />
    </PageShell>
  );
}
