"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";

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
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
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

    setPending(true);
    const supabase = createClient();
    const ext =
      file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ??
      "png";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (uploadError) {
      setError(uploadError.message);
      setPending(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: data.publicUrl },
    });
    setPending(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {avatarUrl ? (
          <Image
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

      {error && (
        <p className="text-label-sm font-label-sm text-error">{error}</p>
      )}
      {saved && (
        <p className="text-label-sm font-label-sm text-secondary">
          Foto profil berhasil diperbarui.
        </p>
      )}
    </div>
  );
}
