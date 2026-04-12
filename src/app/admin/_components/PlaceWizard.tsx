"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createVisit, uploadPhotoFile, createPhotoRecord } from "@/lib/admin-actions";
import { Camera, MapPin, X, ArrowRight } from "lucide-react";

const CATEGORIES = [
  { id: "b355f055-9537-4b0f-9e16-4751e943b3df", name: "自然" },
  { id: "7cf403fd-31d7-408a-b000-597e500963bf", name: "グルメ" },
  { id: "338ff88c-a8c8-4abe-b86e-808a7bde72b8", name: "ホテル" },
  { id: "3c140546-df39-448e-9922-892524469610", name: "寺・神社" },
  { id: "0d7ba138-bdb6-49ee-b7af-c01f25954db2", name: "観光" },
  { id: "a904c33f-d8a9-4243-a4d4-cb7c1fcb9dc1", name: "温泉" },
];

const inputCls =
  "h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

type PhotoItem = {
  file: File;
  preview: string;
};

type FormState = {
  name: string;
  lat: string;
  lng: string;
  prefecture: string;
  visited_at: string;
  memo: string;
  rating: string;
  is_public: boolean;
  category_ids: string[];
};

type Props = {
  tripId?: string | null;
  onDone: () => void;
  onCancel: () => void;
};

