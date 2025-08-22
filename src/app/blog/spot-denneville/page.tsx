
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mountain, Waves } from "lucide-react";

export default function ArticleSpot() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="outline">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au Blog
              </Link>
            </Button>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-headline text-center mb-8">
            Denneville-Plage : Le Spot Idéal pour le Char à Voile
          </h1>

          <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-8">
            <Image 
              src="https://placehold.co/1200x600.png" 
              alt="Vaste plage de Denneville" 
              layout="fill" 
              objectFit="cover"
              data-ai-hint="beach landscape" 
            />
          </div>

          <div className="prose prose-xl max-w-none mx-auto text-foreground space-y-6 text-xl">
            <p>On nous demande souvent pourquoi nous avons choisi Denneville-Plage pour installer notre école Glisse et Vent. La réponse est simple : c'est un terrain de jeu exceptionnel, qui combine toutes les qualités requises pour une pratique du char à voile en toute sécurité et avec un maximum de plaisir. Laissez-nous vous présenter notre "bureau".</p>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><Waves className="w-6 h-6"/>Une Plage à l'Infinie (ou presque)</CardTitle>
              </CardHeader>
              <CardContent>
                <p>À marée basse, Denneville-Plage dévoile un banc de sable immense, qui s'étend sur des kilomètres de long et plusieurs centaines de mètres de large. Cet espace infini est un atout majeur : il permet aux débutants d'apprendre sans stress et sans risque de collision, et aux pilotes confirmés de tirer de longs bords pour atteindre des vitesses grisantes. Pas besoin de se soucier des obstacles, il n'y en a pas !</p>
              </CardContent>
            </Card>

            <Card className="bg-card">
                <CardHeader><CardTitle className="text-2xl">Un Sable Parfait pour la Glisse</CardTitle></CardHeader>
                <CardContent>
                    <p>Tous les sables ne se valent pas. Ici, le sable est dur et compact. C'est le revêtement idéal pour le char à voile. Les roues ont une faible résistance au roulement, ce qui permet de démarrer facilement même dans un vent léger et d'atteindre des vitesses élevées. Finis les enlisements frustrants, place à la glisse pure !</p>
                </CardContent>
            </Card>

             <Card className="bg-card">
                <CardHeader><CardTitle className="text-2xl">Des Vents Réguliers</CardTitle></CardHeader>
                <CardContent>
                    <p>Située sur la côte ouest du Cotentin, Denneville bénéficie de vents d'ouest dominants, qui arrivent directement de la mer. Ces vents sont généralement laminaires, c'est-à-dire stables et réguliers, sans les turbulences que l'on pourrait trouver près des falaises ou des bâtiments. C'est la garantie d'une progression agréable et de conditions de navigation optimales une grande partie de l'année.</p>
                </CardContent>
            </Card>

             <Card className="bg-card">
                <CardHeader><CardTitle className="text-2xl flex items-center gap-2"><Mountain className="w-6 h-6"/>Un Cadre Naturel Préservé</CardTitle></CardHeader>
                <CardContent>
                    <p>Au-delà des aspects techniques, naviguer à Denneville, c'est aussi profiter d'un cadre exceptionnel. Le cordon dunaire sauvage, classé et protégé, offre un décor magnifique et une sensation de liberté totale. C'est l'occasion de se reconnecter à la nature tout en faisant le plein d'adrénaline.</p>
                </CardContent>
            </Card>

            <p>Vous l'aurez compris, nous ne sommes pas à Denneville par hasard. C'est pour nous le meilleur endroit pour partager notre passion. Venez le découvrir par vous-même !</p>
          </div>
        </article>
      </main>
    </div>
  );
}
