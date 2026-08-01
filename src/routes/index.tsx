import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroGround } from "@/components/HeroGround";
import { CountUp } from "@/components/ui/CountUp";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { projectCategories } from "@/content/site";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Deep Pasnani — Quant Tooling, Applied ML & Full-Stack" },
      {
        name: "description",
        content:
          "Portfolio of Deep Pasnani, Computer Engineering student at SVIT (GTU) building options pricing engines, volatility models, and platforms real users rely on.",
      },
      { property: "og:title", content: "Deep Pasnani — Quant Tooling, Applied ML & Full-Stack" },
      {
        property: "og:description",
        content:
          "Options pricing engines, volatility models, and full-stack platforms — selected work by Deep Pasnani.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const selected = [
  projectCategories[0]!.projects[0]!,
  projectCategories[0]!.projects[1]!,
  projectCategories[1]!.projects[0]!,
];

function Index() {
  const [introVisible, setIntroVisible] = useState(true);
  return (
    <main>
      <section className="relative isolate flex min-h-[600px] items-end overflow-hidden md:h-[88vh] md:max-h-[820px]">
        <HeroGround
          introVisible={introVisible}
          onToggleIntro={() => setIntroVisible((v) => !v)}
        />
        {introVisible && (
        <div className="relative mx-auto w-full max-w-6xl px-6 pt-28 pb-16 md:px-10 md:pb-24">
          <p className="num text-[11px] uppercase tracking-[0.22em] text-ivory/70">
            Vadodara, Gujarat
          </p>
          <h1 className="mt-4 text-5xl leading-[1.02] text-ivory md:text-7xl">Deep Pasnani</h1>
          <hr className="rule-line mt-6 max-w-xl" />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/85 md:text-lg">
            <DecryptedText
              text="Structure from first principles."
              animateOn="inViewHover"
              revealDirection="start"
              sequential
              speed={26}
              maxIterations={12}
              characters="0123456789%.#$&—"
            />{" "}
            Open to quant research &amp; engineering internships.
          </p>
          <span className="num absolute right-6 bottom-6 text-[10px] tracking-[0.18em] text-ivory/35 md:right-10">
            Lord&apos;s Cricket Ground, London
          </span>
        </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <p className="max-w-3xl font-serif text-2xl leading-snug md:text-3xl">
          I build tools where correctness compounds — options pricing engines, volatility models,
          and platforms real users rely on.
        </p>

        <hr className="rule-line mt-12" />
        <dl className="grid grid-cols-2 gap-8 py-8 md:grid-cols-4">
          <div>
            <dt className="num text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Projects built
            </dt>
            <dd className="num mt-2 text-3xl">
              <CountUp to={6} padTo={2} duration={1.6} />
            </dd>
          </div>
          <div>
            <dt className="num text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Internships
            </dt>
            <dd className="num mt-2 text-3xl">
              <CountUp to={2} padTo={2} duration={1.6} delay={0.1} />
            </dd>
          </div>
          <div>
            <dt className="num text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Certifications
            </dt>
            <dd className="num mt-2 text-3xl">
              <CountUp to={18} padTo={2} duration={1.6} delay={0.2} />
            </dd>
          </div>
          <div>
            <dt className="num text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Graduating
            </dt>
            <dd className="num mt-2 text-3xl">2028</dd>
          </div>
        </dl>
        <hr className="rule-line" />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8 md:px-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl md:text-3xl">Selected Work</h2>
          <Link to="/projects" className="link-underline num text-[11px] uppercase tracking-[0.18em]">
            All projects
          </Link>
        </div>
        <hr className="rule-line mt-6" />
        <ul>
          {selected.map((p) => (
            <li key={p.title} className="border-b border-[color-mix(in_oklab,var(--rule)_35%,transparent)]">
              <Link
                to="/projects"
                className="group grid gap-2 py-7 md:grid-cols-12 md:items-baseline md:gap-6"
              >
                <span className="num col-span-2 text-[11px] tracking-[0.14em] text-muted-foreground">
                  {p.year}
                </span>
                <span className="col-span-4 font-serif text-xl transition-colors duration-200 group-hover:text-primary">
                  {p.title}
                </span>
                <span className="col-span-6 text-sm leading-relaxed text-foreground/70">
                  {p.summary.split(";")[0]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
