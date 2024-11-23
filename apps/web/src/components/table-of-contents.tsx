"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66%" }
    );

    const headers = document.querySelectorAll("h2, h3");
    headers.forEach((header) => observer.observe(header));

    return () => headers.forEach((header) => observer.unobserve(header));
  }, []);

  return (
    <nav className="text-sm">
      <p className="font-medium mb-4 text-white/90">On this page</p>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
          >
            <a
              href={`#${item.id}`}
              className={`
                block transition-colors duration-200
                ${
                  activeId === item.id
                    ? "text-white font-medium"
                    : "text-white/60 hover:text-white/80"
                }
              `}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
