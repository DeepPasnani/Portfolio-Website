import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Tabs } from "@/components/ui/Tabs";
import { stackGroups } from "@/content/site";

export const Route = createFileRoute("/skills")({
  component: Skills,
  head: () => ({
    meta: [
      { title: "Skills — Deep Pasnani" },
      {
        name: "description",
        content:
          "Quant and ML, full-stack, systems and data skills: Python, PyTorch, Black-Scholes, TypeScript, React, Postgres, Linux, Docker, SQL.",
      },
      { property: "og:title", content: "Skills — Deep Pasnani" },
      {
        property: "og:description",
        content: "A categorized view of Deep Pasnani's quant, full-stack, systems and data toolkit.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/skills" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/skills" }],
  }),
});

function Skills() {
  const tabs = stackGroups.map((g) => ({
    title: g.label,
    value: g.label,
    content: (
      <div className="border-t border-[color-mix(in_oklab,var(--rule)_35%,transparent)]">
        <ul>
          {g.items.map((item) => (
            <li
              key={item}
              className="group flex items-baseline gap-4 border-b border-[color-mix(in_oklab,var(--rule)_25%,transparent)] py-5 text-[15px] text-foreground/80 transition-colors duration-200 last:border-0 hover:text-foreground"
            >
              <span className="num text-[10px] tracking-[0.16em] text-muted-foreground/70 transition-transform duration-200 group-hover:translate-x-1">
                —
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  }));

  return (
    <PageShell
      eyebrow="Skills"
      title="The working toolkit."
      intro="Four groups, plainly stated — what gets used, not what gets scored. Click a tab to switch the ledger."
    >
      <Tabs
        tabs={tabs}
        containerClassName="border-b border-[color-mix(in_oklab,var(--rule)_30%,transparent)] pb-2 num text-[11px] uppercase tracking-[0.16em]"
        contentClassName="mt-2"
      />
      <hr className="rule-line mt-16" />
    </PageShell>
  );
}
