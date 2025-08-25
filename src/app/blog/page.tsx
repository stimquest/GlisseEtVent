
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog | Glisse et Vent",
  description: "Conseils, actualités et histoires de pilotes de char à voile. Apprenez les meilleures techniques et découvrez les secrets de notre sport.",
};

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

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <header className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl flex items-center justify-center gap-3">
                <BookOpen className="w-12 h-12 text-accent" />
                Le Blog de Glisse et Vent
            </h1>
            <p className="text-2xl text-muted-foreground mt-2">Conseils, actualités et histoires de pilotes.</p>
        </header>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <Card key={post.slug} className="flex flex-col overflow-hidden">
              <div className="h-48 relative">
                <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" data-ai-hint={post.hint} />
              </div>
              <CardHeader>
                <CardTitle as="h2" className="text-2xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-xl">{post.excerpt}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-accent hover:text-accent-foreground">
                  <Link href={`/blog/${post.slug}`}>
                    Lire la suite <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
