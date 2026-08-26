import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} ${
        dark ? "text-off-white" : "text-foreground"
      }`}
    >
      {eyebrow ? <p className="eyebrow text-gold">{eyebrow}</p> : null}
      <h2 className="mt-4 text-3xl leading-[1.15] sm:text-4xl md:text-5xl">{title}</h2>
      <div
        className={`mt-6 h-px w-16 bg-gold ${align === "center" ? "mx-auto" : ""}`}
        aria-hidden="true"
      />
      {description ? (
        <p
          className={`mt-6 text-sm leading-relaxed sm:text-base ${
            dark ? "text-off-white/70" : "text-muted-foreground"
          }`}
        >
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
