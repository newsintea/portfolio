import type { Metadata } from "next";
import { getAllPosts, CATEGORIES, type Category } from "@/lib/blog";
import { BlogTabs } from "@/components/BlogTabs";

export const metadata: Metadata = {
  title: "Blog",
  description: "技術記事やアウトプットを掲載しています",
};

type BlogPostSummary = {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: Category;
  readingTime: string;
};

export default function BlogPage() {
  const posts = getAllPosts();

  const postsByCategory = Object.keys(CATEGORIES).reduce(
    (acc, key) => {
      const category = key as Category;
      acc[category] = posts
        .filter((post) => post.category === category)
        .map(({ content: _, ...summary }) => summary);
      return acc;
    },
    {} as Record<Category, BlogPostSummary[]>
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mb-8 text-muted-foreground">
        技術記事やアウトプットを掲載しています。
      </p>

      <BlogTabs postsByCategory={postsByCategory} />
    </div>
  );
}
