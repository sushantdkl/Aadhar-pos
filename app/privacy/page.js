import LegalPage from "@/components/marketing/legal-page"
import { pageMetadata, breadcrumbSchema, JsonLd } from "@/lib/seo"
import { CONTACT } from "@/lib/content/site"

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How AADHAR collects, uses, stores and protects personal information submitted through this website and through the business software we operate on our clients' behalf.",
  path: "/privacy",
})

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy Policy", path: "/privacy" },
]

const sections = [
  {
    id: "scope",
    heading: "Who this policy covers",
    body: [
      "This policy explains how AADHAR handles personal information in two distinct situations, which we keep separate.",
      {
        list: [
          "This website. When you submit a quotation request or contact form, we collect and use the details you provide in order to respond to your enquiry.",
          "Our clients' business systems. When we host a system for a business, that business controls the data inside it — their customers, staff and transactions. We process that data on their instructions as their service provider, not for our own purposes.",
        ],
      },
    ],
  },
  {
    id: "collect",
    heading: "What we collect from this website",
    body: [
      "When you submit the quotation form or the contact form, we collect only the information you enter, which may include:",
      {
        list: [
          "Your name and business name.",
          "Your phone number and email address.",
          "Your business type, location, number of outlets and number of users.",
          "The modules, hardware and integrations you say you need.",
          "Any additional requirements you choose to describe.",
          "Your preferred contact method and installation date.",
        ],
      },
      "We do not ask for, and you should not send us, payment card details, passwords or government identification documents through these forms.",
      "Our server also records standard technical information with each submission, such as the request time and an IP address, which we use only to detect abuse and rate-limit automated submissions.",
    ],
  },
  {
    id: "use",
    heading: "How we use it",
    body: [
      "We use the information you submit through this website for these purposes only:",
      {
        list: [
          "To respond to your enquiry and prepare a quotation.",
          "To contact you about the demo, evaluation and onboarding process you asked about.",
          "To keep an internal record of enquiries so we can follow up accurately.",
          "To detect and prevent spam and abusive automated submissions.",
        ],
      },
      "We do not sell your information. We do not share it with other businesses for their marketing. We do not add you to unrelated mailing lists because you asked for a quotation.",
    ],
  },
  {
    id: "consent",
    heading: "Consent and withdrawal",
    body: [
      "Both forms include a consent checkbox. Submitting a form confirms you agree that we may contact you about that request and store the details for that purpose.",
      `You can withdraw consent and ask us to delete your enquiry at any time by emailing ${CONTACT.email}. We will confirm deletion, unless we are required to keep a record for a legal or accounting reason, in which case we will tell you which record we are retaining and why.`,
    ],
  },
  {
    id: "storage",
    heading: "Where information is stored",
    body: [
      "Website enquiries are stored in our managed cloud database, which is operated by a reputable infrastructure provider and may hold data on servers outside Nepal. Access is restricted to AADHAR staff who need it to respond to enquiries.",
      "Client business systems are hosted on cloud infrastructure with each business's data logically separated from other clients. Traffic between your devices and the system is encrypted over HTTPS.",
    ],
  },
  {
    id: "retention",
    heading: "How long we keep it",
    body: [
      {
        list: [
          "Quotation and contact enquiries: retained while we are in active discussion and for up to 24 months afterwards, so we can pick up a conversation you return to.",
          "Client business data: retained for as long as the hosting service is active, plus a short period after termination to allow for data export.",
          "Records required for accounting or legal purposes: retained for the period the law requires.",
        ],
      },
    ],
  },
  {
    id: "client-data",
    heading: "Data inside a client's system",
    body: [
      "When we host a system for a business, the business owns the data in it. We do not use our clients' customer lists, sales figures or staff records for our own marketing, analytics or product promotion.",
      "Any figures shown in the interactive demo on this website are synthetic sample data. The demo is not connected to any client database and never displays live business information.",
      "AADHAR staff access a client system only when necessary to provide support, resolve a fault, or perform agreed configuration — and at the client's request or with their knowledge.",
    ],
  },
  {
    id: "third-parties",
    heading: "Third parties",
    body: [
      "We rely on a small number of service providers to operate this website and our clients' systems, including cloud hosting, database and email delivery providers. They process information only to provide those services to us.",
      "Further third parties may be involved in delivering your system — a domain registrar for your website, and, where you choose them, an SMS gateway or a payment provider. Those providers have their own terms and privacy practices. Registering a domain requires us to share your business contact details with the registrar.",
    ],
  },
  {
    id: "analytics",
    heading: "Cookies and analytics",
    body: [
      "This website uses browser local storage to remember your light or dark theme preference. That preference stays on your device and is not transmitted to us.",
      "We do not currently run third-party advertising or cross-site tracking on this website. If we add analytics in future, we will ask for your consent before any non-essential tracking is enabled, and we will update this policy first.",
    ],
  },
  {
    id: "rights",
    heading: "Your rights",
    body: [
      "You may ask us to:",
      {
        list: [
          "Tell you what information we hold about you.",
          "Correct information that is inaccurate.",
          "Delete your enquiry and stop contacting you.",
          "Provide a copy of your business data, if you are a client.",
        ],
      },
      `Send requests to ${CONTACT.email}. We will respond within 15 working days.`,
    ],
  },
  {
    id: "security",
    heading: "Security",
    body: [
      "We protect information with encrypted transmission, role-based access control, restricted administrative access and scheduled backups.",
      "We do not claim certifications we do not hold. If you require evidence of a specific security control for your own compliance purposes, ask us and we will tell you honestly whether we can provide it.",
      "No system is completely secure. If a breach affects your information, we will notify you promptly and tell you what happened and what we are doing about it.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: [
      "We may update this policy as our services change. The date at the top of this page shows when it was last revised. Where a change materially affects how we handle your information, we will make that clear rather than quietly amending the text.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(crumbs)} />
      <LegalPage
        title="Privacy Policy"
        intro="What we collect through this website, what we do with it, and how we handle data inside the systems we host for our clients."
        updated="14 August 2026"
        sections={sections}
        crumbs={crumbs}
      />
    </>
  )
}
