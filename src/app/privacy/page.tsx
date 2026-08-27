import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ProductScene collects, uses and protects your personal information and images.",
};

const EFFECTIVE = "January 1, 2026";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" effective={EFFECTIVE}>
      <Section title="1. Overview">
        ProductScene (&quot;we&quot;, &quot;us&quot;) provides an AI-powered
        product photography service. This Privacy Policy explains what data we
        collect when you use productscene.ai (the &quot;Service&quot;), how we
        use it, and the choices you have. By using the Service you agree to
        this policy.
      </Section>

      <Section title="2. Data we collect">
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Account / payment data:</strong> email address, plan, and
            payment-related metadata processed by our merchant of record,{" "}
            <External href="https://paddle.com/legal/privacy-policy/">
              Paddle
            </External>
            . We do not store credit card numbers.
          </li>
          <li>
            <strong>Content you upload:</strong> product images submitted for
            generation. Images are sent to our AI provider (Fal.ai) solely to
            process your request and are not used to train models.
          </li>
          <li>
            <strong>Technical data:</strong> IP address (for free-trial abuse
            prevention), browser type, pages viewed, timestamps.
          </li>
          <li>
            <strong>Cookies:</strong> strictly-necessary cookies for
            remembering your API key in your own browser.
          </li>
        </ul>
      </Section>

      <Section title="3. How we use data">
        We use data to: provide and operate the Service; process payments and
        issue API keys; prevent abuse of the free trial; respond to support
        requests; improve and debug the Service; comply with legal
        obligations. We <strong>do not</strong> sell personal data. We do not
        use your uploaded product images to train machine-learning models.
      </Section>

      <Section title="4. Data processors & sub-processors">
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <External href="https://vercel.com/legal/privacy-policy">
              Vercel
            </External>{" "}
            — hosting & serverless functions
          </li>
          <li>
            <External href="https://fal.ai/privacy">Fal.ai</External> — AI
            image generation
          </li>
          <li>
            <External href="https://paddle.com/legal/privacy-policy/">
              Paddle
            </External>{" "}
            — merchant of record / payments
          </li>
        </ul>
      </Section>

      <Section title="5. Data retention">
        We do not operate a persistent user database. API keys are
        self-contained and stored in your browser. Uploaded images are
        processed in memory and are not retained beyond what our sub-processors
        require to fulfill the request. Transactional records required for tax
        and accounting are retained for the periods required by law.
      </Section>

      <Section title="6. Your rights">
        Depending on your jurisdiction (GDPR, CCPA, etc.), you may have the
        right to access, correct, delete, port, or restrict processing of your
        data. To exercise any of these rights, email{" "}
        <a className="text-indigo-600 underline" href="mailto:privacy@productscene.ai">
          privacy@productscene.ai
        </a>
        . We will respond within 30 days.
      </Section>

      <Section title="7. Security">
        API keys are signed with HMAC-SHA256 using a secret signing key.
        Sensitive environment variables are stored encrypted by our hosting
        provider. No method of transmission over the Internet is 100% secure,
        but we take commercially reasonable measures to protect your data.
      </Section>

      <Section title="8. Children">
        The Service is not directed to individuals under 16. We do not
        knowingly collect data from children.
      </Section>

      <Section title="9. Changes">
        We may update this policy from time to time. Material changes will be
        announced on this page with a revised effective date.
      </Section>

      <Section title="10. Contact">
        Questions? Email{" "}
        <a className="text-indigo-600 underline" href="mailto:privacy@productscene.ai">
          privacy@productscene.ai
        </a>
        .
      </Section>
    </LegalLayout>
  );
}

/* ─── Shared legal layout ─── */
export function LegalLayout({
  title,
  effective,
  children,
}: {
  title: string;
  effective: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1">
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to ProductScene
        </Link>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Effective: {effective}
        </p>
        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-slate-700">
          {children}
        </div>
      </article>
    </main>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function External({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-600 underline hover:text-indigo-700"
    >
      {children}
    </a>
  );
}
