"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createTrip } from "@/lib/admin-actions";

export default function NewTripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: "",
    title: "",
    started_at: "",
    ended_at: "",
    color: "#6B7280",
    prefectures: "",
    companions: "",
    memo: "",
  });

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createTrip({
        id: form.id,
        title: form.title,
        started_at: form.started_at,
        ended_at: form.ended_at || null,
        color: form.color,
        prefectures: form.prefectures
          ? form.prefectures.split(",").map((s) => s.trim()).filter(Boolean)
          : null,
        companions: form.companions
          ? form.companions.split(",").map((s) => s.trim()).filter(Boolean)
          : null,
        memo: form.memo || null,
      });
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold">New Trip</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="ID *" hint="例: tokyo-2026">
          <input
            required
            value={form.id}
            onChange={(e) => set("id", e.target.value)}
            placeholder="hakata-saga-2025"
            className={inputCls}
          />
        </Field>

        <Field label="タイトル *">
          <input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="博多・佐賀"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="開始日 *">
            <input
              required
              type="date"
              value={form.started_at}
              onChange={(e) => set("started_at", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="終了日">
            <input
              type="date"
              value={form.ended_at}
              onChange={(e) => set("ended_at", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="カラー *">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              className="h-11 w-14 cursor-pointer rounded-md border bg-background p-1"
            />
            <input
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              placeholder="#6B7280"
              className={`${inputCls} flex-1`}
            />
          </div>
        </Field>

        <Field label="都道府県" hint="カンマ区切り: 福岡県, 佐賀県">
          <input
            value={form.prefectures}
            onChange={(e) => set("prefectures", e.target.value)}
            placeholder="福岡県, 佐賀県"
            className={inputCls}
          />
        </Field>

        <Field label="同行者" hint="カンマ区切り">
          <input
            value={form.companions}
            onChange={(e) => set("companions", e.target.value)}
            placeholder="Alice, Bob"
            className={inputCls}
          />
        </Field>

        <Field label="メモ">
          <textarea
            value={form.memo}
            onChange={(e) => set("memo", e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </Field>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "作成中..." : "作成"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">
        {label}
        {hint && (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
