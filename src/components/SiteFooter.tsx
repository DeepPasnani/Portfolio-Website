import { Link } from "@tanstack/react-router";
import { person } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <hr className="rule-line" />
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a className="link-underline" href={`mailto:${person.email}`}>
              {person.email}
            </a>
            <a className="link-underline" href={person.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="link-underline" href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <Link className="link-underline" to="/contact">
              Contact
            </Link>
          </div>
          <p className="num text-[11px] leading-relaxed text-muted-foreground">
            Every innings starts on a maidan — Vadodara, Gujarat
          </p>
        </div>
      </div>
    </footer>
  );
}
