"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";

/* ──────────────────────────────────────────────────────────────────
 * Inline icon set (no UI library)
 * ────────────────────────────────────────────────────────────────── */
const Icon = {
  Sparkle: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3l1.9 5.5L19 10l-5.1 1.5L12 17l-1.9-5.5L5 10l5.1-1.5L12 3z" />
      <path d="M19 3v4M21 5h-4" />
    </svg>
  ),
  Shield: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  Layers: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 2l9 5-9 5-9-5 9-5z" />
      <path d="M3 12l9 5 9-5M3 17l9 5 9-5" />
    </svg>
  ),
  Download: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  ),
  Upload: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  ),
  Image: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  Bolt: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  ),
  Check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12l5 5L20 7" />
    </svg>
  ),
  Chevron: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  Arrow: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
  Menu: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...p}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
};

/* ──────────────────────────────────────────────────────────────────
 * Pricing data
 * ────────────────────────────────────────────────────────────────── */
const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    credits: 50,
    tagline: "Perfect for trying out & small shops",
    features: [
      "50 AI-generated scenes",
      "All 20+ scene templates",
      "All 6 platform sizes",
      "4 variants per generation",
      "No watermark",
      "Email support",
    ],
    priceIdEnv: "NEXT_PUBLIC_PADDLE_PRICE_STARTER",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    credits: 200,
    tagline: "For growing sellers & agencies",
    features: [
      "200 AI-generated scenes",
      "Everything in Starter",
      "Priority generation queue",
      "Batch upload (coming soon)",
      "High-resolution downloads",
      "Priority support",
    ],
    priceIdEnv: "NEXT_PUBLIC_PADDLE_PRICE_PRO",
    highlighted: true,
  },
  {
    id: "business",
    name: "Business",
    price: 49,
    credits: 600,
    tagline: "For high-volume sellers",
    features: [
      "600 AI-generated scenes",
      "Everything in Pro",
      "Team sharing (coming soon)",
      "API access (coming soon)",
      "Dedicated success manager",
      "Custom scenes on request",
    ],
    priceIdEnv: "NEXT_PUBLIC_PADDLE_PRICE_BUSINESS",
    highlighted: false,
  },
];

const FEATURES = [
  {
    icon: Icon.Sparkle,
    title: "AI Scene Generation",
    desc: "Choose from 20+ professionally designed scenes — from pure white studio to cozy cafés, marble surfaces and festive holiday themes.",
  },
  {
    icon: Icon.Shield,
    title: "Product Fidelity",
    desc: "Our pipeline removes the background first, then composites your product into the new scene. Shape, labels and colors stay 100% true.",
  },
  {
    icon: Icon.Layers,
    title: "All Platform Sizes",
    desc: "One click produces perfectly framed images for Amazon, Etsy, Shopify, Instagram and TikTok — including main-image-safe white backgrounds.",
  },
  {
    icon: Icon.Bolt,
    title: "4 Variants in Seconds",
    desc: "Every generation returns four unique variants with different seeds, so you always have options to pick the best-performing shot.",
  },
];

const STEPS = [
  {
    icon: Icon.Upload,
    title: "Upload",
    desc: "Drag & drop a white-background product photo (JPG or PNG, up to 10 MB).",
  },
  {
    icon: Icon.Image,
    title: "Choose Scene",
    desc: "Pick one of 20+ scenes and the platform size you need.",
  },
  {
    icon: Icon.Sparkle,
    title: "Generate",
    desc: "Our AI cuts out the product and places it into the scene — 4 variants at once.",
  },
  {
    icon: Icon.Download,
    title: "Download",
    desc: "Download your favorites individually or all four, then upload to your store.",
  },
];

