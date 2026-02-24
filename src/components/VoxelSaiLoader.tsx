"use client";

import dynamic from "next/dynamic";

const VoxelSai = dynamic(() => import("@/components/VoxelSai"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] w-[280px] items-center justify-center sm:h-[480px] sm:w-[480px] lg:h-[640px] lg:w-[640px]">
      <div className="size-8 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent" />
    </div>
  ),
});

export default function VoxelSaiLoader() {
  return <VoxelSai />;
}
