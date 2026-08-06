export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  name: string;
  category: string;
  icon: string;
  amount: number;
  created_at: string;
}

export const categories = [
  { name: "Pendapatan", icon: "work" },
  { name: "Makanan", icon: "restaurant" },
  { name: "Belanjaan", icon: "shopping_cart" },
  { name: "Perumahan", icon: "home" },
  { name: "Utilitas", icon: "bolt" },
  { name: "Transportasi", icon: "directions_car" },
  { name: "Hiburan", icon: "movie" },
  { name: "Kesehatan", icon: "medical_services" },
  { name: "Pendidikan", icon: "school" },
  { name: "Lainnya", icon: "more_horiz" },
];

export function iconForCategory(category: string): string {
  return categories.find((c) => c.name === category)?.icon ?? "more_horiz";
}

export function formatRupiah(value: number): string {
  return "Rp " + new Intl.NumberFormat("id-ID").format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
