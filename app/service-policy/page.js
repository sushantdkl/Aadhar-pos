import LegalPage from "@/components/marketing/legal-page"
import { pageMetadata, breadcrumbSchema, JsonLd } from "@/lib/seo"
import { CONTACT } from "@/lib/content/site"

export const metadata = pageMetadata({
  title: "Service Policy",
  description:
    "What the AADHAR monthly service covers: hosting, backups, maintenance, updates and support, with published support hours, response targets, and what falls outside the service.",
  path: "/service-policy",
})

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Service Policy", path: "/service-policy" },
]

const sections = [
  {
    id: "scope",
    heading: "What the monthly service covers",
    body: [
      "Your monthly hosting and maintenance charge covers the ongoing operation of your system. Specifically:",
      {
        list: [
          "Cloud hosting of your application, database and public website.",
          "Your domain, registered and renewed with the registrar on your behalf.",
          "Scheduled backups, with restore available on request.",
          "Security patches and platform maintenance.",
          "Product updates and bug fixes released for your package.",
          "Remote support during our published support hours, at the level included in your package.",
        ],
      },
      "The monthly charge is a service fee, not a licence renewal. The purchased software licence does not expire and does not require annual renewal.",
    ],
  },
  {
    id: "support-hours",
    heading: "Support hours and response",
    body: [
      `Support is provided ${CONTACT.hours}. We do not offer 24/7 support and we do not advertise a service level we cannot staff.`,
      "Our response targets during support hours are:",
      {
        list: [
          "Critical — billing is completely unavailable: we aim to begin work within 2 hours.",
          "High — a core function is unusable but billing continues: we aim to respond within 1 working day.",
          "Normal — questions, configuration changes and minor issues: we aim to respond within 2 working days.",
        ],
      },
      "These are targets, not contractual guarantees. A guaranteed response-time SLA is available as part of an Enterprise agreement and is set out in that agreement rather than here.",
    ],
  },
  {
    id: "channels",
    heading: "How to reach support",
    body: [
      `Existing clients should email ${CONTACT.supportEmail} with the business name so we can locate the correct configuration quickly. Phone and WhatsApp are available during support hours for urgent issues.`,
      "For faster resolution, please include what you were doing, what you expected, what happened instead, and a screenshot where relevant.",
    ],
  },
  {
    id: "availability",
    heading: "Availability and interruptions",
    body: [
      "We work to keep your system continuously available, and we do not publish an uptime percentage we have not measured and cannot evidence.",
      "Planned maintenance is scheduled outside peak trading hours wherever possible and announced in advance. Unplanned interruptions are communicated as soon as we are aware of them.",
      "The system is cloud-hosted and requires an internet connection to operate. We do not currently offer verified offline billing with later synchronization. Interruptions arising from your internet connection, your local hardware, power supply or third-party providers fall outside our control.",
    ],
  },
  {
    id: "backups",
    heading: "Backups and data recovery",
    body: [
      "Backups are taken on a schedule as part of the hosting service. Backup frequency and retention for your plan are confirmed in writing during onboarding.",
      "You may request a restore or a data export at any time during an active service. Your business data belongs to your business.",
      "Advanced backup arrangements, including more frequent snapshots and longer retention, are available under Enterprise agreements.",
    ],
  },
  {
    id: "outside",
    heading: "What falls outside the monthly service",
    body: [
      {
        list: [
          "New features or modules outside your agreed package — these are scoped and estimated separately.",
          "Additional outlets or branches, which require a separate quotation.",
          "Data migration beyond what was agreed at onboarding.",
          "Hardware supply, repair or replacement.",
          "SMS charges, payment-provider fees and other third-party services. Your domain is the exception — it is included and renewed as part of the monthly charge.",
          "Re-training beyond the sessions included in your package.",
          "Recovery from data loss caused by actions taken within your own accounts, where no backup restore point covers it.",
        ],
      },
      "We will always tell you before work moves outside the included service, and confirm any additional cost in writing before starting.",
    ],
  },
  {
    id: "responsibilities",
    heading: "Your responsibilities",
    body: [
      {
        list: [
          "Keeping staff account credentials secure and disabling accounts when staff leave.",
          "Maintaining a working internet connection and compatible hardware at your premises.",
          "Providing accurate business data during setup and keeping product, menu and pricing information current.",
          "Nominating a point of contact who can make decisions about configuration.",
          "Meeting your own tax and regulatory obligations. The software supports your record-keeping; it does not transfer legal responsibility for compliance to us.",
        ],
      },
    ],
  },
  {
    id: "changes",
    heading: "Changes to the service",
    body: [
      "We may improve, change or retire parts of the product over time. Where a change materially reduces a capability you rely on, we will give reasonable notice and discuss alternatives with you.",
      "Where we change the monthly service charge, we will give at least 30 days' written notice before it takes effect.",
      "Capabilities described on this website as planned or subject to verification are not part of the service until we confirm in writing that they are available for your business.",
    ],
  },
  {
    id: "suspension",
    heading: "Suspension and termination",
    body: [
      "We may suspend the hosted service where monthly charges remain unpaid after written reminders, or where use of the system breaches our Terms of Service. We will give notice before suspending, and we will provide a data export on request.",
      "Either party may end the monthly service with 15 days' written notice. Ending the service stops hosting, backups, maintenance and support; the software licence you purchased is unaffected, but the hosted system will no longer be available.",
    ],
  },
]

export default function ServicePolicyPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(crumbs)} />
      <LegalPage
        title="Service Policy"
        intro="What your monthly hosting and maintenance charge covers, what support you can expect, and what sits outside the service."
        updated="14 August 2026"
        sections={sections}
        crumbs={crumbs}
      />
    </>
  )
}
