"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { ArrowDown, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.3;
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <Card className={cn("w-full overflow-hidden relative text-white", className)}>
        <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              poster="/img/hero.png"
            >
              <source src="/media/G&V02.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la vidéo.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        </div>

        {/* Bouton contrôle son */}
        <div className="absolute top-4 right-4 z-30 flex gap-2">
          <Button
            onClick={toggleMute}
            size="sm"
            variant="secondary"
            className="bg-black/50 hover:bg-black/70 text-white border-white/20"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

      <CardContent className="relative z-10 flex flex-col items-center justify-center text-center h-full p-6 md:p-12">
        <h1 className="text-3xl md:text-5xl lg:text-7xl tracking-wider text-white">
            Votre Aventure Char à Voile
        </h1>
        <p className="mt-2 text-2xl md:text-3xl lg:text-4xl text-accent font-semibold">
            À Denneville-Plage
        </p>
        <p className="mt-4 max-w-2xl text-xl md:text-2xl">
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