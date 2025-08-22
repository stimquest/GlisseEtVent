
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    title: "5 Astuces pour Maîtriser votre Virage en Char à Voile",
    excerpt: "Le virage est une manœuvre clé. Découvrez nos conseils de pro pour tourner avec fluidité et vitesse...",
    image: "https://placehold.co/800x500.png",
    hint: "sailing turn",
    slug: "astuces-virage"
  },
  {
    title: "Comprendre le Vent : Le Secret des Pilotes Performants",
    excerpt: "Le vent est votre moteur. Apprenez à lire ses sautes, à anticiper les rafales et à utiliser chaque souffle à votre avantage...",
    image: "https://placehold.co/800x500.png",
    hint: "wind weather",
    slug: "comprendre-le-vent"
  },
  {
    title: "Denneville-Plage : Le Spot Idéal pour le Char à Voile",
    excerpt: "Pourquoi Denneville est-il un lieu si prisé ? Sable dur, vents réguliers, espace infini... On vous dit tout sur notre terrain de jeu.",
    image: "https://placehold.co/800x500.png",
    hint: "beach landscape",
    slug: "spot-denneville"
  }
];

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl flex items-center justify-center gap-3">
                <BookOpen className="w-12 h-12 text-accent" />
                Le Blog de Glisse et Vent
            </h1>
            <p className="text-2xl text-muted-foreground mt-2">Conseils, actualités et histoires de pilotes.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <Card key={post.slug} className="flex flex-col overflow-hidden">
              <div className="h-48 relative">
                <Image src={post.image} alt={post.title} layout="fill" objectFit="cover" data-ai-hint={post.hint} />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
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
