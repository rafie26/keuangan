import Image from "next/image";
import Icon from "./Icon";

export default function TopNav() {
  return (
    <header className="fixed right-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant/30 bg-surface/80 px-margin-mobile backdrop-blur-md md:w-[calc(100%-16rem)] md:px-margin-desktop">
      <div className="flex flex-1 items-center">
        <button
          className="mr-4 text-on-surface-variant md:hidden"
          aria-label="Menu"
        >
          <Icon icon="menu" />
        </button>
        <div className="relative hidden w-full max-w-md md:block">
          <Icon
            icon="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
          />
          <input
            type="text"
            placeholder="Cari..."
            className="w-full rounded-full border border-outline-variant bg-surface-container-low py-2 pl-10 pr-4 text-body-sm font-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="rounded-full p-2 text-on-surface-variant transition-all hover:bg-surface-container focus:ring-2 focus:ring-primary/20"
          aria-label="Notifikasi"
        >
          <Icon icon="notifications" />
        </button>
        <button
          className="rounded-full p-2 transition-all hover:bg-surface-container focus:ring-2 focus:ring-primary/20"
          aria-label="Profil"
        >
          <Image
            className="h-8 w-8 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOzExQkm81pByyqgBDkXDdrP1a_XkJlgCKepdXgkolGT3U0myE6HNXxlbHufTYehwEaHSPTh5TGFGI6GGDkO5-s3MOBESdfwu_0xryHcnSvoyn3LQ6MtutazlRtxqC38O449RUq7GjKRpRGOCjGh4uaHf7LmbaH9Ace2pV8oly-iuvazPw5xIyoAyY4POvAoTYGp8sZ1y4RfpPoFVNhm0KoccTb6MRO8GJJ9XPha0CrcHUkz6MkWWu7Q"
            alt="Foto profil"
            width={32}
            height={32}
          />
        </button>
      </div>
    </header>
  );
}
