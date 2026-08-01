import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { person } from "@/content/site";
import resumeUrl from "@/../deep-resume.pdf";

export const Route = createFileRoute("/resume")({
  component: Resume,
  head: () => ({
    meta: [
      { title: "Resume — Deep Pasnani" },
      {
        name: "description",
        content:
          "Resume of Deep Pasnani — Computer Engineering student at SVIT (GTU), quant tooling, applied ML and full-stack systems.",
      },
      { property: "og:title", content: "Resume — Deep Pasnani" },
      {
        property: "og:description",
        content: "Resume of Deep Pasnani — quant tooling, applied ML and full-stack systems.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/resume" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/resume" }],
  }),
});

function Resume() {
  return (
    <PageShell
      eyebrow="Resume"
      title="One page, current standing."
      intro="Full résumé, embedded in place — no external tab required. Use the link below to download a copy."
    >
      <div className="flex items-center justify-between">
        <span className="num text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Updated 2026
        </span>
        <a
          href={resumeUrl}
          download="Deep-Pasnani-Resume.pdf"
          className="link-underline num text-[11px] uppercase tracking-[0.18em]"
        >
          Download PDF
        </a>
      </div>
      <hr className="rule-line mt-6" />
      <div className="mt-8 border border-[color-mix(in_oklab,var(--rule)_35%,transparent)] bg-card p-1 sm:p-2">
        <iframe
          src={resumeUrl}
          title={`Resume — ${person.name}`}
          className="h-[80vh] w-full md:h-[78vh]"
          loading="lazy"
        />
      </div>
    </PageShell>
  );
}
