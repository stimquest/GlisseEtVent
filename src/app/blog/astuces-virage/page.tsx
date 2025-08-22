
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ArticleVirage() {
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
            5 Astuces pour Maîtriser votre Virage en Char à Voile
          </h1>

          <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-8">
            <Image 
              src="https://placehold.co/1200x600.png" 
              alt="Char à voile effectuant un virage" 
              layout="fill" 
              objectFit="cover"
              data-ai-hint="sailing turn" 
            />
          </div>

          <div className="prose prose-xl max-w-none mx-auto text-foreground space-y-6 text-xl">
            <p>Le virage est sans doute la manœuvre qui procure le plus de sensations en char à voile. Un virage réussi est fluide, rapide et vous relance parfaitement pour le bord suivant. Mais un virage raté peut vous stopper net. Voici 5 astuces de nos moniteurs pour vous aider à devenir le roi du jibe et de l'empannage sur le sable de Denneville !</p>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-2xl">1. Le Regard est la Clé</CardTitle>
              </CardHeader>
              <CardContent>
                <p>C'est la règle d'or dans de nombreux sports de glisse, et le char à voile ne fait pas exception. Votre char ira où votre regard se porte. Avant même d'initier la manœuvre, fixez le point de sortie de votre virage. Gardez la tête et les épaules tournées dans cette direction tout au long de la courbe. N'ayez pas peur de regarder loin derrière vous lors d'un empannage !</p>
              </CardContent>
            </Card>

            <Card className="bg-card">
                <CardHeader><CardTitle className="text-2xl">2. Anticipez la Pression de la Voile</CardTitle></CardHeader>
                <CardContent>
                    <p>Dans un virage, la puissance de la voile change brutalement. Lors d'un virement de bord (face au vent), vous allez perdre de la puissance. Il faut donc arriver avec une vitesse suffisante. À l'inverse, lors d'un empannage (dos au vent), la voile va passer d'un côté à l'autre avec force. Soyez prêt à choquer (relâcher) l'écoute pour éviter une transition trop violente et à vous pencher pour contrer la poussée.</p>
                </CardContent>
            </Card>

             <Card className="bg-card">
                <CardHeader><CardTitle className="text-2xl">3. Action Coordonnée : Palonnier et Écoute</CardTitle></CardHeader>
                <CardContent>
                    <p>Un virage réussi est une chorégraphie. Vos pieds (sur le palonnier) et vos mains (sur l'écoute) doivent travailler ensemble. Initiez doucement la courbe avec le palonnier, puis gérez la voile avec l'écoute. Une erreur commune est de trop pousser sur le palonnier d'un coup sec, ce qui fait déraper l'engin et vous fait perdre toute votre vitesse.</p>
                </CardContent>
            </Card>

             <Card className="bg-card">
                <CardHeader><CardTitle className="text-2xl">4. Utilisez le Poids de votre Corps</CardTitle></CardHeader>
                <CardContent>
                    <p>Votre corps est un outil essentiel pour équilibrer le char. N'hésitez pas à vous pencher à l'intérieur du virage pour aider le char à tourner et à maintenir les roues au sol. Dans un vent fort, se pencher à l'extérieur avant de déclencher l'empannage peut aider à contrôler la manœuvre.</p>
                </CardContent>
            </Card>

             <Card className="bg-card">
                <CardHeader><CardTitle className="text-2xl">5. La Pratique sur un Grand Espace</CardTitle></CardHeader>
                <CardContent>
                    <p>Denneville-Plage est l'endroit idéal pour s'entraîner. Profitez de l'immense étendue de sable à marée basse pour faire de larges virages au début. Ne cherchez pas la performance tout de suite. Concentrez-vous sur la fluidité et la décomposition du mouvement. La vitesse et les virages serrés viendront naturellement avec la confiance.</p>
                </CardContent>
            </Card>

            <p>Voilà, vous avez les bases ! Maintenant, il n'y a plus qu'à venir mettre tout ça en pratique avec nous. Réservez une séance et nos moniteurs se feront un plaisir de vous coacher personnellement !</p>
          </div>
        </article>
      </main>
    </div>
  );
}
