import './globals.css'
import ThemeProvider from '@/components/theme-provider'
import { SITE } from '@/lib/content/site'

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName, url: SITE.url }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  manifest: '/site.webmanifest',
  icons: {
    icon: [{ url: '/LOGO_Icon_only.png', type: 'image/png' }],
    apple: [{ url: '/LOGO_Icon_only.png' }],
  },
  formatDetection: { telephone: true, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
}

/**
 * Applies the stored theme before first paint so the page does not flash the
 * wrong colour scheme. Kept inline and minimal — it only touches a class name.
 */
const themeScript = `(function(){try{var t=localStorage.getItem('aadhar-theme')||'dark';var r=document.documentElement;if(t==='light'){r.classList.remove('dark')}else{r.classList.add('dark')}}catch(e){}})();`

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-white text-gray-900 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
