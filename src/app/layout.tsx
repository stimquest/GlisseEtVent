
"use client";

import { useState, type ReactElement } from "react";
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AdminProvider } from './admin/admin-context';
import { AdminUILayout } from "@/components/admin/admin-ui-layout";
import { usePathname } from 'next/navigation';
import { CookieBanner } from "@/components/cookie-banner";

function AdminAuthWrapper({ children }: { children: ReactElement }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "glisse123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Mot de passe incorrect.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-sm p-8 space-y-6 bg-card rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Accès Admin</h1>
            <p className="text-muted-foreground">Veuillez entrer le mot de passe.</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-3 py-2 text-base text-foreground bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
      <AdminUILayout>
          {children}
      </AdminUILayout>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Glisse et Vent | École de Char à Voile à Denneville-Plage</title>
        <meta name="description" content="Découvrez le char à voile sur la magnifique plage de Denneville. Cours d'initiation, réservation de créneaux, et activités de groupe. Rejoignez-nous pour une aventure inoubliable." />
        <meta name="keywords" content="char à voile, denneville, glisse, vent, école de voile, sport de plage, normandie, cotentin, activité de groupe, séminaire, char à voile normandie" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Glisse et Vent | École de Char à Voile à Denneville-Plage" />
        <meta property="og:description" content="Découvrez le char à voile sur la magnifique plage de Denneville. Cours d'initiation, réservation de créneaux, et activités de groupe." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://glisse-et-vent.netlify.app" />
        <meta property="og:image" content="/img/hero.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="Glisse et Vent" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Glisse et Vent | École de Char à Voile à Denneville-Plage" />
        <meta name="twitter:description" content="Découvrez le char à voile sur la magnifique plage de Denneville. Cours d'initiation, réservation de créneaux, et activités de groupe." />
        <meta name="twitter:image" content="/img/hero.png" />
        <meta name="twitter:site" content="@glisseetvent" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://glisse-et-vent.netlify.app" />
        
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsActivityLocation",
              "name": "Glisse et Vent",
              "description": "École de char à voile à Denneville-Plage en Normandie",
              "url": "https://glisse-et-vent.netlify.app",
              "telephone": "+33-XX-XX-XX-XX",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Plage de Denneville",
                "addressLocality": "Denneville",
                "postalCode": "50580",
                "addressRegion": "Normandie",
                "addressCountry": "FR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 49.3170,
                "longitude": -1.6590
              },
              "openingHours": "Mo-Su 09:00-19:00",
              "priceRange": "€€",
              "currenciesAccepted": "EUR",
              "paymentAccepted": "Cash, Credit Card",
              "sports": ["Char à voile", "Sports de glisse"],
              "areaServed": ["Normandie", "Cotentin"],
              "sameAs": [
                "https://www.facebook.com/glisseetvent",
                "https://www.instagram.com/glisseetvent"
              ]
            })
          }}
        />
      </head>
      <body className="font-body antialiased">
        <AdminProvider>
            {isAdminRoute ? <AdminAuthWrapper>{children as ReactElement}</AdminAuthWrapper> : children}
        </AdminProvider>
        <CookieBanner />
        <Toaster />
      </body>
    </html>
  );
}
