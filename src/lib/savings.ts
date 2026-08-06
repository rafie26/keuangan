export interface SavingsGoal {
  id: string;
  name: string;
  icon: string;
  target_amount: number;
  saved_amount: number;
  created_at: string;
}

export const goalIcons = [
  { icon: "savings", label: "Umum" },
  { icon: "emergency", label: "Dana Darurat" },
  { icon: "home", label: "Rumah" },
  { icon: "directions_car", label: "Mobil" },
  { icon: "flight", label: "Liburan" },
  { icon: "school", label: "Pendidikan" },
  { icon: "smartphone", label: "Gadget" },
  { icon: "celebration", label: "Acara" },
  { icon: "storefront", label: "Usaha" },
  { icon: "shopping_bag", label: "Belanja" },
];

export function progressPercent(goal: Pick<SavingsGoal, "target_amount" | "saved_amount">): number {
  if (goal.target_amount <= 0) return 0;
  return Math.min(100, Math.round((Number(goal.saved_amount) / Number(goal.target_amount)) * 100));
}
