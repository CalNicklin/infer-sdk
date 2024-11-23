// Server-side utilities
"use server";
import * as fs from "node:fs";
import matter from "gray-matter";
import path from "node:path";
import { remark } from "remark";
import html from "remark-html";

export async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export async function getDocsBySlug(slug: string) {
  const docsDirectory = path.join(process.cwd(), "src/app/docs/content");
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(docsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, content } as { content: string };
}
