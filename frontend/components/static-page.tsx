import Link from "next/link";
import AppNav from "@/components/app-nav";

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

type Section = {
  title: string;
  paragraphs?: string[];
  blocks?: StaticPageBlock[];
  collapsible?: boolean;
  defaultOpen?: boolean;
};

type StaticPageProps = {
  current?: "character" | "enemy";
  title: string;
  lead?: string;
  backHref?: string;
  backLabel?: string;
  sections: Section[];
};

function ImageContent({ block }: { block: ImageBlock }) {
  if (block.src) {
    return (
      <figure className="my-4 overflow-hidden rounded-lg border border-neutral-200 bg-white">
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

function RenderBlocks({ blocks }: { blocks: StaticPageBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h3
              key={index}
              className="pt-3 text-base font-semibold leading-8 text-neutral-900"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "text") {
          return (
            <p key={index} className="text-sm leading-8 text-neutral-800">
              {block.text}
            </p>
          );
        }

        if (block.type === "bullets") {
          return (
            <ul
              key={index}
              className="list-disc space-y-2 pl-6 text-sm leading-8 text-neutral-800"
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "image") {
          return <ImageContent key={index} block={block} />;
        }

        return (
          <details
            key={index}
            open={block.defaultOpen ?? true}
            className="rounded-lg border border-neutral-200 bg-neutral-50"
          >
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-neutral-900">
              {block.title}
            </summary>
            <div className="border-t border-neutral-200 px-4 py-4">
              <RenderBlocks blocks={block.blocks} />
            </div>
          </details>
        );
      })}
    </div>
  );
}

function SectionBody({ section }: { section: Section }) {
  if (section.blocks && section.blocks.length > 0) {
    return <RenderBlocks blocks={section.blocks} />;
  }

  return (
    <div className="space-y-3">
      {(section.paragraphs ?? []).map((paragraph, index) => (
        <p
          key={`${section.title}-${index}`}
          className="text-sm leading-8 text-neutral-800"
        >
          {paragraph}
        </p>
      ))}
    </div>
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
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <AppNav current={current} />

        {backHref && backLabel ? (
          <div className="mb-6">
            <Link
              href={backHref}
              className="text-sm text-neutral-600 underline underline-offset-4"
            >
              ← {backLabel}
            </Link>
          </div>
        ) : null}

        <h1 className="mb-4 text-3xl font-bold tracking-tight">{title}</h1>

        {lead ? (
          <p className="mb-10 text-base leading-8 text-neutral-700">{lead}</p>
        ) : null}

        <div className="space-y-10">
          {sections.map((section) => {
            if (section.collapsible) {
              return (
                <details key={section.title} open={section.defaultOpen ?? true}>
                  <summary className="mb-3 cursor-pointer text-xl font-semibold">
                    {section.title}
                  </summary>
                  <div className="pt-1">
                    <SectionBody section={section} />
                  </div>
                </details>
              );
            }

            return (
              <section key={section.title}>
                <h2 className="mb-3 text-xl font-semibold">{section.title}</h2>
                <SectionBody section={section} />
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