const FAQS = [
  {
    q: "What image format and size should I upload?",
    a: "Upload a JPG or PNG under 10 MB. A clean white-background photo works best — our background-removal step handles the rest. The higher the source resolution, the better the result.",
  },
  {
    q: "Will my product look the same after the background changes?",
    a: "Yes. We use a two-step pipeline: first remove the original background, then place the untouched product into the new scene. The product's shape, colors, labels and proportions are preserved.",
  },
  {
    q: "Can I use the images on Amazon?",
    a: "The 'Pure White Studio' scene is designed to meet Amazon's main-image requirements (pure white background, full product in frame). Other scenes work great for A+ content, lifestyle sub-images, Etsy, Shopify and social media.",
  },
  {
    q: "How does the credit system work?",
    a: "Each 'Generate' click produces four unique variants and costs 1 credit. Unused credits never expire. You can view your remaining balance in the app at any time.",
  },
  {
    q: "Do you offer a free trial?",
    a: "Yes — every visitor gets 3 free generations (with a small watermark) so you can try the full workflow. After that, pick a plan that matches your listing volume.",
  },
  {
    q: "What is your refund policy?",
    a: "If ProductScene materially fails to deliver the service described, contact us within 14 days of purchase for a full or pro-rated refund. See the Refund Policy page for details.",
  },
];

/* ──────────────────────────────────────────────────────────────────
 * Paddle checkout helper
 * ────────────────────────────────────────────────────────────────── */
declare global {
  interface Window {
    Paddle?: {
      Initialize: (opts: Record<string, unknown>) => void;
      Checkout: {
        open: (opts: {
          items: Array<{ priceId: string; quantity: number }>;
          successUrl?: string;
          customer?: { email?: string };
        }) => void;
      };
    };
  }
}

function openPaddleCheckout(priceId: string) {
  if (typeof window === "undefined" || !window.Paddle) {
    alert(
      "Checkout is not configured yet. Set NEXT_PUBLIC_PADDLE_CLIENT_TOKEN to enable Paddle payments."
    );
    return;
  }
  const origin = window.location.origin;
  window.Paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    successUrl: `${origin}/success?checkout_id={checkout_id}`,
  });
}

