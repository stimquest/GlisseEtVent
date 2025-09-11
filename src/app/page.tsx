"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { ScheduleCard } from "@/components/schedule-card";
import { GalleryCard } from "@/components/gallery-card";
import { WindCard } from "@/components/wind-card";
import { ContactCard } from "@/components/contact-card";
import { HeroVideo } from "@/components/hero-video";
import { AboutCard } from "@/components/about-card";
import { GameCard } from "@/components/game-card";
import { BlogCarousel } from "@/components/blog-carousel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 space-y-8">
        <HeroVideo />
        <div className="columns-1 md:columns-2 lg:columns-4 gap-6 md:gap-8 space-y-6 md:space-y-8">
          <div className="break-inside-avoid">
            <WindCard />
          </div>
          <div className="break-inside-avoid">
             <AboutCard />
          </div>
          <div className="break-inside-avoid">
            <GalleryCard />
          </div>
          <div className="break-inside-avoid">
            <ScheduleCard />
          </div>
          <div className="break-inside-avoid">
            <BlogCarousel />
          </div>
          <div className="break-inside-avoid">
            <GameCard />
          </div>
          <div className="break-inside-avoid">
            <ContactCard showLink />
          </div>
        </div>
      </main>

      {/* Footer avec mentions légales et lien admin discret */}
      <footer className="mt-16 py-6 border-t border-border/50 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="text-center md:text-left">
              <p>&copy; 2025 Glisse et Vent - Char à Voile Denneville-plage</p>
              <p className="text-xs mt-1">Tous droits réservés</p>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <Link href="/status" className="hover:text-foreground transition-colors">
                🔍 Diagnostic
              </Link>
              <Link href="/rgpd" className="hover:text-foreground transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/mentions-legales" className="hover:text-foreground transition-colors">
                Mentions légales
              </Link>
              <a
                href="/admin"
                className="text-muted-foreground/60 hover:text-muted-foreground transition-colors opacity-60"
                title="Administration"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
