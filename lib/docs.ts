import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "docs");

// Runs at build time only. Every .md file in docs/ is published.
export function listDocs() {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const source = readFileSync(join(dir, f), "utf8");
      const title = source.match(/^#\s+(.+)$/m)?.[1] ?? slug;
      return { slug, title, source };
    });
}