export default function PlaceWizard({ tripId, onDone, onCancel }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"photos" | "form">("photos");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: "",
    lat: "",
    lng: "",
    prefecture: "",
    visited_at: "",
    memo: "",
    rating: "",
    is_public: true,
    category_ids: [],
  });

  function setField(key: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCategory(id: string) {
    setForm((prev) => ({
      ...prev,
      category_ids: prev.category_ids.includes(id)
        ? prev.category_ids.filter((c) => c !== id)
        : [...prev.category_ids, id],
    }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setProcessing(true);

    let bestDate: Date | null = null;
    let bestLat: number | null = null;
    let bestLng: number | null = null;

    const newPhotos: PhotoItem[] = await Promise.all(
      files.map(async (file) => {
        let jpegFile = file;

        // EXIF読み取り（変換前）
        try {
          const exifr = (await import("exifr")).default;
          const [exif, gps] = await Promise.all([
            exifr.parse(file, ["DateTimeOriginal", "CreateDate"]),
            exifr.gps(file).catch(() => null),
          ]);

          const rawDate = exif?.DateTimeOriginal ?? exif?.CreateDate;
          if (rawDate) {
            const d = new Date(rawDate);
            if (!bestDate || d < bestDate) bestDate = d;
          }
          if (gps?.latitude != null && bestLat == null) {
            bestLat = gps.latitude;
            bestLng = gps.longitude;
          }
        } catch {
          // 無視
        }

        // HEIC変換
        const isHeic =
          file.type === "image/heic" ||
          file.type === "image/heif" ||
          file.name.toLowerCase().endsWith(".heic") ||
          file.name.toLowerCase().endsWith(".heif");

        if (isHeic) {
          try {
            const heic2any = (await import("heic2any")).default;
            const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.85 });
            const blob = Array.isArray(result) ? result[0] : result;
            jpegFile = new File(
              [blob],
              file.name.replace(/\.(heic|heif)$/i, ".jpg"),
              { type: "image/jpeg" }
            );
          } catch {
            // 変換失敗はそのまま
          }
        }

        return { file: jpegFile, preview: URL.createObjectURL(jpegFile) };
      })
    );

    setPhotos((prev) => [...prev, ...newPhotos]);

    // フォームにEXIFデータを反映（未入力のフィールドのみ）
    setForm((prev) => ({
      ...prev,
      visited_at:
        prev.visited_at === "" && bestDate
          ? bestDate.toISOString().slice(0, 10)
          : prev.visited_at,
      lat:
        prev.lat === "" && bestLat != null
          ? bestLat.toFixed(6)
          : prev.lat,
      lng:
        prev.lng === "" && bestLng != null
          ? bestLng.toFixed(6)
          : prev.lng,
    }));

    setProcessing(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setField("lat", pos.coords.latitude.toFixed(6));
        setField("lng", pos.coords.longitude.toFixed(6));
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.lat || !form.lng) {
      setError("緯度・経度を入力してください");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const { visitId } = await createVisit({
        trip_id: tripId ?? null,
        name: form.name,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        prefecture: form.prefecture || null,
        category_ids: form.category_ids,
        visited_at: form.visited_at || null,
        memo: form.memo || null,
        rating: form.rating ? parseInt(form.rating) : null,
        is_public: form.is_public,
      });

      // 写真アップロード
      for (const photo of photos) {
        const formData = new FormData();
        formData.append("file", photo.file);
        formData.append("trip_id", tripId ?? "misc");
        const { url } = await uploadPhotoFile(formData);
        await createPhotoRecord({ visit_id: visitId, url });
      }

      router.refresh();
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setSubmitting(false);
    }
  }

  // ── Step 1: 写真選択 ──────────────────────────────
  if (step === "photos") {
    return (
      <div className="flex flex-col gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          className="h-11"
        >
          <Camera />
          {processing ? "処理中..." : "写真を選択"}
        </Button>

        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, i) => (
              <div key={i} className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.preview}
                  alt=""
                  className="h-full w-full rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            キャンセル
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={() => setStep("form")}
            disabled={processing}
          >
            次へ
            <ArrowRight />
          </Button>
        </div>
      </div>
    );
  }

  // ── Step 2: フォーム ──────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* 写真サムネイル */}
      {photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={photo.preview}
              alt=""
              className="size-16 shrink-0 rounded-md object-cover"
            />
          ))}
        </div>
      )}

      <Field label="場所名 *">
        <input
          required
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="太宰府天満宮"
          className={inputCls}
          autoFocus
        />
      </Field>

      <Field label="位置情報 *">
        <div className="flex gap-2">
          <input
            value={form.lat}
            onChange={(e) => setField("lat", e.target.value)}
            placeholder="緯度"
            className={`${inputCls} flex-1`}
            inputMode="decimal"
          />
          <input
            value={form.lng}
            onChange={(e) => setField("lng", e.target.value)}
            placeholder="経度"
            className={`${inputCls} flex-1`}
            inputMode="decimal"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-11 shrink-0"
            onClick={getCurrentLocation}
            disabled={gpsLoading}
            title="現在地を取得"
          >
            <MapPin className={gpsLoading ? "animate-pulse" : ""} />
          </Button>
        </div>
      </Field>

      <Field label="都道府県">
        <input
          value={form.prefecture}
          onChange={(e) => setField("prefecture", e.target.value)}
          placeholder="福岡県"
          className={inputCls}
        />
      </Field>

      <Field label="カテゴリ">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                form.category_ids.includes(cat.id)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-accent"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </Field>

      <Field label="訪問日">
        <input
          type="date"
          value={form.visited_at}
          onChange={(e) => setField("visited_at", e.target.value)}
          className={inputCls}
        />
      </Field>

      <Field label="評価">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() =>
                setField("rating", form.rating === String(n) ? "" : String(n))
              }
              className={`flex size-10 items-center justify-center rounded-md border text-sm transition-colors ${
                form.rating === String(n)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-accent"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </Field>

      <Field label="メモ">
        <textarea
          value={form.memo}
          onChange={(e) => setField("memo", e.target.value)}
          rows={3}
          className={`${inputCls} h-auto resize-none py-2`}
        />
      </Field>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_public"
          checked={form.is_public}
          onChange={(e) => setField("is_public", e.target.checked)}
          className="size-4 rounded border"
        />
        <label htmlFor="is_public" className="text-sm">
          公開する
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => setStep("photos")}
          disabled={submitting}
        >
          戻る
        </Button>
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? "追加中..." : "追加"}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
