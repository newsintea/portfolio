"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PlaceWizard from "@/app/admin/_components/PlaceWizard";
import { ArrowLeft } from "lucide-react";

export default function NewPlacePage() {
  const router = useRouter();

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/admin">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">New Place</h1>
      </div>

      <PlaceWizard
        tripId={null}
        onDone={() => router.push("/admin")}
        onCancel={() => router.push("/admin")}
      />
    </div>
  );
}
