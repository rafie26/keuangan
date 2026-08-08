"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import Icon from "./Icon";
import {
  closeMobileMenu,
  getMobileMenuState,
  subscribeMobileMenu,
} from "@/lib/mobile-menu";

const navItems = [
  { icon: "dashboard", label: "Dasbor", href: "/dashboard" },
  { icon: "receipt_long", label: "Transaksi", href: "/transaksi" },
  { icon: "savings", label: "Tujuan Tabungan", href: "/tabungan" },
  { icon: "account_balance_wallet", label: "Anggaran", href: "/anggaran" },
  { icon: "auto_awesome", label: "Penasihat AI", href: "/ai" },
];

function SidebarContent() {
  const pathname = usePathname();

  return (
    <>
      <a href="/dashboard" className="mb-unit-xl block px-unit-sm">
        <h1 className="text-headline-md font-headline-md font-bold text-primary">
          Keuangan
        </h1>
        <p className="text-label-sm font-label-sm text-on-surface-variant">
          Penasihat Premium
        </p>
      </a>
      <ul className="flex-1 space-y-2">
        {navItems.map((item) => {
          const active =
            item.href !== "#" && pathname.startsWith(item.href);
          return (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-label-md font-label-md transition-colors duration-200 ${
                  active
                    ? "border-r-4 border-primary bg-primary-container/10 font-bold text-primary opacity-90"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                }`}
              >
                <Icon icon={item.icon} />
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto border-t border-outline-variant/30 pt-unit-md">
        <a
          href="/transaksi"
          onClick={closeMobileMenu}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container"
        >
          <Icon icon="add" />
          <span className="text-label-md font-label-md">Tambah Transaksi</span>
        </a>
        <ul className="space-y-1">
          <li>
            <a
              href="/pengaturan"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-on-surface-variant transition-colors duration-200 hover:bg-surface-container-high hover:text-primary"
            >
              <Icon icon="settings" />
              <span className="text-label-sm font-label-sm">Pengaturan</span>
            </a>
          </li>
          <li>
            <a
              href="/dukungan"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-on-surface-variant transition-colors duration-200 hover:bg-surface-container-high hover:text-primary"
            >
              <Icon icon="help" />
              <span className="text-label-sm font-label-sm">Dukungan</span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default function Sidebar() {
  const open = useSyncExternalStore(
    subscribeMobileMenu,
    getMobileMenuState
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) closeMobileMenu();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col bg-surface px-unit-md py-unit-lg shadow-[4px_0_12px_rgba(30,58,138,0.08)] md:flex">
        <SidebarContent />
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 md:hidden ${
          open ? "" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMobileMenu}
        />
        <nav
          className={`absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-surface px-unit-md py-unit-lg shadow-[4px_0_12px_rgba(30,58,138,0.16)] transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          <button
            onClick={closeMobileMenu}
            className="mb-4 self-end rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high"
            aria-label="Tutup menu"
          >
            <Icon icon="close" />
          </button>
          <SidebarContent />
        </nav>
      </div>
    </>
  );
}
