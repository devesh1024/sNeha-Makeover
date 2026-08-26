export function FilterBar({
  options,
  value,
  onChange,
  tone = "light",
  label = "Filter",
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  tone?: "light" | "dark";
  label?: string;
}) {
  const dark = tone === "dark";
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={`min-h-11 border px-5 text-[0.7rem] uppercase tracking-[0.18em] transition-all duration-500 ${
              active
                ? "border-gold bg-gold text-black"
                : dark
                  ? "border-white/20 text-off-white/70 hover:border-gold/60 hover:text-gold"
                  : "border-border text-muted-foreground hover:border-gold hover:bg-blush-soft/40 hover:text-foreground"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
