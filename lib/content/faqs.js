import { CONTACT, EVALUATION } from "./site"

/**
 * FAQ content. Answers must reflect actual, verified capability.
 * Set `schema: false` on any entry that should be excluded from FAQPage
 * structured data (e.g. answers that are conditional rather than factual).
 */
export const FAQS = [
  {
    q: "What does the one-time charge cover?",
    a: "The one-time charge covers the agreed software licence for your business and the initial configuration — setting up your products or menu, categories, pricing, printers, staff accounts and permissions. It does not cover cloud hosting, ongoing maintenance, hardware, or custom features outside the agreed package.",
  },
  {
    q: "Why is there a monthly service charge?",
    a: "The monthly charge covers cloud hosting, scheduled backups, maintenance, updates and the agreed level of support. These are ongoing costs we carry every month on your behalf, so they are billed as a service rather than folded into the purchase price.",
  },
  {
    q: "Is there an annual licence renewal?",
    a: "No. The purchased version does not require an annual licence renewal. Only the monthly hosting and maintenance service continues. A one-time licence is not the same as lifetime free hosting, unlimited customization or unlimited support.",
  },
  {
    q: "How does the 15-day evaluation work?",
    a: `You get a ${EVALUATION.days}-day no-obligation evaluation on a safe demonstration or configured evaluation environment, with no credit card required. If you accept the system, the remainder of the first 30 days of hosting and support is included, and the one-time software charge becomes payable. Monthly hosting and maintenance begins after that included first month. Trial data may be reset after the evaluation period.`,
  },
  {
    q: "Is a website really included, even in the lowest package?",
    a: "Yes. Every package, including the Starter tiers, includes a full public website for your customers — your own branding, a menu or product catalogue, a gallery, and a CMS you can edit yourself. It is not a template with your logo dropped in, and it is not an upsell. Your domain is included too: the monthly hosting and maintenance charge covers the hosting, the maintenance and the domain, and we pay the registrar on your behalf so you have nothing separate to arrange. You can see live client sites on our Clients page and judge the work before you commit.",
  },
  {
    q: "What is the difference between the WhatsApp button and WhatsApp ordering?",
    a: "Every package, including Starter, puts a WhatsApp contact button on your website so customers can message you directly. WhatsApp ordering integration — where orders placed over WhatsApp flow into the system alongside online order requests — is included from the Standard packages upward. Starter gives customers a way to reach you; Standard turns that into an ordering channel.",
  },
  {
    q: "Can I use my existing printer?",
    a: "Usually yes. Standard 58mm and 80mm thermal receipt printers are supported. Bring your printer model to the requirements discussion and we will confirm compatibility before you commit — we test it during the evaluation rather than promising in advance.",
  },
  {
    q: "Can AADHAR import my existing products and customers?",
    a: "Yes, through the Data Migration add-on. We can import products, customers, suppliers, opening stock and opening balances. Final cost depends on the quality and volume of your source data, which we review before quoting.",
  },
  {
    q: "Does AADHAR work on mobile, tablet and desktop?",
    a: "The system runs in a web browser and is used on desktop and tablet, which is what we recommend for billing. The interface is responsive on mobile for viewing reports and light tasks. There is no separate native mobile app at this time.",
  },
  {
    q: "What happens if the internet stops?",
    a: "The system is cloud-hosted and requires an internet connection to bill. We do not currently offer verified offline billing with later synchronization. For locations with unreliable connectivity we discuss a backup connection during onboarding, and we will tell you honestly if the setup is not suitable.",
  },
  {
    q: "Is AADHAR IRD compliant?",
    a: "IRD and CBMS integration is offered as a quotation-only add-on and is subject to technical verification and the applicable approval process. Until that process is complete for your business, we do not claim verified real-time IRD validation. The base packages record VAT-inclusive billing and produce tax reports.",
    schema: false,
  },
  {
    q: "Can AADHAR support multiple branches?",
    a: "Additional outlets are quoted separately and are offered once proper tenant and branch isolation has been verified for your configuration. Consolidated multi-outlet reporting and a central dashboard are part of the Enterprise scope.",
    schema: false,
  },
  {
    q: "Can I request custom features?",
    a: "Yes. Features outside your agreed package are scoped and estimated separately. For businesses that do not fit a standard package at all, we build custom ordering and management systems — see the Custom Software solution.",
  },
  {
    q: "Who owns my business data?",
    a: "You do. Your business data belongs to you and can be exported. Source-code ownership of the software is separate and is not included unless explicitly stated in a signed agreement.",
  },
  {
    q: "How are backups handled?",
    a: "Backups run on a schedule as part of the monthly hosting and maintenance service, and can be restored on request. Backup frequency and retention for your plan are confirmed in writing during onboarding.",
  },
  {
    q: "What support is included?",
    a: `Remote support is included with every package, with priority response on Standard and Enterprise plans. Our support hours are ${CONTACT.hours}. We do not offer 24/7 support, and we would rather say so than promise a response we cannot staff.`,
  },
]

/** Only entries marked for schema go into FAQPage structured data. */
export const schemaFaqs = () => FAQS.filter((f) => f.schema !== false)
