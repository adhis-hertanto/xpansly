import type { Metadata, Viewport } from "next";
import { GeistMono, GeistSans, recia } from "./fonts";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

/**
 * Sets --vw to the layout viewport width without the scrollbar before first paint,
 * so the scale system (tokens.css) keeps the side margins exact. No CLS: runs before render.
 */
const vwScript = `(function(){var d=document.documentElement;function s(){d.style.setProperty('--vw',d.clientWidth+'px')}s();addEventListener('resize',s,{passive:true})})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable} ${recia.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: vwScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
