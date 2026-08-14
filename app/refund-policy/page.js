import LegalPage from "@/components/marketing/legal-page"
import { pageMetadata, breadcrumbSchema, JsonLd } from "@/lib/seo"
import { EVALUATION } from "@/lib/content/site"

export const metadata = pageMetadata({
  title: "Refund Policy",
  description:
    "AADHAR refund policy: how the 15-day evaluation removes the need for refunds, when one-time licence fees and monthly hosting charges are refundable, and how to request a refund.",
  path: "/refund-policy",
})

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Refund Policy", path: "/refund-policy" },
]

const sections = [
  {
    id: "evaluate-first",
    heading: "Evaluate before you pay",
    body: [
      `Our commercial model is designed so that a refund should rarely be necessary. Every client receives a ${EVALUATION.days}-day no-obligation evaluation on a demonstration or configured evaluation environment before any payment is due. No credit card is required to begin.`,
      "If the system does not suit your business during that period, you simply do not proceed, and nothing is payable. We would rather you decide against us before paying than ask for money back afterwards.",
    ],
  },
  {
    id: "one-time",
    heading: "One-time software licence fee",
    body: [
      "The one-time software licence fee becomes payable after you approve the system at the end of the evaluation. Because it covers the licence and the configuration work already carried out for your business, it is generally non-refundable once paid.",
      "We will, however, consider a refund of the one-time fee in the following circumstances:",
      {
        list: [
          "We are unable to deliver a capability that was expressly agreed in writing in your quotation or agreement, and cannot resolve it within a reasonable period.",
          "A duplicate or incorrect payment was made.",
          "Delivery has not commenced and you cancel within 7 days of payment, in which case we may retain a reasonable amount for work already performed.",
        ],
      },
      "Where a refund is agreed, the amount is calculated after deducting configuration, data migration, training and third-party costs already incurred on your behalf.",
    ],
  },
  {
    id: "monthly",
    heading: "Monthly hosting and maintenance",
    body: [
      "Monthly hosting and maintenance is billed for the service period ahead. If you cancel, the service continues to the end of the period already paid for and is not pro-rated.",
      "Where we are responsible for a prolonged failure of the hosted service that we cannot remedy, we will credit or refund the affected portion of that month's charge. Interruptions caused by your internet connection, your hardware, or third-party providers are not covered.",
    ],
  },
  {
    id: "excluded",
    heading: "What is not refundable",
    body: [
      {
        list: [
          "Hardware supplied or sourced on your behalf, which is subject to the supplier's own return terms.",
          "SMS charges, payment-provider fees and other third-party services already consumed or paid to the provider.",
          "Domain registration fees already paid to the registrar on your behalf. The domain is included in your package, but once registered the registrar's fee cannot be recovered.",
          "Custom development work that has been delivered and accepted.",
          "Training and onboarding sessions that have already been conducted.",
          "Data migration work that has been completed.",
        ],
      },
    ],
  },
  {
    id: "cancellation",
    heading: "Cancelling the service",
    body: [
      "You may cancel the monthly hosting and maintenance service at any time by giving us written notice at least 15 days before your next billing date. Cancelling the monthly service ends hosting, backups, maintenance and support.",
      "Before your hosting ends, we will provide an export of your business data on request. Your business data belongs to you. Please request the export before the service ends, as data may be removed from active hosting after termination in line with our data retention practice.",
    ],
  },
  {
    id: "trial-data",
    heading: "Evaluation data",
    body: [
      "Data entered during the evaluation period may be reset after that period ends. If you proceed, we will confirm before launch whether your evaluation data is being carried forward or whether the live system starts fresh.",
    ],
  },
  {
    id: "how-to-request",
    heading: "How to request a refund",
    body: [
      "Send a written request to our email address with your business name, quotation or invoice reference, payment date and the reason for the request. We will acknowledge within 3 working days and give a decision within 15 working days.",
      "Approved refunds are returned by the same method used for payment wherever possible. Bank transfer charges, where applicable, are borne by the party incurring them.",
      "This policy does not affect any statutory rights you have under the laws of Nepal.",
    ],
  },
]

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(crumbs)} />
      <LegalPage
        title="Refund Policy"
        intro="How refunds work at AADHAR, what is refundable, what is not, and why our evaluation period is designed to make refunds unnecessary."
        updated="14 August 2026"
        sections={sections}
        crumbs={crumbs}
      />
    </>
  )
}
