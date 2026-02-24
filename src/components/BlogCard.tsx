import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type BlogCardProps = {
  slug: string;
  title: string;
  date: string;
  description: string;
  readingTime: string;
};

export default function BlogCard({
  slug,
  title,
  date,
  description,
  readingTime,
}: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block">
      <Card className="transition-colors group-hover:border-foreground/20">
        <CardHeader>
          <CardDescription>
            <time dateTime={date}>{date}</time>
            <span className="mx-2">&middot;</span>
            <span>{readingTime}</span>
          </CardDescription>
          <CardTitle className="text-lg group-hover:text-primary/80">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
