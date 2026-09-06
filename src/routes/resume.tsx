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

      {/* Mobile Safari doesn't render PDFs inside an iframe, so it's swapped for a
          direct-open card below md; desktop keeps the inline preview. */}
      <div className="mt-8 flex flex-col items-center gap-4 border border-[color-mix(in_oklab,var(--rule)_35%,transparent)] bg-card p-8 text-center md:hidden">
        <p className="max-w-xs text-sm leading-relaxed text-foreground/70">
          Inline preview isn't supported on this device. Open the résumé directly instead.
        </p>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center bg-primary px-6 py-3 text-sm text-primary-foreground transition-opacity duration-200 hover:opacity-90"
        >
          Open Resume
        </a>
      </div>

      <div className="mt-8 hidden border border-[color-mix(in_oklab,var(--rule)_35%,transparent)] bg-card p-1 sm:p-2 md:block">
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
