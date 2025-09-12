"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { ArrowDown, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubtleDotsOverlay } from "./subtle-dots-overlay";

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
    <Card className={cn("w-full h-[80vh] min-h-[60vh] md:h-[55vh] lg:h-[75vh] overflow-hidden relative text-white", className)}>
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
        </div>

        {/* Overlay discret de points */}
        <SubtleDotsOverlay />

<CardContent 
  className="
    relative z-10 
    flex flex-col justify-end items-center text-center 
    md:items-start md:justify-center md:text-left
    h-full p-4 md:p-8 lg:p-16
  "
>
  <div className="max-w-sm sm:max-w-md md:max-w-lg space-y-6 mb-40 md:mb-0">
    {/* Texte */}
    <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90">
      Découvrez le plaisir du char à voile et des loisirs nautiques en Cotentin. 
      Que vous soyez débutant ou pilote confirmé, 
      <span className="text-accent font-bold"> Glisse et Vent </span> 
      vous propose des activités outdoor inoubliables sur la plage de Denneville.
    </p>

    {/* Bouton */}
    <Button 
      asChild 
      size="lg" 
      className="bg-accent text-accent-foreground hover:bg-white hover:text-accent-foreground animate-bounce shadow-lg"
    >
      <Link href="/formules-tarifs">
        Réservez votre session
        <ArrowDown className="ml-2 h-4 w-4"/>
      </Link>
    </Button>
  </div>
</CardContent>



    </Card>
  );
}
