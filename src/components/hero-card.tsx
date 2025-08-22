
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";


export function HeroCard({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full overflow-hidden relative text-white", className)}>
        <div className="absolute inset-0 z-0">
             <Image 
                src="/img/hero.png"
                alt="Char à voile sur la plage de Denneville"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        </div>
      <CardContent className="relative z-10 flex flex-col items-center justify-center text-center h-full p-6 md:p-12">
        <h2 className="text-5xl md:text-7xl tracking-wider text-white">
            Votre Aventure Char à Voile
        </h2>
        <p className="mt-2 text-3xl md:text-4xl text-accent">
            À Denneville-Plage
        </p>
        <p className="mt-4 max-w-2xl text-2xl">
            Découvrez le plaisir de la vitesse et la liberté de glisser sur le sable. Que vous soyez débutant ou pilote confirmé, Glisse et Vent vous propose une expérience inoubliable.
        </p>
        <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-white hover:text-accent-foreground animate-bounce">
            <Link href="/formules-tarifs">
                Découvrir nos formules
                <ArrowDown className="ml-2 h-5 w-5"/>
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
