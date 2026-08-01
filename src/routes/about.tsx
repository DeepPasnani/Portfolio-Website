import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { BlurText } from "@/components/ui/BlurText";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { stackGroups } from "@/content/site";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Deep Pasnani" },
      {
        name: "description",
        content:
          "Computer Engineering student at SVIT (GTU), SPI 8.28, graduating 2028. Quant trading intern at ZeTheta Algorithms; applied ML and full-stack systems.",
      },
      { property: "og:title", content: "About — Deep Pasnani" },
      {
        property: "og:description",
        content:
          "Quant tooling at ZeTheta, applied ML research, and CampusTrack — the placement platform built for SVIT.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function About() {
  return (
    <PageShell eyebrow="About" title="Where the math and the engineering have to agree.">
      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <SpotlightCard className="p-0">
            <div className="floodlit relative aspect-[4/5] overflow-hidden bg-pitch">
              <img
                src="/deep-portrait.jpg"
                alt="Portrait of Deep Pasnani"
                className="h-full w-full object-cover object-center"
              />
              <span className="num absolute bottom-3 left-3 text-[10px] tracking-[0.16em] text-ivory/45">
                Deep Pasnani
              </span>
            </div>
          </SpotlightCard>
          <p className="num mt-4 text-[11px] leading-relaxed text-muted-foreground">
            SVIT, Vasad — GTU · B.E. Computer Engineering · SPI 8.28 · Graduating Aug 2028
          </p>
        </div>

        <div className="md:col-span-7">
          <div className="space-y-6 text-base leading-relaxed text-foreground/80">
            <BlurText
              animateBy="words"
              delay={60}
              stepDuration={0.22}
              text="Deep is a Computer Engineering student at SVIT under GTU (SPI 8.28, graduating August 2028). He recently completed a quantitative trading internship at ZeTheta Algorithms, where he built options pricing tooling, volatility surface construction, and the numerical plumbing beneath them."
            />
            <BlurText
              animateBy="words"
              delay={60}
              stepDuration={0.22}
              text="Outside that, he splits his time between applied ML — stock volatility forecasting, F1 driver-style performance modelling — and full-stack systems, including CampusTrack, the placement platform he built for his institute. He likes problems where the math and the engineering have to agree."
            />
          </div>

          <h2 className="mt-14 text-xl">Education</h2>
          <hr className="rule-line mt-4" />
          <dl className="grid gap-2 py-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="num text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Institute
              </dt>
              <dd className="mt-1">SVIT, Vasad — GTU</dd>
            </div>
            <div>
              <dt className="num text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Programme
              </dt>
              <dd className="mt-1">B.E. in Computer Engineering</dd>
            </div>
            <div>
              <dt className="num text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                SPI
              </dt>
              <dd className="num mt-1">8.28</dd>
            </div>
            <div>
              <dt className="num text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Graduating
              </dt>
              <dd className="num mt-1">Aug 2028</dd>
            </div>
          </dl>
          <hr className="rule-line" />

          <h2 className="mt-14 text-xl">Stack</h2>
          <div className="mt-4">
            {stackGroups.map((g) => (
              <div key={g.label} className="border-t border-[color-mix(in_oklab,var(--rule)_35%,transparent)] py-5 first:border-t-0">
                <div className="grid gap-3 md:grid-cols-12">
                  <p className="num md:col-span-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {g.label}
                  </p>
                  <ul className="md:col-span-9 space-y-1 text-sm text-foreground/80">
                    {g.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
