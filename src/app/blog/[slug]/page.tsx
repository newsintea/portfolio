import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/blog">&larr; Back to Blog</Link>
      </Button>

      <article className="mt-8">
        <header className="mb-8">
          <h1 className="mb-3 text-3xl font-bold tracking-tight">
            {post.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            <time dateTime={post.date}>{post.date}</time>
            <span className="mx-2">&middot;</span>
            <span>{post.readingTime}</span>
          </p>
        </header>

        <Separator className="mb-8" />

        <div className="prose">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </div>
  );
}