/* ──────────────────────────────────────────────────────────────────
 * Page
 * ────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const paddleClientToken =
    process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";
  const paddleEnv =
    process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
      ? "production"
      : "sandbox";

  return (
    <div className="flex-1 w-full">
      {paddleClientToken && (
        <Script
          src="https://cdn.paddle.com/paddle/v2/paddle.js"
          onLoad={() => {
            window.Paddle?.Initialize({
              token: paddleClientToken,
              environment: paddleEnv,
              checkout: { settings: { displayMode: "overlay" } },
            });
          }}
        />
      )}

      {/* ─── Nav ─── */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              <Icon.Sparkle className="h-4 w-4" />
            </span>
            <span>
              Product<span className="text-indigo-600">Scene</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/app"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              href="/app"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Try free
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <Icon.X className="h-6 w-6" /> : <Icon.Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-4 text-sm font-medium">
              <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
              <a href="#how" onClick={() => setMobileOpen(false)}>How it works</a>
              <a href="#pricing" onClick={() => setMobileOpen(false)}>Pricing</a>
              <a href="#faq" onClick={() => setMobileOpen(false)}>FAQ</a>
              <Link
                href="/app"
                className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-center text-white"
                onClick={() => setMobileOpen(false)}
              >
                Try free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/60 via-violet-200/40 to-transparent blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <Icon.Bolt className="h-3.5 w-3.5" />
                AI-powered product photography
              </div>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Create Stunning Product Photos in{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Seconds
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-600">
                Upload a plain white-background shot and let AI place your
                product into 20+ scroll-stopping scenes — sized for Amazon,
                Etsy, Shopify, Instagram and TikTok.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
                >
                  Start generating free
                  <Icon.Arrow className="h-4 w-4" />
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50"
                >
                  See how it works
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Icon.Check className="h-4 w-4 text-emerald-500" /> No credit card
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon.Check className="h-4 w-4 text-emerald-500" /> 3 free generations
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon.Check className="h-4 w-4 text-emerald-500" /> No watermark on paid plans
                </span>
              </div>
            </div>

            {/* Before / After visual */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <BeforeAfterCard
                  label="Before"
                  bg="bg-slate-100"
                  emoji="📦"
                  sceneLabel="White background"
                />
                <BeforeAfterCard
                  label="After"
                  bg="bg-gradient-to-br from-indigo-100 to-violet-200"
                  emoji="📦"
                  sceneLabel="Marble studio"
                  after
                />
                <BeforeAfterCard
                  label="Before"
                  bg="bg-slate-100"
                  emoji="🧴"
                  sceneLabel="Flat white"
                />
                <BeforeAfterCard
                  label="After"
                  bg="bg-gradient-to-br from-amber-100 to-orange-200"
                  emoji="🧴"
                  sceneLabel="Cozy café"
                  after
                />
              </div>
              <div className="absolute -bottom-4 -right-4 hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:block animate-floaty">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-100 text-emerald-600">
                    <Icon.Check className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">4 variants ready</p>
                    <p className="text-xs text-slate-500">in 8 seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to list faster
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Stop spending hours and hundreds of dollars on photoshoots.
              ProductScene turns one product photo into a full catalog of
              marketing-ready images.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From upload to listed in four steps
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              No design skills. No photoshoot budget. Just upload, click, download.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span className="text-3xl font-black text-slate-200">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Simple, credit-based pricing
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Every generation produces four variants and costs 1 credit.
              Credits never expire.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => {
              const priceId =
                process.env[plan.priceIdEnv as keyof typeof process.env] ||
                "";
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border p-8 shadow-sm transition ${
                    plan.highlighted
                      ? "border-indigo-600 bg-white ring-2 ring-indigo-600"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{plan.tagline}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-slate-500">one-time</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-indigo-600">
                    {plan.credits} generations
                  </p>

                  <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-600">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Icon.Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => {
                      if (!priceId) {
                        alert(
                          `Set ${plan.priceIdEnv} in your environment to enable ${plan.name} checkout.`
                        );
                        return;
                      }
                      openPaddleCheckout(priceId);
                    }}
                    className={`mt-8 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      plan.highlighted
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Get {plan.name}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Payments are securely processed by Paddle. All plans include 20+
            scenes and all platform sizes.
          </p>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {FAQS.map((f, i) => {
              const open = faqOpen === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    onClick={() => setFaqOpen(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-base font-semibold text-slate-900">{f.q}</span>
                    <Icon.Chevron
                      className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {open && (
                    <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 px-8 py-14 text-center shadow-xl sm:px-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to transform your product photos?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-indigo-100">
            Start with 3 free generations. No credit card required. No
            software to install.
          </p>
          <Link
            href="/app"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
          >
            Open the app
            <Icon.Arrow className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                <Icon.Sparkle className="h-4 w-4" />
              </span>
              Product<span className="text-indigo-600">Scene</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-900">Terms</Link>
              <Link href="/refund" className="hover:text-slate-900">Refund</Link>
              <a href="mailto:hello@productscene.ai" className="hover:text-slate-900">Contact</a>
            </nav>
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} ProductScene. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Before/after mini card
 * ────────────────────────────────────────────────────────────────── */
function BeforeAfterCard({
  label,
  bg,
  emoji,
  sceneLabel,
  after = false,
}: {
  label: string;
  bg: string;
  emoji: string;
  sceneLabel: string;
  after?: boolean;
}) {
  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-2xl border ${
        after ? "border-indigo-200 shadow-lg" : "border-slate-200"
      }`}
    >
      <div className={`absolute inset-0 ${bg}`} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-5xl sm:text-6xl ${after ? "drop-shadow-md" : ""}`}
        >
          {emoji}
        </span>
        <span className="mt-3 text-xs font-medium text-slate-600">
          {sceneLabel}
        </span>
      </div>
      <span
        className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
          after
            ? "bg-indigo-600 text-white"
            : "bg-white/90 text-slate-600 ring-1 ring-slate-200"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
