export type CareerEntry = {
  period: string;
  company: string;
  role: string;
  type?: "fulltime" | "freelance";
  description?: string;
  tags?: string[];
};

export default function CareerTimeline({ entries }: { entries: CareerEntry[] }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

      <div className="space-y-10">
        {entries.map((entry, i) => (
          <div key={i} className="relative pl-7">
            {/* Dot */}
            <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-foreground bg-background" />

            <p className="mb-1 text-xs text-muted-foreground">{entry.period}</p>
            <div className="mb-0.5 flex items-center gap-2">
              <p className="text-sm font-semibold">{entry.company}</p>
              {entry.type === "freelance" && (
                <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                  業務委託
                </span>
              )}
            </div>
            <p className="mb-2 text-sm text-muted-foreground">{entry.role}</p>

            {entry.description && (
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                {entry.description}
              </p>
            )}

            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
