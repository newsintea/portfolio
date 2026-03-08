export type SkillLevel = "expert" | "proficient" | "familiar";
type Skill = { name: string; level: SkillLevel };
type SkillGroup = { category: string; skills: Skill[] };

const levelStyles: Record<SkillLevel, string> = {
  expert:     "bg-foreground text-background font-semibold",
  proficient: "bg-muted text-foreground font-medium",
  familiar:   "border border-border text-muted-foreground font-normal",
};

const legendItems: { level: SkillLevel; label: string }[] = [
  { level: "expert",     label: "Expert" },
  { level: "proficient", label: "Proficient" },
  { level: "familiar",   label: "Familiar" },
];

export default function SkillTagSection({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="space-y-8">
      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {legendItems.map(({ level, label }) => (
          <span key={level} className={`rounded-full px-3 py-0.5 text-xs ${levelStyles[level]}`}>
            {label}
          </span>
        ))}
      </div>

      {groups.map((group) => (
        <div key={group.category}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {group.category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <span
                key={skill.name}
                className={`rounded-full px-3 py-1 text-sm ${levelStyles[skill.level]}`}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
