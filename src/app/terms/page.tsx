import type { Metadata } from "next";
import { LegalLayout, Section } from "../privacy/page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms under which ProductScene provides AI product photography services.",
};

const EFFECTIVE = "January 1, 2026";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" effective={EFFECTIVE}>
      <Section title="1. Acceptance of terms">
        These Terms of Service (&quot;Terms&quot;) govern your use of
        ProductScene (the &quot;Service&quot;), operated by ProductScene
        (&quot;we&quot;, &quot;us&quot;). By creating an account, purchasing a
        plan, or otherwise using the Service, you agree to be bound by these
        Terms. If you do not agree, please do not use the Service.
      </Section>

      <Section title="2. Description of service">
        ProductScene is a web-based tool that uses artificial intelligence to
        generate product scene images from photos you upload. Each paid plan
        grants a fixed number of &quot;credits&quot;; one credit is consumed
        per generation that produces four image variants. Credits are
        one-time, non-recurring, and do not expire.
      </Section>

      <Section title="3. Eligibility">
        You must be at least 18 years old (or the age of majority in your
        jurisdiction) and able to form a binding contract. You represent that
        any information you provide during checkout is accurate and that you
        are authorized to use any payment method you provide.
      </Section>

      <Section title="4. Accounts & API keys">
        Access is managed via an API key that encodes your plan and credit
        balance. You are responsible for keeping your key confidential. You
        agree not to resell, redistribute, or share your key with third
        parties. We reserve the right to revoke keys used in violation of
        these Terms.
      </Section>

      <Section title="5. Acceptable use">
        You agree not to:
        <ul className="ml-5 mt-2 list-disc space-y-1">
          <li>
            Upload content that infringes, misappropriates, or violates the
            rights of any third party (including intellectual property,
            privacy, and publicity rights).
          </li>
          <li>
            Upload illegal, harmful, defamatory, or NSFW content, or content
            depicting real persons without their consent.
          </li>
          <li>
            Attempt to reverse-engineer, abuse, or disrupt the Service or its
            AI providers.
          </li>
          <li>
            Use automated means to consume credits at a scale inconsistent
            with normal interactive use.
          </li>
        </ul>
      </Section>

      <Section title="6. Your content & license">
        You retain ownership of images you upload and the generated outputs.
        You grant us a limited, non-exclusive, worldwide, royalty-free
        license to process your content solely to operate and improve the
        Service. We do not claim ownership of your content.
      </Section>

      <Section title="7. AI-generated outputs">
        The Service uses third-party AI models. We do not guarantee that
        outputs will be error-free, compliant with the policies of any
        marketplace (Amazon, Etsy, etc.), or suitable for any particular
        purpose. You are solely responsible for reviewing generated images
        before using them in listings or advertisements. AI-generated outputs
        may not be eligible for copyright protection in your jurisdiction.
      </Section>

      <Section title="8. Payments & taxes">
        Payments are processed by our merchant of record,{" "}
        <a
          className="text-indigo-600 underline"
          target="_blank"
          rel="noopener noreferrer"
          href="https://paddle.com/legal/buyer-terms/"
        >
          Paddle
        </a>
        . Prices are shown in USD and may include applicable taxes/VAT
        collected by Paddle at checkout.
      </Section>

      <Section title="9. Refunds">
        Refunds are handled under our separate{" "}
        <a className="text-indigo-600 underline" href="/refund">
          Refund Policy
        </a>
        .
      </Section>

      <Section title="10. Intellectual property">
        The ProductScene name, logo, website, and underlying technology are
        owned by us and protected by intellectual property laws. Nothing in
        these Terms grants you a right to use our brand assets.
      </Section>

      <Section title="11. Disclaimers">
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
        WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR
        STATUTORY. WE DISCLAIM ALL IMPLIED WARRANTIES INCLUDING
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
        NON-INFRINGEMENT.
      </Section>

      <Section title="12. Limitation of liability">
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL
        PRODUCTSCENE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
        CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS OR
        REVENUE, ARISING OUT OF OR RELATED TO THE SERVICE. OUR TOTAL
        AGGREGATE LIABILITY SHALL NOT EXCEED THE AMOUNT YOU ACTUALLY PAID
        TO US IN THE 12 MONTHS PRECEDING THE CLAIM.
      </Section>

      <Section title="13. Termination">
        You may stop using the Service at any time. We may suspend or
        terminate access if you materially breach these Terms. Upon
        termination, your right to use the Service and any unused credits
        ends immediately; no refunds are provided except as required by law
        or stated in the Refund Policy.
      </Section>

      <Section title="14. Changes">
        We may update these Terms from time to time. The &quot;Effective&quot;
        date above reflects the latest revision. Continued use after changes
        constitutes acceptance.
      </Section>

      <Section title="15. Governing law & contact">
        These Terms are governed by the laws of the jurisdiction in which
        ProductScene operates, without regard to conflict-of-law rules. For
        any questions, contact{" "}
        <a
          className="text-indigo-600 underline"
          href="mailto:legal@productscene.ai"
        >
          legal@productscene.ai
        </a>
        .
      </Section>
    </LegalLayout>
  );
}
