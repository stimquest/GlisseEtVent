"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  // Vérifier le consentement au chargement
  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  // Accepter tous les cookies
  const acceptAllCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("cookie-essential", "true");
    localStorage.setItem("cookie-analytics", "true");
    localStorage.setItem("cookie-marketing", "true");
    setShowBanner(false);
  };

  // Refuser tous les cookies sauf essentiels
  const acceptEssentialOnly = () => {
    localStorage.setItem("cookie-consent", "essential-only");
    localStorage.setItem("cookie-essential", "true");
    localStorage.setItem("cookie-analytics", "false");
    localStorage.setItem("cookie-marketing", "false");
    setShowBanner(false);
  };

  // Fermer la bannière
  const closeBanner = () => {
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          {/* Contenu principal */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-accent mb-2">
              🍪 Cookies et confidentialité
            </h3>

            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Ce site utilise des cookies pour améliorer votre expérience. Nous respectons votre vie privée et utilisons uniquement des cookies nécessaires au fonctionnement du site.
              Votre consentement est requis par la RGPD. Pour plus d'informations, consultez notre{" "}
              <Link href="/rgpd" className="text-accent hover:underline">
                politique de confidentialité
              </Link>.
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={acceptAllCookies}
                className="bg-accent text-white hover:bg-accent/90"
                size="sm"
              >
                Tout accepter
              </Button>

              <Button
                onClick={acceptEssentialOnly}
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-white"
                size="sm"
              >
                Essentiels seulement
              </Button>

              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-accent"
              >
                <Link href="/rgpd">
                  En savoir plus
                </Link>
              </Button>
            </div>
          </div>

          {/* Bouton de fermeture */}
          <Button
            onClick={closeBanner}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}