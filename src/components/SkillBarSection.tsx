type Skill = { name: string; level: number }; // 1–5
type SkillGroup = { category: string; skills: Skill[] };

const LEVEL_LABELS = ["", "Beginner", "Basic", "Intermediate", "Advanced", "Expert"];

function Bar({ level }: { level: number }) {
  return (
    <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-muted">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-foreground"
        style={{ width: `${level * 20}%` }}
      />
    </div>
  );
}

export default function SkillBarSection({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.category}>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {group.category}
          </h3>
          <div className="space-y-3">
            {group.skills.map((skill) => (
              <div key={skill.name} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-sm font-medium">{skill.name}</span>
                <Bar level={skill.level} />
                <span className="w-24 shrink-0 text-right text-xs text-muted-foreground">
                  {LEVEL_LABELS[skill.level]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
