
import { Header } from "@/components/header";
import { ScheduleCard } from "@/components/schedule-card";
import { GalleryCard } from "@/components/gallery-card";
import { WindCard } from "@/components/wind-card";
import { ContactCard } from "@/components/contact-card";
import { HeroCard } from "@/components/hero-card";
import { AboutCard } from "@/components/about-card";
import { GameCard } from "@/components/game-card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <HeroCard className="md:col-span-2 lg:col-span-4" />
          <WindCard className="lg:col-span-1 md:col-span-1" />
          <AboutCard className="lg:col-span-1 md:col-span-1" />
          <GalleryCard className="md:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[400px]" />
          <ScheduleCard className="md:col-span-2 lg:col-span-2" />
           <GameCard className="md:col-span-2 lg:col-span-2" />
          <ContactCard className="md:col-span-2 lg:col-span-2" showLink />
        </div>
      </main>
    </div>
  );
}

    