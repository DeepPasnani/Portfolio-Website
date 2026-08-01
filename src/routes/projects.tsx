import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { CardHoverEffect, type HoverCardItem } from "@/components/ui/CardHoverEffect";
import { projectCategories } from "@/content/site";

export const Route = createFileRoute("/projects")({
  component: Projects,
  head: () => ({
    meta: [
      { title: "Projects — Deep Pasnani" },
      {
        name: "description",
        content:
          "Greeks Gym, an XGBoost volatility predictor, F1 telemetry modelling, CampusTrack, a PID line follower, and a self-hosted deployment stack.",
      },
      { property: "og:title", content: "Projects — Deep Pasnani" },
      {
        property: "og:description",
        content: "Quant/ML, full-stack, hardware and systems work — with repositories.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/projects" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
});

function Projects() {
  const items: HoverCardItem[] = projectCategories.flatMap((cat) =>
    cat.projects.map((p) => ({
      title: p.title,
      description: p.summary.split(";")[0] as string,
      link: p.repo,
      meta: `${cat.label} · ${p.role} · ${p.year}`,
    })),
  );

  return (
    <PageShell
      eyebrow="Projects"
      title="Built, shipped, and still running."
      intro="Four categories. Each project stands on what it does, not on how it's framed. Hover to mark the scorebook."
    >
      <CardHoverEffect items={items} />
      <hr className="rule-line mt-16" />
    </PageShell>
  );
}
