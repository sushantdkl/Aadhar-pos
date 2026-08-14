import { SITE, CONTACT, enabledSocial } from "@/lib/content/site"

/**
 * Page metadata builder. Produces canonical URLs plus Open Graph and Twitter
 * cards from a single call, so every route has unique, consistent metadata.
 */
export function pageMetadata({ title, description, path = "/", image, noIndex = false, keywords }) {
  const url = `${SITE.url}${path === "/" ? "" : path}`
  const fullTitle = path === "/" ? `${SITE.name} — ${SITE.tagline}` : `${title} | ${SITE.name}`
  const ogImage = image || SITE.ogImage

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: SITE.locale,
      url,
      title: fullTitle,
      description,
      images: [{ url: `${SITE.url}${ogImage}`, width: 1200, height: 630, alt: `${SITE.name} — ${title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${SITE.url}${ogImage}`],
    },
  }
}

/* ── JSON-LD builders — only truthful, verifiable claims ── */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    url: SITE.url,
    logo: `${SITE.url}/FULL_LOGO_NAME+ICON.png`,
    description: SITE.description,
    email: CONTACT.email,
    telephone: CONTACT.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: CONTACT.address.city,
      addressCountry: "NP",
    },
    areaServed: { "@type": "Country", name: "Nepal" },
    sameAs: enabledSocial().map((s) => s.href),
  }
}

/**
 * SoftwareApplication schema. `offers` are only emitted for packages with a
 * real published price — quote-only packages are omitted rather than invented.
 */
export function softwareApplicationSchema({ name, description, path, packages = [] }) {
  const priced = packages.filter((p) => !p.quoteOnly && typeof p.oneTime === "number")

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `${SITE.url}${path}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web browser",
    author: { "@type": "Organization", name: SITE.legalName, url: SITE.url },
  }

  if (priced.length > 0) {
    schema.offers = priced.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: String(p.oneTime),
      priceCurrency: "NPR",
      description: `${p.description} One-time software licence; hosting and maintenance billed at NPR ${p.monthly} per month. Excludes 13% VAT.`,
      url: `${SITE.url}/pricing`,
    }))
  }

  return schema
}

export function productSchema({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url: `${SITE.url}${path}`,
    brand: { "@type": "Brand", name: SITE.name },
    category: "Business Software",
  }
}

export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
}

export function breadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE.url}${c.path}`,
    })),
  }
}

/** Renders one or more JSON-LD blocks. */
export function JsonLd({ schema }) {
  const blocks = Array.isArray(schema) ? schema : [schema]
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Content is generated from our own config, never user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  )
}
