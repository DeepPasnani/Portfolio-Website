import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Timeline } from "@/components/ui/Timeline";
import { experience } from "@/content/site";

export const Route = createFileRoute("/experience")({
  component: Experience,
  head: () => ({
    meta: [
      { title: "Experience — Deep Pasnani" },
      {
        name: "description",
        content:
          "Quant trader intern at ZeTheta Algorithms (2026) building options pricing tools, and junior coordinator at the SVIT Training & Placement Cell.",
      },
      { property: "og:title", content: "Experience — Deep Pasnani" },
      {
        property: "og:description",
        content: "Roles at ZeTheta Algorithms and the SVIT Training & Placement Cell.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/experience" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/experience" }],
  }),
});

function Experience() {
  const data = experience.map((e) => ({
    title: e.org,
    content: (
      <div>
        <p className="num text-[11px] tracking-[0.12em] text-muted-foreground">{e.period}</p>
        <p className="mt-2 font-serif text-xl text-foreground">{e.title}</p>
        <ul className="mt-4 space-y-3">
          {e.points.map((p) => (
            <li
              key={p}
              className="border-b border-border/50 pb-3 text-sm leading-relaxed text-foreground/80 last:border-0"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    ),
  }));

  return (
    <PageShell
      eyebrow="Experience"
      title="Two roles, both hands-on."
      intro="Quant tooling in a fintech simulator, and placement operations at scale on campus. Scroll to draw the seam."
    >
      <Timeline data={data} />
      <hr className="rule-line" />
    </PageShell>
  );
}
