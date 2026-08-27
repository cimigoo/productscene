import type { Metadata } from "next";
import { LegalLayout, Section } from "../privacy/page";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "ProductScene refund policy — 14-day money-back guarantee on unused credits, subject to conditions.",
};

const EFFECTIVE = "January 1, 2026";

export default function RefundPage() {
  return (
    <LegalLayout title="Refund Policy" effective={EFFECTIVE}>
      <Section title="1. Our commitment">
        We want ProductScene to work for every seller. If the Service does
        not materially deliver the features described, we offer a fair refund
        process within 14 days of your purchase.
      </Section>

      <Section title="2. 14-day money-back window">
        You may request a full refund within 14 calendar days of your
        purchase, provided that you have used <strong>fewer than 10%</strong>{" "}
        of the credits included in your plan (for example, fewer than 5
        generations out of a 50-credit Starter plan). Refunds are issued to
        the original payment method via Paddle within 5–10 business days.
      </Section>

      <Section title="3. Pro-rated refunds">
        If you have used more than 10% of your credits but are unsatisfied
        because of a material defect or service outage, we may offer a
        pro-rated refund reflecting unused credits at our sole discretion.
      </Section>

      <Section title="4. Non-refundable situations">
        Refunds are not available where:
        <ul className="ml-5 mt-2 list-disc space-y-1">
          <li>
            The purchase was made more than 14 days ago;
          </li>
          <li>
            More than 50% of purchased credits have already been consumed;
          </li>
          <li>
            The request relates to marketplace policies (Amazon, Etsy,
            Shopify, etc.) outside our control — we do not guarantee that
            generated images will pass any specific platform review;
          </li>
          <li>
            The issue results from your own content, network, or misuse of
            the Service;
          </li>
          <li>
            You violated our Terms of Service (e.g., shared your API key or
            uploaded prohibited content).
          </li>
        </ul>
      </Section>

      <Section title="5. Free trial">
        Every user receives 3 free generations with a watermark, with no
        payment required. Use these to evaluate the Service before purchasing.
      </Section>

      <Section title="6. Failed or incorrect charges">
        If you believe you were charged incorrectly, contact us within 30
        days of the charge. We will investigate and refund any confirmed
        overcharge or duplicate charge in full.
      </Section>

      <Section title="7. How to request a refund">
        Email{" "}
        <a
          className="text-indigo-600 underline"
          href="mailto:billing@productscene.ai"
        >
          billing@productscene.ai
        </a>{" "}
        from the email address used at checkout. Include your order
        reference (starting with &quot;tx_&quot; or &quot;sub_&quot; from
        Paddle) and a short reason. We respond within 2 business days.
      </Section>

      <Section title="8. Taxes & payment-processor fees">
        Refunds exclude any third-party payment-processing or currency
        conversion fees that are not returned to us by Paddle. Any
        refunded tax amounts are handled in accordance with applicable law
        and Paddle&apos;s tax policies.
      </Section>
    </LegalLayout>
  );
}
