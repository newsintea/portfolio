"use client";

import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";

export default function GitHubContributions({ username }: { username: string }) {
  const { resolvedTheme } = useTheme();

  return (
    <GitHubCalendar
      username={username}
      colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
      fontSize={12}
      blockSize={13}
      blockMargin={4}
    />
  );
}
