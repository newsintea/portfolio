import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SkillCard from "@/components/SkillCard";
import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/blog";

const skills = [
  {
    category: "Languages",
    skills: ["TypeScript", "JavaScript", "Java", "HTML", "CSS"],
  },
  {
    category: "Frontend",
    skills: ["React", "Next.js", "Vue", "Nuxt", "MUI", "Ant Design", "Element Plus"],
  },
  {
    category: "Backend",
    skills: ["Ruby on Rails", "PostgreSQL", "MySQL"],
  },
  {
    category: "Testing",
    skills: ["Jest", "Vitest", "React Testing Library", "Storybook"],
  },
  {
    category: "Infra / Tools",
    skills: ["Docker", "AWS", "Git", "Vercel"],
  },
  {
    category: "AI / Editor",
    skills: ["OpenAI", "Claude Code", "Cursor", "VS Code"],
  },
];

export default function Profile() {
  const recentPosts = getAllPosts()
    .slice(0, 3)
    .map(({ content: _, ...summary }) => summary);

  return (
    <div className="mx-auto max-w-3xl px-6">
      {/* Hero */}
      <section className="pb-12 pt-8">
        <div className="mb-6 flex items-center gap-5">
          <Avatar className="size-20">
            <AvatarImage
              src="https://github.com/newsintea.png"
              alt="newsintea"
            />
            <AvatarFallback>NT</AvatarFallback>
          </Avatar>
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              Web Application Engineer
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              newsintea
            </h1>
          </div>
        </div>
        <p className="max-w-lg leading-relaxed text-muted-foreground">
          Webアプリケーションエンジニア。エンジニア歴5年以上。
          React / Vue / Next.js / Nuxt / Ruby on Rails など
          フロントエンドからバックエンドまで幅広い技術スタックで開発しています。
        </p>
      </section>

      <Separator />

      {/* Skills */}
      <section className="py-12">
        <h2 className="mb-6 text-xl font-bold">Skills</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((s) => (
            <SkillCard key={s.category} category={s.category} skills={s.skills} />
          ))}
        </div>
      </section>

      <Separator />

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Posts</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog">View all &rarr;</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            {recentPosts.map((post) => (
              <BlogCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                date={post.date}
                description={post.description}
                readingTime={post.readingTime}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
