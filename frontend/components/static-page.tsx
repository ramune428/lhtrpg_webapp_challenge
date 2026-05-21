import Link from "next/link";
import type { ReactNode } from "react";
import PageShell from "@/components/page-shell";
import SectionCard from "@/components/ui/section-card";

type TextBlock = { type: "text"; text: string };
type HeadingBlock = { type: "heading"; text: string };
type BulletListBlock = { type: "bullets"; items: string[] };
type ImageBlock = {
  type: "image";
  label: string;
  src?: string;
  alt?: string;
  caption?: string;
  maxWidth?: string;
};
type DetailsBlock = {
  type: "details";
  title: string;
  defaultOpen?: boolean;
  blocks: StaticPageBlock[];
};

type StaticPageBlock =
  | TextBlock
  | HeadingBlock
  | BulletListBlock
  | ImageBlock
  | DetailsBlock;

type BaseSection = {
  paragraphs?: ReactNode[];
  blocks?: StaticPageBlock[];
};

type NormalSection = BaseSection & {
  title?: string;
  collapsible?: false;
  hideTitle?: boolean;
};

type CollapsibleSection = BaseSection & {
  title: string;
  collapsible: true;
  defaultOpen?: boolean;
};

type Section = NormalSection | CollapsibleSection;

type StaticPageProps = {
  current?: "character" | "enemy";
  title: string;
  lead?: ReactNode;
  backHref?: string;
  backLabel?: string;
  sections: Section[];
};

function BackLink({ href, label }: { href?: string; label?: string }) {
  if (!href || !label) {
    return null;
  }

  return (
    <div className="mb-6">
      <Link href={href} className="text-sm text-neutral-600 underline underline-offset-4">
        ← {label}
      </Link>
    </div>
  );
}

function PageLead({ lead }: { lead?: ReactNode }) {
  if (!lead) {
    return null;
  }

  return <p className="mb-10 text-base leading-8 text-neutral-700">{lead}</p>;
}

function ImageContent({ block }: { block: ImageBlock }) {
  if (!block.src) {
    return (
      <figure className="my-4 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4">
        <div className="flex min-h-[180px] items-center justify-center rounded-md border border-neutral-200 bg-white px-4 text-center">
          <div>
            <p className="text-sm font-semibold text-neutral-800">{block.label}</p>
            <p className="mt-2 text-xs leading-6 text-neutral-500">
              ここに画像を差し込む想定です。
            </p>
          </div>
        </div>

        {block.caption ? (
          <figcaption className="mt-2 text-xs leading-6 text-neutral-600">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure
      className="my-4 mx-auto overflow-hidden rounded-lg border border-neutral-200 bg-white"
      style={block.maxWidth ? { maxWidth: block.maxWidth } : undefined}
    >
      <img src={block.src} alt={block.alt ?? block.label} className="w-full object-contain" />

      {block.caption ? (
        <figcaption className="border-t border-neutral-200 px-4 py-2 text-xs leading-6 text-neutral-600">
          {block.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function TextContent({ text }: { text: string }) {
  return <p className="text-sm leading-8 text-neutral-800">{text}</p>;
}

function HeadingContent({ text }: { text: string }) {
  return <h3 className="pt-3 text-base font-semibold leading-8 text-neutral-900">{text}</h3>;
}

function BulletListContent({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6 text-sm leading-8 text-neutral-800">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function DetailsContent({ block }: { block: DetailsBlock }) {
  return (
    <details open={block.defaultOpen ?? true} className="rounded-lg border border-neutral-200 bg-neutral-50">
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-neutral-900">
        {block.title}
      </summary>
      <div className="border-t border-neutral-200 px-4 py-4">
        <BlockList blocks={block.blocks} />
      </div>
    </details>
  );
}

function BlockContent({ block }: { block: StaticPageBlock }) {
  switch (block.type) {
    case "heading":
      return <HeadingContent text={block.text} />;
    case "text":
      return <TextContent text={block.text} />;
    case "bullets":
      return <BulletListContent items={block.items} />;
    case "image":
      return <ImageContent block={block} />;
    case "details":
      return <DetailsContent block={block} />;
    default:
      return null;
  }
}

function BlockList({ blocks }: { blocks: StaticPageBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, index) => (
        <BlockContent key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}

function ParagraphList({ title, paragraphs }: { title?: string; paragraphs?: ReactNode[] }) {
  if (!paragraphs || paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {paragraphs.map((paragraph, index) => {
        const key = `${title ?? "section"}-paragraph-${index}`;

        if (typeof paragraph === "string") {
          return (
            <p key={key} className="text-sm leading-8 text-neutral-800">
              {paragraph}
            </p>
          );
        }

        return (
          <div key={key} className="text-sm leading-8 text-neutral-800">
            {paragraph}
          </div>
        );
      })}
    </div>
  );
}

function SectionBody({ section }: { section: Section }) {
  if (section.blocks && section.blocks.length > 0) {
    return <BlockList blocks={section.blocks} />;
  }

  return <ParagraphList title={"title" in section ? section.title : undefined} paragraphs={section.paragraphs} />;
}

function StaticSection({ section, index }: { section: Section; index: number }) {
  const sectionKey = section.title ?? `section-${index}`;

  if (section.collapsible) {
    return (
      <details key={sectionKey} open={section.defaultOpen ?? true} className="rounded-2xl border border-neutral-300 p-6">
        <summary className="cursor-pointer text-xl font-semibold tracking-tight text-neutral-950">
          {section.title}
        </summary>
        <div className="pt-4">
          <SectionBody section={section} />
        </div>
      </details>
    );
  }

  return (
    <SectionCard key={sectionKey} title={!section.hideTitle ? section.title : undefined}>
      <SectionBody section={section} />
    </SectionCard>
  );
}

export default function StaticPage({ current, title, lead, backHref, backLabel, sections }: StaticPageProps) {
  return (
    <PageShell current={current}>
      <BackLink href={backHref} label={backLabel} />
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
        {title}
      </h1>
      <PageLead lead={lead} />
      <div className="space-y-10">
        {sections.map((section, index) => (
          <StaticSection key={section.title ?? `section-${index}`} section={section} index={index} />
        ))}
      </div>
    </PageShell>
  );
}
