import { SITE } from "@/lib/content/site"
import { INDUSTRIES } from "@/lib/content/industries"

/**
 * Static route map. Admin, login and API routes are deliberately excluded —
 * they are not public marketing pages and are disallowed in robots.txt.
 */
const ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/solutions", priority: 0.9, changeFrequency: "monthly" },
  { path: "/features", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/demo", priority: 0.8, changeFrequency: "monthly" },
  { path: "/clients", priority: 0.8, changeFrequency: "monthly" },
  { path: "/get-quote", priority: 0.8, changeFrequency: "yearly" },
  { path: "/about", priority: 0.7, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/docs", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.5, changeFrequency: "weekly" },
  { path: "/careers", priority: 0.4, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/service-policy", priority: 0.3, changeFrequency: "yearly" },
]

export default function sitemap() {
  const lastModified = new Date()

  const staticRoutes = ROUTES.map((r) => ({
    url: `${SITE.url}${r.path === "/" ? "" : r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const solutionRoutes = INDUSTRIES.map((i) => ({
    url: `${SITE.url}/solutions/${i.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...solutionRoutes]
}
