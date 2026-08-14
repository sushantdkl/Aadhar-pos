import Link from "next/link"
import { Mail, Phone, MapPin, Clock, MessageCircle, FileText } from "lucide-react"
import PageShell, { PageHero } from "@/components/marketing/page-shell"
import ContactForm from "@/components/marketing/contact-form"
import { FAQ } from "@/components/marketing/sections"
import { CONTACT, SITE } from "@/lib/content/site"
import { pageMetadata, breadcrumbSchema, organizationSchema, JsonLd } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Contact",
  description: `Contact AADHAR — business software for restaurants, retail, hotels, salons, travel agencies and event venues in ${SITE.country}. Phone, email and WhatsApp, ${CONTACT.hours}.`,
  path: "/contact",
})

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
]

const whatsappHref = `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`

export default function ContactPage() {
  return (
    <PageShell>
      <JsonLd schema={[breadcrumbSchema(crumbs), organizationSchema()]} />

      <PageHero
        eyebrow="Contact"
        title="Talk to the team that builds it."
        subtitle="Ask a question, arrange a demo, or get help with an existing system. We reply during our published support hours — we do not claim 24/7 cover we cannot staff."
        breadcrumbs={crumbs}
      />

      <section className="bg-white px-4 py-12 dark:bg-slate-950 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send us a message</h2>
              <p className="mb-6 mt-1.5 text-sm text-gray-600 dark:text-slate-400">
                Required fields are marked with an asterisk.
              </p>
              <ContactForm />
            </div>
          </div>

          {/* Details */}
          <aside className="space-y-5 lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
              <h2 className="mb-4 text-base font-bold text-gray-900 dark:text-white">Direct contact</h2>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Phone</p>
                    <a
                      href={`tel:${CONTACT.phone}`}
                      className="text-gray-600 transition-colors hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400"
                    >
                      {CONTACT.phoneDisplay}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">WhatsApp</p>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 transition-colors hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400"
                    >
                      Message us on WhatsApp
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="break-all text-gray-600 transition-colors hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400"
                    >
                      {CONTACT.email}
                    </a>
                    <br />
                    <a
                      href={`mailto:${CONTACT.supportEmail}`}
                      className="break-all text-gray-600 transition-colors hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400"
                    >
                      {CONTACT.supportEmail}
                    </a>
                    <span className="block text-xs text-gray-500 dark:text-slate-500">
                      (existing clients)
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Location</p>
                    <p className="text-gray-600 dark:text-slate-400">
                      {CONTACT.address.city}, {CONTACT.address.country}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Support hours</p>
                    <p className="text-gray-600 dark:text-slate-400">{CONTACT.hours}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/[0.06] p-6">
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
                <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                Want a price instead?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                The quotation form captures the details we need — industry, outlets, users and modules —
                so we can send a costed proposal rather than a follow-up question.
              </p>
              <Link
                href="/get-quote"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:shadow-lg hover:shadow-orange-500/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
              >
                Get a Quote
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Existing client?</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                For support on a system you already run, email{" "}
                <a href={`mailto:${CONTACT.supportEmail}`} className="font-semibold text-orange-600 hover:underline dark:text-orange-400">
                  {CONTACT.supportEmail}
                </a>{" "}
                with your business name so we can find your configuration quickly. The{" "}
                <Link href="/docs" className="font-semibold text-orange-600 hover:underline dark:text-orange-400">
                  documentation
                </Link>{" "}
                also covers most setup questions.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <FAQ limit={6} />
    </PageShell>
  )
}
