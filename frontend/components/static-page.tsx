import Link from "next/link";
import type { ReactNode } from "react";
import AppNav from "@/components/app-nav";
import { TOOL_CONFIG, type ToolKey } from "@/components/tool-config";

export { BACK_LABELS } from "@/components/tool-config";

type TextBlock = {
  type: "text";
  text: string;
};

type HeadingBlock = {
  type: "heading";
  text: string;
};

type BulletListBlock = {
  type: "bullets";
  items: string[];
};

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
  current?: ToolKey;
  title: string;
  lead?: ReactNode;
  backHref?: string;
  backLabel?: string;
  sections: Section[];
};

const DEFAULT_COLLAPSIBLE_OPEN = true;
const BODY_TEXT_CLASS = "text-sm leading-8 text-neutral-800";
const BODY_LIST_CLASS = `list-disc space-y-2 pl-6 ${BODY_TEXT_CLASS}`;
const BLOCK_LIST_CLASS = "space-y-3";

function resolveDefaultOpen(defaultOpen?: boolean) {
  return defaultOpen ?? DEFAULT_COLLAPSIBLE_OPEN;
}

function resolveBackLabel({
  current,
  backHref,
  backLabel,
}: {
  current?: ToolKey;
  backHref?: string;
  backLabel?: string;
}) {
  if (backLabel) {
    return backLabel;
  }

  if (!current || !backHref) {
    return undefined;
  }

  return TOOL_CONFIG[current].backLabel;
}

function BackLink({ href, label }: { href?: string; label?: string }) {
  if (!href || !label) {
    return null;
  }

  return (
    <div className="mb-6">
      <Link
        href={href}
        className="text-sm text-neutral-600 underline underline-offset-4"
      >
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
  const imageWrapperStyle = block.maxWidth
    ? { maxWidth: block.maxWidth }
    : undefined;

  if (!block.src) {
    return (
      <figure
        className="mx-auto my-4 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4"
        style={imageWrapperStyle}
      >
        <div className="flex min-h-[180px] items-center justify-center rounded-md border border-neutral-200 bg-white px-4 text-center">
          <div>
            <p className="text-sm font-semibold text-neutral-800">
              {block.label}
            </p>
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
      className="mx-auto my-4 overflow-hidden rounded-lg border border-neutral-200 bg-white"
      style={imageWrapperStyle}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={block.src}
        alt={block.alt ?? block.label}
        className="w-full object-contain"
      />

      {block.caption ? (
        <figcaption className="border-t border-neutral-200 px-4 py-2 text-xs leading-6 text-neutral-600">
          {block.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function TextContent({ text }: { text: string }) {
  return <p className={BODY_TEXT_CLASS}>{text}</p>;
}

function HeadingContent({ text }: { text: string }) {
  return (
    <h3 className="pt-3 text-base font-semibold leading-8 text-neutral-900">
      {text}
    </h3>
  );
}

function BulletListContent({ items }: { items: string[] }) {
  return (
    <ul className={BODY_LIST_CLASS}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function DetailsContent({ block }: { block: DetailsBlock }) {
  return (
    <details
      open={resolveDefaultOpen(block.defaultOpen)}
      className="rounded-lg border border-neutral-200 bg-neutral-50"
    >
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
    <div className={BLOCK_LIST_CLASS}>
      {blocks.map((block, index) => (
        <BlockContent key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}

function ParagraphList({
  title,
  paragraphs,
}: {
  title?: string;
  paragraphs?: ReactNode[];
}) {
  if (!paragraphs || paragraphs.length === 0) {
    return null;
  }

  return (
    <div className={BLOCK_LIST_CLASS}>
      {paragraphs.map((paragraph, index) => {
        const key = `${title ?? "section"}-paragraph-${index}`;

        if (typeof paragraph === "string") {
          return (
            <p key={key} className={BODY_TEXT_CLASS}>
              {paragraph}
            </p>
          );
        }

        return (
          <div key={key} className={BODY_TEXT_CLASS}>
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

  return (
    <ParagraphList
      title={"title" in section ? section.title : undefined}
      paragraphs={section.paragraphs}
    />
  );
}

function StaticSection({ section, index }: { section: Section; index: number }) {
  const sectionKey = section.title ?? `section-${index}`;

  if (section.collapsible) {
    return (
      <details key={sectionKey} open={resolveDefaultOpen(section.defaultOpen)}>
        <summary className="mb-3 cursor-pointer text-xl font-semibold">
          {section.title}
        </summary>

        <div className="pt-1">
          <SectionBody section={section} />
        </div>
      </details>
    );
  }

  const shouldShowTitle = Boolean(section.title) && !section.hideTitle;

  return (
    <section key={sectionKey}>
      {shouldShowTitle ? (
        <h2 className="mb-3 text-xl font-semibold">{section.title}</h2>
      ) : null}

      <SectionBody section={section} />
    </section>
  );
}

export default function StaticPage({
  current,
  title,
  lead,
  backHref,
  backLabel,
  sections,
}: StaticPageProps) {
  const resolvedBackLabel = resolveBackLabel({ current, backHref, backLabel });

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <AppNav current={current} />

        <BackLink href={backHref} label={resolvedBackLabel} />

        <h1 className="mb-4 text-3xl font-bold tracking-tight">{title}</h1>

        <PageLead lead={lead} />

        <div className="space-y-10">
          {sections.map((section, index) => (
            <StaticSection
              key={section.title ?? `section-${index}`}
              section={section}
              index={index}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
