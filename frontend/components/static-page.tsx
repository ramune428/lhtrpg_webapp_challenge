import Link from "next/link";
import AppNav from "@/components/app-nav";

type Section = {
  title: string;
  paragraphs: string[];
};

type StaticPageProps = {
  current?: "character" | "enemy";
  title: string;
  lead?: string;
  backHref?: string;
  backLabel?: string;
  sections: Section[];
};

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
      <div className="mx-auto max-w-4xl px-6 py-12">
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
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-xl font-semibold">{section.title}</h2>
              <div className="space-y-3">
                {section.paragraphs.map((paragraph, index) => (
                  <p
                    key={`${section.title}-${index}`}
                    className="text-sm leading-8 text-neutral-800"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
