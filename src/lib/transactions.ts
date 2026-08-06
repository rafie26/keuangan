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

export const categoryIconOptions = [
  "work",
  "payments",
  "restaurant",
  "shopping_cart",
  "home",
  "bolt",
  "directions_car",
  "movie",
  "medical_services",
  "school",
  "fitness_center",
  "pets",
  "sports_esports",
  "redeem",
  "local_cafe",
  "phone_iphone",
  "more_horiz",
];

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
