import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  certifications,
  experience,
  navItems,
  person,
  projectCategories,
  stackGroups,
  virtualLabs,
} from "./site";

// Content here is the single source of truth for the whole site (see README).
// These are cheap sanity checks against copy/paste and refactor mistakes —
// not a replacement for reading the actual pages.

const routesDir = join(dirname(fileURLToPath(import.meta.url)), "../routes");

describe("person", () => {
  it("has a plausible email and profile links", () => {
    expect(person.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(person.github).toMatch(/^https:\/\/github\.com\//);
    expect(person.linkedin).toMatch(/^https:\/\/linkedin\.com\//);
  });
});

describe("navItems", () => {
  it("has no duplicate routes or labels", () => {
    const paths = navItems.map((n) => n.to);
    const labels = navItems.map((n) => n.label);
    expect(new Set(paths).size).toBe(paths.length);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("every nav path has a matching route file", () => {
    for (const item of navItems) {
      const fileName = item.to === "/" ? "index" : item.to.slice(1);
      expect(existsSync(join(routesDir, `${fileName}.tsx`))).toBe(true);
    }
  });
});

describe("stackGroups", () => {
  it("has non-empty labels and items", () => {
    expect(stackGroups.length).toBeGreaterThan(0);
    for (const group of stackGroups) {
      expect(group.label.length).toBeGreaterThan(0);
      expect(group.items.length).toBeGreaterThan(0);
      for (const item of group.items) expect(item.length).toBeGreaterThan(0);
    }
  });
});

describe("projectCategories", () => {
  const allProjects = projectCategories.flatMap((c) => c.projects);

  it("has at least one project per category", () => {
    for (const category of projectCategories) {
      expect(category.projects.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate project titles", () => {
    const titles = allProjects.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("every project has non-empty fields and a github repo link", () => {
    for (const project of allProjects) {
      for (const field of ["title", "role", "year", "summary", "stack", "repo", "repoLabel"] as const) {
        expect(project[field].length, `${project.title}.${field}`).toBeGreaterThan(0);
      }
      expect(project.repo, project.title).toMatch(/^https:\/\/github\.com\//);
    }
  });
});

describe("certifications and virtualLabs", () => {
  it("every entry has a title, issuer, and year", () => {
    for (const entry of [...certifications, ...virtualLabs]) {
      expect(entry.title.length).toBeGreaterThan(0);
      expect(entry.issuer.length).toBeGreaterThan(0);
      expect(entry.year).toMatch(/^\d{4}$/);
    }
  });
});

describe("experience", () => {
  it("every entry has an org, title, period, and at least one point", () => {
    for (const entry of experience) {
      expect(entry.org.length).toBeGreaterThan(0);
      expect(entry.title.length).toBeGreaterThan(0);
      expect(entry.period.length).toBeGreaterThan(0);
      expect(entry.points.length).toBeGreaterThan(0);
      for (const point of entry.points) expect(point.length).toBeGreaterThan(0);
    }
  });
});
