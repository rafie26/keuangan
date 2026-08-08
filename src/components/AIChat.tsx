"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updated_at: string;
}

const suggestionPrompts = [
  "Bagaimana cara saya menghemat pengeluaran bulan ini?",
  "Apakah saldo saya cukup untuk sisa bulan ini?",
  "Rekomendasikan anggaran ideal per kategori untuk bulan ini",
];

export default function AIChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const assistantTextRef = useRef("");

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from("chat_sessions")
      .select("id, title, messages, updated_at")
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        const list = (data ?? []) as ChatSession[];
        setSessions(list);
        if (list.length > 0) {
          setActiveId(list[0].id);
          setMessages(list[0].messages ?? []);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  function newChat() {
    abortRef.current?.abort();
    setActiveId(null);
    setMessages([]);
    setError(null);
  }

  function selectSession(session: ChatSession) {
    abortRef.current?.abort();
    setActiveId(session.id);
    setMessages(session.messages ?? []);
    setError(null);
  }

  async function deleteSession(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
    }
  }

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
    ];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    const supabase = createClient();
    let sessionId = activeId;

    if (!sessionId) {
      const title = nextMessages[0].content.slice(0, 40);
      const { data, error: insertError } = await supabase
        .from("chat_sessions")
        .insert({ title, messages: nextMessages })
        .select("id, title, messages, updated_at")
        .single();
      if (insertError || !data) {
        setError(insertError?.message ?? "Gagal membuat percakapan.");
        setLoading(false);
        return;
      }
      sessionId = data.id;
      setActiveId(sessionId);
      setSessions((prev) => [data as ChatSession, ...prev]);
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        let msg = `Terjadi kesalahan (${res.status}).`;
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {
          // ignore parse errors
        }
        throw new Error(msg);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Respons tidak terbaca.");

      const decoder = new TextDecoder();
      let buffer = "";
      assistantTextRef.current = "";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") continue;

          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (typeof delta === "string") {
              assistantTextRef.current += delta;
              const content = assistantTextRef.current;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                  role: "assistant",
                  content,
                };
                return copy;
              });
            }
          } catch {
            // ignore partial JSON lines
          }
        }
      }

      const finalMessages: ChatMessage[] = [
        ...nextMessages,
        { role: "assistant", content: assistantTextRef.current },
      ];
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("chat_sessions")
        .update({ messages: finalMessages, updated_at: now })
        .eq("id", sessionId!);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setSessions((prev) => {
        const rest = prev.filter((s) => s.id !== sessionId);
        const existing = prev.find((s) => s.id === sessionId);
        const updated: ChatSession = {
          id: sessionId!,
          title: existing?.title ?? nextMessages[0].content.slice(0, 40),
          messages: finalMessages,
          updated_at: now,
        };
        return [updated, ...rest];
      });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex h-[calc(100vh-16rem)] flex-col rounded-xl bg-surface-container-lowest card-shadow md:h-[calc(100vh-18rem)]">
      <div className="flex items-center gap-3 border-b border-outline-variant/30 px-unit-lg py-unit-md">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container/20 text-primary">
          <Icon icon="auto_awesome" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-headline-sm font-headline-sm text-on-surface">
            Penasihat AI
          </h2>
          <p className="truncate text-label-sm font-label-sm text-on-surface-variant">
            Bisa melihat saldo & transaksi Anda untuk memberi saran (read-only)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto border-b border-outline-variant/30 px-unit-lg py-unit-sm">
        <button
          type="button"
          onClick={newChat}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-label-sm font-label-sm transition-colors ${
            activeId === null
              ? "border-primary bg-primary-container/15 text-primary"
              : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary hover:text-primary"
          }`}
        >
          <Icon icon="add" className="text-sm" />
          Percakapan baru
        </button>
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 transition-colors ${
              activeId === s.id
                ? "border-primary bg-primary-container/15 text-primary"
                : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary hover:text-primary"
            }`}
          >
            <button
              type="button"
              onClick={() => selectSession(s)}
              className="max-w-[10rem] truncate text-label-sm font-label-sm"
              title={s.title}
            >
              {s.title}
            </button>
            <button
              type="button"
              onClick={() => deleteSession(s.id)}
              className="rounded-full p-0.5 hover:bg-surface-container-high"
              aria-label={`Hapus ${s.title}`}
            >
              <Icon icon="close" className="text-sm" />
            </button>
          </div>
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-unit-lg py-unit-md">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/20 text-primary">
              <Icon icon="savings" className="text-3xl" />
            </div>
            <div>
              <h3 className="mb-1 text-body-lg font-headline-sm text-on-surface">
                Tanya penasihat keuangan Anda
              </h3>
              <p className="mx-auto max-w-sm text-body-sm font-body-sm text-on-surface-variant">
                AI membaca saldo, pengeluaran bulan ini, anggaran, dan tujuan
                tabungan Anda untuk memberi rekomendasi hemat yang realistis.
              </p>
            </div>
            <div className="flex max-w-md flex-col gap-2">
              {suggestionPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => sendMessage(p)}
                  disabled={loading}
                  className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-left text-label-md font-label-md text-on-surface-variant transition-colors hover:border-primary hover:bg-surface-container hover:text-primary disabled:opacity-60"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-4 py-3 text-body-sm font-body-sm ${
                  msg.role === "user"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-low text-on-surface"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-xl bg-surface-container-low px-4 py-3">
              <Icon icon="auto_awesome" className="animate-pulse text-primary" />
              <span className="text-label-sm font-label-sm text-on-surface-variant">
                AI sedang menulis...
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-outline-variant/30 px-unit-lg py-unit-md">
        {error && (
          <p className="mb-2 text-label-sm font-label-sm text-error">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Contoh: Bagaimana cara menghemat bulan ini?"
            disabled={loading}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-60"
            aria-label="Kirim pesan"
          >
            <Icon icon="send" className="text-sm" />
            <span className="hidden sm:inline">Kirim</span>
          </button>
        </form>
      </div>
    </div>
  );
}
