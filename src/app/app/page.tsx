"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { decodeApiKey } from "@/lib/auth";
import type { Scene, PlatformSize } from "@/lib/scenes";

/* ─── Icons (inline, no deps) ─── */
const I = {
  Upload: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  ),
  Sparkle: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3l1.9 5.5L19 10l-5.1 1.5L12 17l-1.9-5.5L5 10l5.1-1.5L12 3z" />
    </svg>
  ),
  Download: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  ),
  Refresh: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M23 4v6h-6M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  ),
  X: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  Key: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3" />
    </svg>
  ),
  Check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12l5 5L20 7" />
    </svg>
  ),
  Image: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  Alert: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  ),
};

const STORAGE_KEY = "psc_api_key";
const TRIAL_KEY = "psc_free_trial_used";
const FREE_TRIAL = 3;
const MAX_BYTES = 10 * 1024 * 1024;
const CATEGORIES = ["All", "Solid", "Lifestyle", "Texture", "Seasonal"] as const;

type Category = (typeof CATEGORIES)[number];

interface GenResponse {
  images: string[];
  remaining: number | null;
  newKey?: string | null;
  mode: "free" | "paid";
  usedFallback: boolean;
  scene: string;
  size: string;
  error?: string;
  freeTrialLimit?: number;
}

