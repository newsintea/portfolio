"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [animKey, setAnimKey] = useState(0);

  const handleClick = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setAnimKey((k) => k + 1);
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="cursor-pointer"
      onClick={handleClick}
    >
      <div
        key={animKey}
        className={`relative flex items-center justify-center${animKey > 0 ? " anim-spin-once" : ""}`}
      >
        <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
