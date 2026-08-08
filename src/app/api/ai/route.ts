import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "XAI_API_KEY belum dikonfigurasi di server." },
      { status: 500 }
    );
  }

  let messages: { role: string; content: string }[] = [];
  try {
    const body = await request.json();
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    // fallthrough to empty check below
  }
  if (messages.length === 0) {
    return Response.json({ error: "Tidak ada pesan." }, { status: 400 });
  }

  const context = await buildFinancialContext(supabase);

  const systemPrompt = `Kamu adalah penasihat keuangan pribadi bernama Grok yang ramah, membantu, dan praktis untuk aplikasi "Keuangan" di Indonesia.

Kamu MENERIMA data keuangan user di bawah ini dan harus menggunakannya untuk menjawab pertanyaan.

ATURAN:
- Kamu hanya BISA MELIHAT data. Kamu TIDAK bisa menambah, mengubah, atau menghapus transaksi/akun.
- Jawab dalam Bahasa Indonesia yang santai tapi profesional.
- Jika user bertanya rekomendasi penghematan: berikan saran realistis berdasarkan saldo, pemasukan, pengeluaran bulan ini, anggaran, dan pola transaksi mereka. Sebutkan angka konkret dalam Rupiah bila membantu.
- Jangan mengada-ada. Jika data kurang, katakan dengan jujur dan minta user mengisi transaksi dulu.
- Jangan menyebutkan data user di luar konteks pertanyaan.
- Balas dengan singkat, terstruktur (bisa pakai bullet list), dan langsung ke intinya. Hindari basa-basi panjang.

DATA KEUANGAN USER SAAT INI (bulan ${new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date())}):
${JSON.stringify(context, null, 2)}`;

  const xaiMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const upstream = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.XAI_MODEL || "grok-4.5",
      stream: true,
      messages: xaiMessages,
    }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    console.error("Grok API error:", upstream.status, detail.slice(0, 500));
    return Response.json(
      { error: `Grok API error ${upstream.status}.` },
      { status: 502 }
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

async function buildFinancialContext(supabase: Awaited<ReturnType<typeof createClient>>) {
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();

  const [{ data: txData }, { data: budgetsData }, { data: goalsData }] =
    await Promise.all([
      supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      supabase.from("budgets").select("*"),
      supabase.from("savings_goals").select("*"),
    ]);

  const transactions = txData ?? [];
  const budgets = budgetsData ?? [];
  const goals = goalsData ?? [];

  let totalIncome = 0;
  let totalExpense = 0;
  let monthlyIncome = 0;
  let monthlyExpense = 0;

  const categorySpending = new Map<string, number>();

  for (const t of transactions) {
    const amount = Number(t.amount);
    const d = new Date(t.created_at);
    const isThisMonth =
      d.getFullYear() === thisYear && d.getMonth() === thisMonth;

    if (t.type === "income") {
      totalIncome += amount;
      if (isThisMonth) monthlyIncome += amount;
    } else {
      totalExpense += amount;
      if (isThisMonth) {
        monthlyExpense += amount;
        categorySpending.set(
          t.category,
          (categorySpending.get(t.category) ?? 0) + amount
        );
      }
    }
  }

  return {
    totalBalance: totalIncome - totalExpense,
    monthly: {
      income: monthlyIncome,
      expense: monthlyExpense,
      remaining: monthlyIncome - monthlyExpense,
      spendingByCategory: Object.fromEntries(
        [...categorySpending.entries()].sort((a, b) => b[1] - a[1])
      ),
    },
    budgets: budgets.map((b) => ({
      category: b.category,
      limit: Number(b.limit_amount),
    })),
    savingsGoals: goals.map((g) => ({
      name: g.name,
      target: Number(g.target_amount),
      saved: Number(g.saved_amount),
    })),
    recentTransactions: transactions.slice(0, 20).map((t) => ({
      type: t.type,
      name: t.name,
      category: t.category,
      amount: Number(t.amount),
      date: t.created_at,
    })),
  };
}
