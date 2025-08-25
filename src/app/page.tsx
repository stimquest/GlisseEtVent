
import { Header } from "@/components/header";
import { ScheduleCard } from "@/components/schedule-card";
import { GalleryCard } from "@/components/gallery-card";
import { WindCard } from "@/components/wind-card";
import { ContactCard } from "@/components/contact-card";
import { HeroCard } from "@/components/hero-card";
import { AboutCard } from "@/components/about-card";
import { GameCard } from "@/components/game-card";
import { BlogCarousel } from "@/components/blog-carousel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 space-y-8">
        <HeroCard />
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
    </div>
  );
}
