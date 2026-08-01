import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { navItems, person } from "@/content/site";

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[60] border-b border-[color-mix(in_oklab,var(--rule)_45%,transparent)] bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="group flex items-baseline gap-3">
          <span className="font-serif text-lg tracking-tight">{person.name}</span>
          <span className="num hidden text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            Portfolio
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center">
            {navItems.map((item, i) => (
              <li key={item.to} className="flex items-center">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="mx-4 h-3 w-px bg-[color-mix(in_oklab,var(--rule)_55%,transparent)]"
                  />
                )}
                {item.to === "/resume" ? (
                  <Link
                    to={item.to}
                    className="num rounded-sm border border-[color-mix(in_oklab,var(--primary)_45%,transparent)] px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-primary transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
                    activeProps={{ className: "bg-primary text-primary-foreground" }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    to={item.to}
                    className="text-[13px] tracking-wide text-foreground/70 transition-colors duration-200 hover:text-primary"
                    activeProps={{ className: "text-foreground" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="num text-[11px] uppercase tracking-[0.16em] text-foreground/70 md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-border md:hidden">
          <ul className="mx-auto max-w-6xl px-6 py-2">
            {navItems.map((item) => (
              <li key={item.to} className="border-b border-border/60 last:border-0">
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`block py-3 text-sm ${pathname === item.to ? "text-foreground" : "text-foreground/70"} ${item.to === "/resume" ? "num uppercase tracking-[0.14em] text-primary" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
