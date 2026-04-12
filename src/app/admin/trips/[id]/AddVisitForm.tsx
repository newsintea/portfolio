"use client";

import PlaceWizard from "@/app/admin/_components/PlaceWizard";

type Props = { tripId: string; onDone: () => void };

export default function AddVisitForm({ tripId, onDone }: Props) {
  return <PlaceWizard tripId={tripId} onDone={onDone} onCancel={onDone} />;
}
