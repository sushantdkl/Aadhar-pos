import LegalPage from "@/components/marketing/legal-page"
import { pageMetadata, breadcrumbSchema, JsonLd } from "@/lib/seo"
import { EVALUATION } from "@/lib/content/site"
import { PRICING_TERMS } from "@/lib/content/packages"

export const metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms under which AADHAR supplies business software: licensing, the 15-day evaluation, one-time and monthly charges, data ownership, support scope and liability.",
  path: "/terms",
})

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Terms of Service", path: "/terms" },
]

const sections = [
  {
    id: "agreement",
    heading: "This agreement",
    body: [
      "These terms govern your use of the AADHAR website and the business software we supply. They apply alongside your signed quotation or agreement. Where a signed agreement says something different, the signed agreement takes precedence.",
      "By requesting a quotation, beginning an evaluation, or using a system we supply, you accept these terms on behalf of your business.",
    ],
  },
  {
    id: "licence",
    heading: "Software licence",
    body: [
      "On payment of the one-time software licence fee, we grant your business a non-exclusive, non-transferable licence to use the agreed AADHAR software for your own business operations, for the number of outlets and users set out in your quotation.",
      "The purchased version does not require an annual licence renewal. The licence does not expire while your agreement remains in good standing.",
      "The licence does not include source-code ownership. Source code, design and underlying intellectual property remain with AADHAR unless a separate signed agreement expressly transfers them.",
      "You may not resell, sublicense, redistribute, reverse-engineer or copy the software, or use it to provide a service to businesses other than your own, without our written agreement.",
    ],
  },
  {
    id: "evaluation",
    heading: "Evaluation period",
    body: [
      `Every client receives a ${EVALUATION.days}-day no-obligation evaluation on a demonstration or configured evaluation environment. No credit card is required, and nothing is payable during this period.`,
      {
        list: EVALUATION.points,
      },
      "Data entered during the evaluation may be reset after the evaluation period ends. If you proceed, we will confirm in writing whether evaluation data is carried into the live system.",
    ],
  },
  {
    id: "charges",
    heading: "Charges and payment",
    body: [
      "Our commercial model has two components, which are charged separately and stated separately on every quotation:",
      {
        list: [
          "A one-time software licence fee, covering the agreed licence and initial configuration, payable after you approve the system.",
          "A monthly hosting and maintenance service fee, covering cloud hosting, backups, maintenance and the agreed level of support, beginning after the included first month.",
        ],
      },
      "The following pricing conditions apply to every quotation we issue:",
      { list: PRICING_TERMS },
      "Invoices are payable within the period stated on the invoice. We may suspend the hosted service where charges remain unpaid after written reminders, having given you notice first.",
    ],
  },
  {
    id: "scope",
    heading: "Scope of work",
    body: [
      "The modules, outlets, users and integrations included in your system are those set out in your quotation or signed agreement. Anything outside that scope — new features, additional outlets, further data migration or extra training — is estimated separately and agreed in writing before work begins.",
      "Capabilities described on our website as planned, or as subject to verification and approval, are not part of what we supply until we confirm in writing that they are available for your business. In particular, IRD and CBMS integration is a quotation-only add-on and depends on technical readiness and the applicable approval process.",
    ],
  },
  {
    id: "your-obligations",
    heading: "Your responsibilities",
    body: [
      {
        list: [
          "Providing accurate business information for configuration, and keeping products, menus and prices current.",
          "Keeping staff account credentials secure, and disabling accounts promptly when staff leave.",
          "Maintaining a working internet connection and compatible hardware at your premises.",
          "Using the system lawfully, and meeting your own tax, licensing and regulatory obligations.",
          "Nominating a point of contact who can make configuration decisions.",
        ],
      },
      "The software supports your record-keeping. It does not transfer to us legal responsibility for your tax filings, licensing or regulatory compliance.",
    ],
  },
  {
    id: "data",
    heading: "Data ownership and protection",
    body: [
      "The business data you enter into your system belongs to your business. You may request an export at any time while your service is active.",
      "We process that data as your service provider, on your instructions, in order to operate and support the system. We do not use your customer lists, sales figures or staff records for our own marketing or analytics.",
      "Our handling of personal information is described in our Privacy Policy, which forms part of these terms.",
    ],
  },
  {
    id: "service",
    heading: "Service, availability and support",
    body: [
      "The system is cloud-hosted and requires an internet connection to operate. We do not currently offer verified offline billing with later synchronization.",
      "Support is provided during our published support hours at the level included in your package. We do not offer 24/7 support. A guaranteed response-time SLA is available only under an Enterprise agreement.",
      "We do not publish an uptime guarantee we have not measured. Our Service Policy sets out what the monthly service covers, our response targets, and what falls outside it.",
    ],
  },
  {
    id: "third-party",
    heading: "Third-party services",
    body: [
      "Optional add-ons may involve third parties, including SMS gateways, payment providers and hardware suppliers. Their charges are billed separately and are not included in our fees.",
      "Your domain is an exception: it is included in your package, and we register and renew it with the registrar on your behalf as part of the monthly hosting and maintenance charge. The domain is registered for your business.",
      "Those services are governed by the third party's own terms. We are not responsible for their availability, pricing changes or decisions, though we will assist you in dealing with them where we reasonably can.",
    ],
  },
  {
    id: "liability",
    heading: "Liability",
    body: [
      "We provide the software and services with reasonable skill and care. We do not warrant that the software will be uninterrupted or entirely free of defects.",
      "To the extent permitted by law, our total liability arising out of or in connection with your agreement is limited to the total amount you have paid us in the 12 months preceding the event giving rise to the claim.",
      "We are not liable for indirect or consequential loss, including loss of profit, loss of business opportunity, or loss arising from your own internet connection, power supply, hardware failure, or the acts of third parties.",
      "Nothing in these terms limits liability that cannot lawfully be limited.",
    ],
  },
  {
    id: "termination",
    heading: "Termination",
    body: [
      "Either party may end the monthly hosting and maintenance service with 15 days' written notice. Ending the monthly service stops hosting, backups, maintenance and support.",
      "We may suspend or terminate for non-payment after written reminders, or for a material breach of these terms that is not remedied within a reasonable period after notice.",
      "On termination we will, on request, provide an export of your business data before hosting ends. Refunds are dealt with in our Refund Policy.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    body: [
      "We may update these terms as our services change. The date at the top of this page shows when they were last revised. Where a change materially affects your rights or charges, we will give you at least 30 days' notice.",
    ],
  },
  {
    id: "law",
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of Nepal, and the courts of Nepal have jurisdiction over any dispute arising from them.",
      "We would rather resolve a disagreement by talking to you first. Please contact us before taking any formal step, and we will make a genuine effort to settle the matter.",
    ],
  },
]

export default function TermsPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(crumbs)} />
      <LegalPage
        title="Terms of Service"
        intro="The terms under which we supply AADHAR software and services — licensing, charges, scope, data ownership and liability."
        updated="14 August 2026"
        sections={sections}
        crumbs={crumbs}
      />
    </>
  )
}