export default function AppPage() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [sizes, setSizes] = useState<PlatformSize[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [imageData, setImageData] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [category, setCategory] = useState<Category>("All");
  const [sceneId, setSceneId] = useState<string>("white_clean");
  const [sizeId, setSizeId] = useState<string>("amazon_main");

  const [apiKey, setApiKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [genError, setGenError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [trialUsed, setTrialUsed] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Bootstrap: load scenes/sizes + stored key ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/scenes", { cache: "force-cache" });
        const data = await res.json();
        if (!cancelled) {
          setScenes(data.scenes || []);
          setSizes(data.sizes || []);
        }
      } catch (e) {
        console.error("failed to load scenes", e);
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    })();

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setApiKey(stored);
      setKeyInput(stored);
      const p = decodeApiKey(stored);
      if (p) {
        setCredits(p.credits);
        setPlan(p.plan);
      }
    }
    const trial = Number(localStorage.getItem(TRIAL_KEY) || "0");
    if (!Number.isNaN(trial)) setTrialUsed(trial);
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredScenes = useMemo(() => {
    if (category === "All") return scenes;
    return scenes.filter((s) => s.category === category);
  }, [scenes, category]);

  const selectedSize = useMemo(
    () => sizes.find((s) => s.id === sizeId),
    [sizes, sizeId]
  );

  const canGenerate =
    !!imageData && !!sceneId && !!sizeId && !generating &&
    (!!apiKey || trialUsed < FREE_TRIAL);

  /* ── File handling ── */
  const handleFile = useCallback((file: File | undefined | null) => {
    setImageError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file (JPG or PNG).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setImageError("Image is larger than 10 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageData(reader.result);
        setImageName(file.name);
        setResults([]);
      }
    };
    reader.onerror = () => setImageError("Could not read file.");
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFile(e.dataTransfer.files?.[0]);
    },
    [handleFile]
  );

  const onPick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFile(e.target.files?.[0]);
      e.target.value = "";
    },
    [handleFile]
  );

  /* ── Key handling ── */
  const saveKey = useCallback(() => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      localStorage.removeItem(STORAGE_KEY);
      setApiKey("");
      setCredits(null);
      setPlan(null);
      setToast("API key removed.");
      return;
    }
    const p = decodeApiKey(trimmed);
    if (!p) {
      setToast("That doesn't look like a valid ProductScene key.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, trimmed);
    setApiKey(trimmed);
    setCredits(p.credits);
    setPlan(p.plan);
    setToast(`Welcome! ${p.credits} credits on the ${p.plan} plan.`);
  }, [keyInput]);

  /* ── Generate ── */
  const generate = useCallback(async () => {
    if (!imageData) return;
    setGenerating(true);
    setGenError(null);
    setResults([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          image: imageData,
          sceneId,
          size: sizeId,
          ...(apiKey ? { apiKey } : {}),
        }),
      });
      const data: GenResponse = await res.json();
      if (!res.ok) {
        if (res.status === 402) {
          setGenError(
            data.error ||
              "You're out of credits. Purchase a plan or enter an API key."
          );
        } else {
          setGenError(data.error || "Generation failed. Please try again.");
        }
        return;
      }

      setResults(data.images || []);
      setUsedFallback(!!data.usedFallback);

      // Credit / trial bookkeeping
      if (data.mode === "paid") {
        if (data.newKey) {
          localStorage.setItem(STORAGE_KEY, data.newKey);
          setApiKey(data.newKey);
          setKeyInput(data.newKey);
        }
        if (data.remaining !== null) setCredits(data.remaining);
      } else {
        const next = trialUsed + 1;
        setTrialUsed(next);
        localStorage.setItem(TRIAL_KEY, String(next));
        if (data.remaining !== null) setCredits(data.remaining);
      }
    } catch (e) {
      setGenError(
        e instanceof Error ? e.message : "Network error — please try again."
      );
    } finally {
      setGenerating(false);
    }
  }, [imageData, sceneId, sizeId, apiKey, trialUsed]);

  /* ── Download helper ── */
  const downloadOne = useCallback(async (src: string, idx: number) => {
    try {
      let blob: Blob;
      if (src.startsWith("data:")) {
        const res = await fetch(src);
        blob = await res.blob();
      } else {
        const res = await fetch(src);
        blob = await res.blob();
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `productscene-${sceneId}-${sizeId}-${idx + 1}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(src, "_blank");
    }
  }, [sceneId, sizeId]);

  const downloadAll = useCallback(() => {
    results.forEach((r, i) => setTimeout(() => downloadOne(r, i), i * 250));
  }, [results, downloadOne]);

  /* ── Toast auto-dismiss ── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const trialRemaining = Math.max(0, FREE_TRIAL - trialUsed);

  /* ═══════════════════════════════════════════════════════════════
   * RENDER
   * ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              <I.Sparkle className="h-4 w-4" />
            </span>
            <span>
              Product<span className="text-indigo-600">Scene</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">
              <I.Key className="h-4 w-4 text-slate-400" />
              <input
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                onBlur={saveKey}
                onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                placeholder="psk_..."
                className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            {plan && (
              <div className="hidden items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 sm:flex">
                <span className="capitalize">{plan}</span>
                <span className="h-3.5 w-px bg-indigo-200" />
                <span>{credits ?? 0} credits</span>
              </div>
            )}
            <Link
              href="/#pricing"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Buy credits
            </Link>
          </div>
        </div>

        {/* Mobile key input */}
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 sm:hidden">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <I.Key className="h-4 w-4 text-slate-400" />
            <input
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onBlur={saveKey}
              onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
              placeholder="Paste your API key"
              className="flex-1 bg-transparent text-sm outline-none"
            />
            {plan && (
              <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                {credits ?? 0}c
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          {/* ─── Left column ─── */}
          <div className="space-y-5">
            {/* Upload card */}
            <Card title="1. Upload product photo">
              {!imageData ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
                    dragOver
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
                  }`}
                >
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-indigo-100 text-indigo-600">
                    <I.Upload className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    Drop your image here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    JPG or PNG · up to 10 MB · white background works best
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={onPick}
                  />
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageData}
                    alt="Product preview"
                    className="max-h-64 w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageData(null);
                      setImageName("");
                      setResults([]);
                      setImageError(null);
                    }}
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
                    aria-label="Remove image"
                  >
                    <I.X className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                    <I.Image className="h-3.5 w-3.5" />
                    <span className="truncate">{imageName}</span>
                  </div>
                </div>
              )}
              {imageError && (
                <p className="mt-2 text-xs font-medium text-red-600">{imageError}</p>
              )}
            </Card>

            {/* Scene picker */}
            <Card title="2. Choose scene">
              {loadingMeta ? (
                <div className="space-y-2">
                  <div className="h-8 w-full rounded-lg bg-slate-100" />
                  <div className="h-24 w-full rounded-lg bg-slate-100" />
                </div>
              ) : (
                <>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                          category === c
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1">
                    {filteredScenes.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSceneId(s.id)}
                        className={`group flex flex-col items-center gap-1 rounded-lg border p-2 transition ${
                          sceneId === s.id
                            ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                        title={s.prompt}
                      >
                        <span className="text-2xl">{s.emoji}</span>
                        <span className="line-clamp-1 text-[10px] font-medium text-slate-700">
                          {s.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </Card>

            {/* Size picker */}
            <Card title="3. Platform size">
              <div className="grid grid-cols-2 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSizeId(s.id)}
                    className={`flex flex-col items-start rounded-lg border p-3 text-left transition ${
                      sizeId === s.id
                        ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm font-semibold text-slate-900">
                      {s.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {s.ratio} · {s.width}×{s.height}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Generate CTA */}
            <button
              type="button"
              onClick={generate}
              disabled={!canGenerate}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {generating ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  Generating 4 variants…
                </>
              ) : (
                <>
                  <I.Sparkle className="h-5 w-5" />
                  Generate scene
                  {!apiKey && trialUsed < FREE_TRIAL && (
                    <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                      free trial · {trialRemaining} left
                    </span>
                  )}
                </>
              )}
            </button>

            {!apiKey && trialUsed >= FREE_TRIAL && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <I.Alert className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>
                  You used all 3 free generations.{" "}
                  <Link href="/#pricing" className="font-semibold underline">
                    Buy credits
                  </Link>{" "}
                  or paste an API key above.
                </p>
              </div>
            )}
          </div>

          {/* ─── Right column: results ─── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Results</h2>
                <p className="text-sm text-slate-500">
                  {selectedSize
                    ? `${selectedSize.name} · ${selectedSize.ratio}`
                    : ""}
                </p>
              </div>
              {results.length > 0 && (
                <button
                  type="button"
                  onClick={downloadAll}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <I.Download className="h-4 w-4" />
                  Download all
                </button>
              )}
            </div>

            {genError && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <I.Alert className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Generation failed</p>
                  <p className="mt-0.5">{genError}</p>
                </div>
              </div>
            )}

            {usedFallback && results.length > 0 && (
              <div className="flex items-start gap-2 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-xs text-indigo-800">
                <I.Alert className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>
                  <strong>Demo mode:</strong> FAL_KEY isn’t configured, so
                  branded placeholder images are shown. The full flow works
                  end-to-end; set FAL_KEY in your environment to generate real AI scenes.
                </p>
              </div>
            )}

            {/* Empty state */}
            {!generating && results.length === 0 && !genError && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-400">
                  <I.Image className="h-7 w-7" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  Your generated scenes will appear here
                </p>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  Upload a product photo, choose a scene and a platform size,
                  then click <strong>Generate</strong>. You’ll get four unique
                  variants in seconds.
                </p>
              </div>
            )}

            {/* Loading grid */}
            {generating && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="shimmer h-full w-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Results grid */}
            {!generating && results.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {results.map((src, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Result ${i + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex translate-y-0 items-center justify-between gap-2 bg-gradient-to-t from-slate-900/70 to-transparent p-3 opacity-100 transition group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                      <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                        Variant {i + 1}/4
                      </span>
                      <button
                        type="button"
                        onClick={() => downloadOne(src, i)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-slate-100"
                      >
                        <I.Download className="h-3.5 w-3.5" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!generating && results.length > 0 && (
              <button
                type="button"
                onClick={generate}
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <I.Refresh className="h-4 w-4" />
                Regenerate with new seeds
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-xl">
          <I.Check className="h-4 w-4 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ─── Card primitive ─── */
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      {children}
    </section>
  );
}
