/**
 * Implementation process shown on the homepage and /demo.
 * Timelines here are deliberately honest: a system with data migration,
 * printers, inventory setup and staff training is not a five-minute install.
 */
export const PROCESS_STEPS = [
  {
    number: 1,
    title: "Request a Demo",
    description:
      "We review your business workflow, staff roles, billing needs, hardware and reporting requirements, then show you the system configured for your industry.",
    detail: "Typically a 30–45 minute conversation, in person or remote.",
  },
  {
    number: 2,
    title: "Test for 15 Days",
    description:
      "You use a safe demonstration or configured evaluation environment with your own products or menu before any payment is due.",
    detail: "No credit card required. Trial data may be reset after the evaluation.",
  },
  {
    number: 3,
    title: "Approve and Launch",
    description:
      "Once you approve, the software licence is paid, your data is configured, staff are trained, and the first month of hosting and support is included.",
    detail: "Setup time depends on data migration, hardware and the number of staff to train.",
  },
]

/** Support levels as actually offered. */
export const SUPPORT_TIERS = [
  {
    name: "Basic remote support",
    availability: "Included with Starter packages",
    points: ["Remote assistance during support hours", "Email and phone support", "Bug fixes and updates"],
  },
  {
    name: "Priority remote support",
    availability: "Included with Standard packages",
    points: [
      "Priority queue during support hours",
      "Remote screen-share assistance",
      "Standard onboarding and staff training",
      "Bug fixes and updates",
    ],
  },
  {
    name: "Dedicated support",
    availability: "Enterprise",
    points: [
      "Named point of contact",
      "Agreed response-time SLA",
      "Custom training sessions",
      "Advanced backup arrangements",
    ],
  },
]

/** Security and data-handling statements. Only verifiable claims belong here. */
export const SECURITY_POINTS = [
  {
    title: "Encrypted in transit",
    body: "All traffic between your devices and the system is encrypted over HTTPS.",
  },
  {
    title: "Role-based access",
    body: "Staff see only what their role permits. Sensitive actions such as voids, discounts and price edits are restricted and recorded.",
  },
  {
    title: "Scheduled backups",
    body: "Backups run on a schedule as part of your hosting service and can be restored on request. Frequency and retention are confirmed in writing during onboarding.",
  },
  {
    title: "Your data is yours",
    body: "Business data belongs to your business and can be exported. Source-code ownership is separate and only transfers under a signed agreement.",
  },
  {
    title: "Audit records",
    body: "Edits, voids and discounts are recorded with the user and timestamp. Complete audit trails across all modules are part of the Enterprise scope.",
  },
  {
    title: "Access review on offboarding",
    body: "Staff accounts can be disabled immediately, and we assist with access review when your team changes.",
  },
]
