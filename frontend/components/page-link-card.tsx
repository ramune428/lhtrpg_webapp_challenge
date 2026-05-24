import Link from "next/link";

type PageLinkCardProps = {
  href: string;
  title: string;
  description: string;
};

export default function PageLinkCard({
  href,
  title,
  description,
}: PageLinkCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-neutral-300 p-5 transition hover:border-neutral-400 hover:bg-neutral-50"
    >
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <p className="text-sm leading-7 text-neutral-700">{description}</p>
    </Link>
  );
}
