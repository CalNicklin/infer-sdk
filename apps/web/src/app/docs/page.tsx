import { markdownToHtml, getDocsBySlug } from "@/lib/server/utils";
import markdownStyles from "./markdown-styles.module.css";
import AnimatedContainer from "@/components/ui/animated-container";
import TableOfContents from "@/components/table-of-contents";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

function extractTOC(content: string): TOCItem[] {
  const headings = content.match(/^#{2,3}\s+(.+)$/gm) || [];
  return headings.map((heading) => {
    const level = heading.match(/^#{2,3}/)?.[0].length || 2;
    const text = heading.replace(/^#{2,3}\s+/, "");
    const id = text.toLowerCase().replace(/[^\w]+/g, "-");
    return { id, text, level };
  });
}

function addHeaderIds(html: string): string {
  return html.replace(
    /<h([23])\b[^>]*>(.*?)<\/h\1>/g,
    (match, level, content) => {
      const id = content.toLowerCase().replace(/[^\w]+/g, "-");
      return `<h${level} id="${id}">${content}</h${level}>`;
    }
  );
}

export default async function Docs() {
  const { content } = await getDocsBySlug("docs");
  const tableOfContents = extractTOC(content || "");
  const rawHtml = await markdownToHtml(content || "");
  const pageContent = addHeaderIds(rawHtml);

  return (
    <AnimatedContainer>
      <div className="max-w-full mx-auto py-8 pt-0 px-4 sm:px-6 flex gap-8">
        <div className="hidden lg:block w-64 sticky top-24 h-fit">
          <TableOfContents items={tableOfContents} />
        </div>
        <div
          className={`${markdownStyles.markdown} prose prose-slate max-w-none flex-1 overflow-x-hidden`}
          dangerouslySetInnerHTML={{ __html: pageContent }}
        />
      </div>
    </AnimatedContainer>
  );
}
