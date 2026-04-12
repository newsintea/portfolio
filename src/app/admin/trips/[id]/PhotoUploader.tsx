"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { uploadPhotoFile, createPhotoRecord } from "@/lib/admin-actions";
import { Camera, X } from "lucide-react";

type Props = { visitId: string; tripId: string; onDone: () => void };

type PreviewItem = {
  file: File; // already converted to JPEG if HEIC
  preview: string;
  exifDate: string | null;
  uploading: boolean;
  error: string | null;
};

export default function PhotoUploader({ visitId, tripId, onDone }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<PreviewItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setProcessing(true);

    const newItems: PreviewItem[] = await Promise.all(
      files.map(async (file) => {
        let jpegFile = file;
        let exifDate: string | null = null;

        try {
          // Read EXIF before HEIC conversion
          const exifr = (await import("exifr")).default;
          const exif = await exifr.parse(file, ["DateTimeOriginal", "CreateDate"]);
          if (exif?.DateTimeOriginal) {
            exifDate = new Date(exif.DateTimeOriginal).toISOString().slice(0, 10);
          }
        } catch {
          // EXIF読み取り失敗は無視
        }

        // HEIC → JPEG conversion
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
            jpegFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
              type: "image/jpeg",
            });
          } catch {
            // 変換失敗時はそのまま使う
          }
        }

        const preview = URL.createObjectURL(jpegFile);
        return { file: jpegFile, preview, exifDate, uploading: false, error: null };
      })
    );

    setItems((prev) => [...prev, ...newItems]);
    setProcessing(false);
    // Reset input so same files can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeItem(index: number) {
    setItems((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function uploadAll() {
    if (items.length === 0) return;
    setUploading(true);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      setItems((prev) =>
        prev.map((it, idx) => (idx === i ? { ...it, uploading: true } : it))
      );

      try {
        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("trip_id", tripId);

        const { url } = await uploadPhotoFile(formData);
        await createPhotoRecord({ visit_id: visitId, url });

        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, uploading: false } : it
          )
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i
              ? {
                  ...it,
                  uploading: false,
                  error: err instanceof Error ? err.message : "エラー",
                }
              : it
          )
        );
      }
    }

    setUploading(false);
    router.refresh();
    onDone();
  }

  return (
    <div className="flex flex-col gap-4 pt-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
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

      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {items.map((item, i) => (
            <div key={i} className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.preview}
                alt=""
                className="h-full w-full rounded-md object-cover"
              />
              {item.uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50">
                  <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
              {item.error && (
                <div className="absolute inset-0 flex items-center justify-center rounded-md bg-destructive/80">
                  <span className="text-xs text-white">Error</span>
                </div>
              )}
              {!item.uploading && (
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onDone}
          disabled={uploading}
        >
          キャンセル
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={uploadAll}
          disabled={items.length === 0 || uploading}
        >
          {uploading ? "アップロード中..." : `${items.length}枚をアップロード`}
        </Button>
      </div>
    </div>
  );
}
