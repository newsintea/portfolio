"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogCard from "@/components/BlogCard";
import { CATEGORIES, type Category } from "@/lib/blog-types";

type BlogPostSummary = {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: Category;
  readingTime: string;
};

type BlogTabsProps = {
  postsByCategory: Record<Category, BlogPostSummary[]>;
};

export function BlogTabs({ postsByCategory }: BlogTabsProps) {
  return (
    <Tabs defaultValue="tech">
      <TabsList>
        {Object.entries(CATEGORIES).map(([key, label]) => (
          <TabsTrigger key={key} value={key}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(CATEGORIES).map(([key]) => {
        const category = key as Category;
        const posts = postsByCategory[category];

        return (
          <TabsContent key={key} value={key}>
            {posts.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                まだ記事がありません。
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {posts.map((post) => (
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
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
