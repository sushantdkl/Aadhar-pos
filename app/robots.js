import { SITE } from "@/lib/content/site"

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The admin panel, authentication and API surface are not public content.
        disallow: ["/api/", "/dashboard", "/dashboard/", "/login"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
