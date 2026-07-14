import { Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/Toast";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { CookieConsent } from "@/components/analytics/CookieConsent";
import "../globals.css";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://gruporubio.es",
  "name": "Grupo Rubio",
  "description": "Servicios integrales de limpieza profesional, control de plagas DDD e higiene industrial en Navarra, La Rioja y Aragón.",
  "url": "https://gruporubio.es",
  "telephone": "+34948825025",
  "email": "administracion@gruporubio.net",
  "foundingDate": "1970",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Tudela",
    "addressLocality": "Tudela",
    "addressRegion": "Navarra",
    "postalCode": "31500",
    "addressCountry": "ES"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 42.0603,
    "longitude": -1.6072
  },
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "Navarra" },
    { "@type": "AdministrativeArea", "name": "La Rioja" },
    { "@type": "AdministrativeArea", "name": "Aragón" }
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    }
  ],
  "serviceType": [
    "Limpieza profesional",
    "Control de plagas DDD",
    "Desratización",
    "Desinsectación",
    "Desinfección",
    "Ozonización",
    "Tratamiento anti-termitas",
    "Limpieza de altura",
    "Tratamiento de suelos"
  ],
  "sameAs": []
};

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "es" | "en" | "fr" | "eu")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <main className="flex-1 w-full min-w-0 flex flex-col">
              {children}
            </main>
            <Toaster />
            <ChatWidget />
            <CookieConsent />
            <GoogleTagManager />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
