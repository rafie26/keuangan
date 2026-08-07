"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";

interface CropState {
  src: string;
  naturalW: number;
  naturalH: number;
  zoom: number;
  x: number;
  y: number;
}

const MAX_ZOOM = 3;
const OUT_SIZE = 512;

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

export default function AvatarUploader({
  userId,
  avatarUrl,
  name,
}: {
  userId: string;
  avatarUrl: string;
  name: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const urlRef = useRef<string | null>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const initializedRef = useRef(false);

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [crop, setCrop] = useState<CropState | null>(null);
  const [sizePx, setSizePx] = useState(0);

  const cropOpen = crop !== null;

  const closeCrop = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    imgRef.current = null;
    initializedRef.current = false;
    setCrop(null);
    setSizePx(0);
    setError(null);
  }, []);

  useEffect(() => {
    if (!cropOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCrop();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [cropOpen, closeCrop]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setSizePx(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cropOpen]);

  useEffect(() => {
    if (!crop || sizePx <= 0 || initializedRef.current) return;
    initializedRef.current = true;
    const min = Math.min(crop.naturalW, crop.naturalH);
    const baseW = (crop.naturalW / min) * sizePx;
    const baseH = (crop.naturalH / min) * sizePx;
    const dispW = baseW * crop.zoom;
    const dispH = baseH * crop.zoom;
    setCrop((c) =>
      c ? { ...c, x: (sizePx - dispW) / 2, y: (sizePx - dispH) / 2 } : c
    );
  }, [crop, sizePx]);

  let dispW = 0;
  let dispH = 0;
  let imgX = 0;
  let imgY = 0;
  if (crop && sizePx > 0) {
    const min = Math.min(crop.naturalW, crop.naturalH);
    const baseW = (crop.naturalW / min) * sizePx;
    const baseH = (crop.naturalH / min) * sizePx;
    dispW = baseW * crop.zoom;
    dispH = baseH * crop.zoom;
    imgX = clamp(crop.x, sizePx - dispW, 0);
    imgY = clamp(crop.y, sizePx - dispH, 0);
  }

  function changeZoom(z: number) {
    if (!crop || sizePx <= 0) return;
    const min = Math.min(crop.naturalW, crop.naturalH);
    const baseW = (crop.naturalW / min) * sizePx;
    const baseH = (crop.naturalH / min) * sizePx;
    const zoom = clamp(z, 1, MAX_ZOOM);
    if (zoom === crop.zoom) return;
    const fracX = (-crop.x + sizePx / 2) / (baseW * crop.zoom);
    const fracY = (-crop.y + sizePx / 2) / (baseH * crop.zoom);
    const dispW = baseW * zoom;
    const dispH = baseH * zoom;
    const nx = -(fracX * dispW - sizePx / 2);
    const ny = -(fracY * dispH - sizePx / 2);
    setCrop({
      ...crop,
      zoom,
      x: clamp(nx, sizePx - dispW, 0),
      y: clamp(ny, sizePx - dispH, 0),
    });
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: imgX,
      origY: imgY,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    if (!d || !crop || sizePx <= 0) return;
    const min = Math.min(crop.naturalW, crop.naturalH);
    const baseW = (crop.naturalW / min) * sizePx;
    const baseH = (crop.naturalH / min) * sizePx;
    const dispW = baseW * crop.zoom;
    const dispH = baseH * crop.zoom;
    const nx = clamp(d.origX + (e.clientX - d.startX), sizePx - dispW, 0);
    const ny = clamp(d.origY + (e.clientY - d.startY), sizePx - dispH, 0);
    setCrop({ ...crop, x: nx, y: ny });
  }

  function handlePointerEnd() {
    dragRef.current = null;
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    setSaved(false);

    if (!file.type.startsWith("image/")) {
      setError("Pilih file gambar (JPG, PNG, WebP, atau GIF).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto maksimal 2 MB.");
      return;
    }

    const url = URL.createObjectURL(file);
    urlRef.current = url;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setCrop({
        src: url,
        naturalW: img.naturalWidth,
        naturalH: img.naturalHeight,
        zoom: 1,
        x: 0,
        y: 0,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      urlRef.current = null;
      setError("Gagal membaca gambar. Coba pilih file lain.");
    };
    img.src = url;
  }

  function cropToBlob(x: number, y: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = imgRef.current;
      if (!img || !crop || sizePx <= 0) {
        reject(new Error("Gagal memuat gambar."));
        return;
      }
      const min = Math.min(crop.naturalW, crop.naturalH);
      const scale = (sizePx / min) * crop.zoom;
      const srcX = -x / scale;
      const srcY = -y / scale;
      const srcSize = sizePx / scale;

      const canvas = document.createElement("canvas");
      canvas.width = OUT_SIZE;
      canvas.height = OUT_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Gagal memproses gambar."));
        return;
      }
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, OUT_SIZE, OUT_SIZE);
      canvas.toBlob(
        (b) =>
          b ? resolve(b) : reject(new Error("Gagal memproses gambar.")),
        "image/jpeg",
        0.92
      );
    });
  }

  async function handleSave() {
    try {
      const blob = await cropToBlob(imgX, imgY);
      setPending(true);
      const file = new File([blob], `avatar-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      const supabase = createClient();
      const path = `${userId}/avatar-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw new Error(uploadError.message);

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: data.publicUrl,
          custom_avatar_url: data.publicUrl,
        },
      });
      if (updateError) throw new Error(updateError.message);

      setSaved(true);
      closeCrop();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan foto profil.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {avatarUrl ? (
          <NextImage
            className="h-24 w-24 rounded-full object-cover"
            src={avatarUrl}
            alt="Foto profil"
            width={96}
            height={96}
          />
        ) : (
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon icon="person" className="text-4xl" />
          </span>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary shadow transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-60"
          aria-label="Ganti foto profil"
        >
          <Icon icon={pending ? "hourglass_top" : "photo_camera"} className="text-sm" />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      <p className="text-label-sm font-label-sm text-on-surface-variant">
        {name}
      </p>

      {error && !cropOpen && (
        <p className="text-label-sm font-label-sm text-error">{error}</p>
      )}
      {saved && (
        <p className="text-label-sm font-label-sm text-secondary">
          Foto profil berhasil diperbarui.
        </p>
      )}

      {cropOpen && crop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeCrop}
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-surface-container-lowest card-shadow"
            role="dialog"
            aria-modal="true"
            aria-label="Pratinjau dan potong foto profil"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 px-5 py-4">
              <h3 className="text-headline-sm font-headline-sm text-on-surface">
                Foto Profil
              </h3>
              <button
                onClick={closeCrop}
                disabled={pending}
                className="rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:opacity-60"
                aria-label="Tutup"
              >
                <Icon icon="close" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 p-5">
              <div
                ref={containerRef}
                className="relative aspect-square w-[min(70vw,288px)] touch-none select-none overflow-hidden rounded-full bg-surface-container-high"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={crop.src}
                  alt="Pratinjau foto profil"
                  draggable={false}
                  className="absolute max-w-none cursor-grab"
                  style={{ width: dispW, height: dispH, left: imgX, top: imgY }}
                />
              </div>

              <div className="flex w-full max-w-[288px] items-center gap-3">
                <Icon icon="zoom_in" className="text-on-surface-variant" />
                <input
                  type="range"
                  min={1}
                  max={MAX_ZOOM}
                  step={0.01}
                  value={crop.zoom}
                  onChange={(e) => changeZoom(Number(e.target.value))}
                  className="flex-1 accent-primary"
                  aria-label="Perbesar foto"
                />
                <Icon icon="zoom_out" className="text-on-surface-variant" />
              </div>

              <p className="text-label-sm font-label-sm text-on-surface-variant">
                Geser dan perbesar foto untuk memilih bagian yang diinginkan.
              </p>

              <div className="flex w-full gap-3">
                <button
                  onClick={closeCrop}
                  disabled={pending}
                  className="flex-1 rounded-lg border border-outline-variant px-4 py-2.5 text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-60"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={pending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-60"
                >
                  {pending && <Icon icon="hourglass_top" className="text-sm" />}
                  Simpan Foto
                </button>
              </div>

              {error && (
                <p className="text-label-sm font-label-sm text-error">{error}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
