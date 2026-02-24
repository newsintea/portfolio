import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer>
      <Separator />
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} newsintea. All rights reserved.</p>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://github.com/newsintea"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://x.com/newsintea_dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
