import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/blog";
import GitHubContributions from "@/components/GitHubCalendar";
import SkillDotSection from "@/components/SkillDotSection";

const skills = [
  {
    category: "Languages",
    skills: [
      { name: "TypeScript", level: 5 },
      { name: "JavaScript", level: 5 },
      { name: "Java", level: 2 },
      { name: "HTML", level: 4 },
      { name: "CSS", level: 4 },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", level: 5 },
      { name: "Next.js", level: 3 },
      { name: "Vue", level: 4 },
      { name: "Nuxt", level: 3 },
      { name: "MUI", level: 4 },
      { name: "Ant Design", level: 4 },
      { name: "Element Plus", level: 3 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Ruby on Rails", level: 2 },
      { name: "Spring Boot", level: 2 },
      { name: "PostgreSQL", level: 2 },
      { name: "MySQL", level: 2 },
    ],
  },
  {
    category: "Testing",
    skills: [
      { name: "Jest", level: 3 },
      { name: "React Testing Library", level: 3 },
      { name: "Storybook", level: 3 },
    ],
  },
  {
    category: "Infra / Tools",
    skills: [
      { name: "Docker", level: 2 },
      { name: "AWS", level: 2 },
      { name: "Git", level: 5 },
      { name: "Vercel", level: 3 },
    ],
  },
  {
    category: "AI / Editor",
    skills: [
      { name: "Claude Code", level: 4 },
      { name: "Cursor", level: 3 },
      { name: "VS Code", level: 5 },
    ],
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

      {/* GitHub Contributions */}
      <section className="py-12">
        <h2 className="mb-6 text-xl font-bold">GitHub Contributions</h2>
        <div className="overflow-x-auto">
          <GitHubContributions username="newsintea" />
        </div>
      </section>

      <Separator />

      {/* Skills */}
      <section className="py-12">
        <h2 className="mb-6 text-xl font-bold">Skills</h2>
        <SkillDotSection groups={skills} />
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
