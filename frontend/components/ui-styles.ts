export const layoutStyles = {
  page: "min-h-screen bg-white text-black",
  container: "mx-auto w-full max-w-6xl px-6 py-12 sm:px-8",
  header: "mb-10",
  title: "mb-4 text-3xl font-bold tracking-tight sm:text-4xl",
  lead: "text-sm leading-8 text-neutral-800",
} as const;

export const cardStyles = {
  base: "rounded-2xl border border-neutral-300 p-6",
  compact: "rounded-2xl border border-neutral-300 p-5",
  info: "rounded-2xl border border-sky-300 bg-sky-50 p-5",
  warning: "rounded-2xl border border-amber-300 bg-amber-50 p-5",
} as const;

export const textStyles = {
  body: "text-sm leading-8 text-neutral-800",
  muted: "text-sm text-neutral-600",
  link: "text-sm font-medium text-neutral-700 underline underline-offset-4",
  sectionTitle: "mb-3 text-xl font-semibold",
  cardTitle: "mb-4 text-2xl font-semibold",
} as const;

export const formStyles = {
  input:
    "w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500",
  inputReadOnly:
    "w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 outline-none",
  textarea:
    "w-full resize-y rounded-xl border border-neutral-300 px-4 py-3 text-sm leading-6 outline-none",
  button:
    "rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60",
  smallButton:
    "rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50",
  dangerButton:
    "rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50",
} as const;
