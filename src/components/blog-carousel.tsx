
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowRight, BookOpen } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

const blogPosts = [
  {
    title: "Choisir son Équipement : Le Guide du Débutant",
    excerpt: "Char, voile, casque... On vous explique tout ce qu'il faut savoir sur le matériel pour débuter en toute sérénité et sécurité.",
    image: "/img/Blog/Art4.jpg",
    hint: "sailing equipment",
    slug: "choisir-equipement"
  },
  {
    title: "5 Astuces pour Maîtriser votre Virage en Char à Voile",
    excerpt: "Le virage est une manœuvre clé. Découvrez nos conseils de pro pour tourner avec fluidité et vitesse...",
    image: "/img/Blog/Art2.jpg",
    hint: "sailing turn",
    slug: "astuces-virage"
  },
  {
    title: "Comprendre le Vent : Le Secret des Pilotes Performants",
    excerpt: "Le vent est votre moteur. Apprenez à lire ses sautes, à anticiper les rafales et à utiliser chaque souffle à votre avantage...",
    image: "/img/Blog/Art-vent.jpg",
    hint: "wind weather",
    slug: "comprendre-le-vent"
  },
  {
    title: "Denneville-Plage : Le Spot Idéal pour le Char à Voile",
    excerpt: "Pourquoi Denneville est-il un lieu si prisé ? Sable dur, vents réguliers, espace infini... On vous dit tout sur notre terrain de jeu.",
    image: "/img/Blog/Art-spot.jpg",
    hint: "beach landscape",
    slug: "spot-denneville"
  }
];

export function BlogCarousel({ className }: { className?: string }) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <Card className={cn("flex flex-col", className)}>
        <CardHeader>
            <CardTitle className="text-4xl flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-accent" />
                Le Blog
            </CardTitle>
             <CardDescription className="text-xl">Nos derniers conseils et articles.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
            <Carousel 
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                className="w-full h-full"
            >
                <CarouselContent className="-ml-1 h-full">
                    {blogPosts.map((post) => (
                        <CarouselItem key={post.slug} className="pl-1">
                            <div className="p-1 h-full">
                                <div className="flex flex-col h-full">
                                    <div className="h-48 relative rounded-t-lg overflow-hidden">
                                        <Image src={post.image} alt={post.title} fill sizes="300px" className="object-cover" data-ai-hint={post.hint} />
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                      <h3 className="text-2xl font-semibold mb-2">{post.title}</h3>
                                      <p className="text-xl text-muted-foreground mt-2 flex-grow">{post.excerpt}</p>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="absolute bottom-4 right-4 flex gap-2">
                    <CarouselPrevious className="static -translate-x-0 -translate-y-0" />
                    <CarouselNext className="static -translate-x-0 -translate-y-0" />
                </div>
            </Carousel>
        </CardContent>
         <CardFooter className="p-6">
            <Button asChild className="w-full bg-primary hover:bg-accent hover:text-accent-foreground">
              <Link href={`/blog`}>
                Voir tous les articles <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
        </CardFooter>
    </Card>
  );
}
