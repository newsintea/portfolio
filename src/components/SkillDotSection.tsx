type Skill = { name: string; level: number }; // 1–5
type SkillGroup = { category: string; skills: Skill[] };

const LEGEND: { level: number; label: string; desc: string }[] = [
  { level: 5, label: "Expert",       desc: "チームをリードできる" },
  { level: 4, label: "Advanced",     desc: "設計・実装を0から行える" },
  { level: 3, label: "Intermediate", desc: "実務で自力で使える" },
  { level: 2, label: "Basic",        desc: "既存実装を参考に実装できる" },
  { level: 1, label: "Beginner",     desc: "使用経験がある" },
];

function Dots({ level, size = "md" }: { level: number; size?: "sm" | "md" }) {
  const dotClass = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className={`rounded-full ${dotClass} ${i < level ? "bg-foreground" : "bg-muted"}`}
        />
      ))}
    </div>
  );
}

function Legend() {
  return (
    <div className="mb-8 inline-flex flex-col gap-1.5 rounded-lg border border-border bg-muted/30 px-4 py-3">
      {LEGEND.map(({ level, label, desc }) => (
        <div key={level} className="flex items-center gap-3">
          <Dots level={level} size="sm" />
          <span className="w-24 text-xs font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">{desc}</span>
        </div>
      ))}
    </div>
  );
}

export default function SkillDotSection({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="space-y-8">
      <Legend />

      {groups.map((group) => (
        <div key={group.category}>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {group.category}
          </h3>
          <div className="grid gap-y-3 sm:grid-cols-2">
            {group.skills.map((skill) => (
              <div key={skill.name} className="flex items-center justify-between gap-4 pr-8">
                <span className="text-sm font-medium">{skill.name}</span>
                <Dots level={skill.level} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
