import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { certifications, virtualLabs } from "@/content/site";

export const Route = createFileRoute("/certifications")({
  component: Certifications,
  head: () => ({
    meta: [
      { title: "Certifications — Deep Pasnani" },
      {
        name: "description",
        content:
          "Harvard CS50 Python and SQL, Google Data Analytics, IBM, Microsoft Power BI, NPTEL IIT Madras, plus virtual experience programmes from Quantium, PwC and more.",
      },
      { property: "og:title", content: "Certifications — Deep Pasnani" },
      {
        property: "og:description",
        content: "Certifications and job-simulation programmes completed by Deep Pasnani.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/certifications" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/certifications" }],
  }),
});

function Group({
  title,
  items,
}: {
  title: string;
  items: { title: string; issuer: string; year: string }[];
}) {
  return (
    <section className="mb-16">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl">{title}</h2>
        <span className="num text-[11px] tracking-[0.16em] text-muted-foreground">
          <CountUp to={items.length} padTo={2} duration={1.4} /> total
        </span>
      </div>
      <hr className="rule-line mt-5" />
      <ul className="grid md:grid-cols-2 md:gap-x-14">
        {items.map((c, i) => (
          <Reveal key={`${c.title}-${c.issuer}-${i}`} delay={i * 0.04} y={16}>
            <li className="group flex items-baseline justify-between gap-6 border-b border-[color-mix(in_oklab,var(--rule)_30%,transparent)] py-5 transition-colors duration-200 hover:border-[color-mix(in_oklab,var(--rule)_60%,transparent)]">
              <div>
                <p className="text-sm">{c.title}</p>
                <p className="num mt-1 text-[11px] tracking-[0.08em] text-muted-foreground">
                  {c.issuer}
                </p>
              </div>
              <span className="num text-[11px] tracking-[0.1em] text-muted-foreground">{c.year}</span>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

function Certifications() {
  return (
    <PageShell
      eyebrow="Certifications"
      title="Coursework, credentials, simulations."
      intro="Formal certifications alongside job-simulation programmes run by industry teams."
    >
      <Group title="Certifications" items={certifications} />
      <Group title="Virtual Labs" items={virtualLabs} />
    </PageShell>
  );
}
