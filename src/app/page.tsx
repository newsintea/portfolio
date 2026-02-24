import Link from "next/link";
import { Button } from "@/components/ui/button";
import VoxelSaiLoader from "@/components/VoxelSaiLoader";

export default function Home() {
  return (
    <div className="relative flex min-h-[calc(100vh-57px)] flex-col items-center justify-center">
      {/* 3D Model */}
      <VoxelSaiLoader />

      {/* Greeting Overlay */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-xl bg-background/60 px-8 py-6 text-center backdrop-blur-md sm:bottom-16">
        <p className="mb-1 text-sm text-muted-foreground">
          Web Application Engineer
        </p>
        <h1 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome to newsintea&apos;s Portfolio
        </h1>
        <Button asChild>
          <Link href="/profile">Profile を見る &rarr;</Link>
        </Button>
      </div>
    </div>
  );
}
