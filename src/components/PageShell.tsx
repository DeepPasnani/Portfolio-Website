import { Reveal } from "@/components/ui/Reveal";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-16 pb-4 md:px-10 md:pt-24">
      <Reveal>
        <p className="num text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.05] md:text-6xl">{title}</h1>
      </Reveal>
      <Reveal delay={0.16}>
        <hr className="rule-line mt-8" />
      </Reveal>
      {intro && (
        <Reveal delay={0.22}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-foreground/75">{intro}</p>
        </Reveal>
      )}
      <div className="mt-12">{children}</div>
    </main>
  );
}
