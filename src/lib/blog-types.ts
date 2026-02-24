export const CATEGORIES = {
  tech: "Tech",
  poem: "Poem",
} as const;

export type Category = keyof typeof CATEGORIES;

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: Category;
  readingTime: string;
  content: string;
};
