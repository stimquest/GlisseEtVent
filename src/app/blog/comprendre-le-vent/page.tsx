
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Wind, Compass } from "lucide-react";

export default function ArticleVent() {
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
            Comprendre le Vent : Le Secret des Pilotes Performants
          </h1>

          <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-8">
            <Image 
              src="https://placehold.co/1200x600.png" 
              alt="Manche à air sur une plage" 
              layout="fill" 
              objectFit="cover"
              data-ai-hint="wind weather" 
            />
          </div>

          <div className="prose prose-xl max-w-none mx-auto text-foreground space-y-6 text-xl">
            <p>En char à voile, le vent n'est pas un adversaire, c'est votre moteur. Apprendre à le lire, à l'anticiper et à l'utiliser est ce qui différencie un débutant d'un pilote expérimenté. Ce n'est pas qu'une question de force, mais surtout de finesse. Plongeons ensemble dans les secrets du vent.</p>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><Compass className="w-6 h-6"/>Les Allures : Votre Rapport au Vent</CardTitle>
              </CardHeader>
              <CardContent>
                <p>L'allure est l'angle de votre char par rapport à la direction du vent. On en distingue plusieurs principales :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Le près :</strong> Vous remontez au plus près du vent. C'est l'allure la plus lente mais essentielle pour gagner du terrain face au vent.</li>
                    <li><strong>Le travers :</strong> Vous êtes perpendiculaire au vent. C'est souvent l'allure où l'on ressent le plus de vitesse et de puissance.</li>
                    <li><strong>Le largue :</strong> Vous vous éloignez du vent, avec le vent venant de trois-quarts arrière. C'est l'allure la plus rapide !</li>
                    <li><strong>Le vent arrière :</strong> Vous allez dans la même direction que le vent. Contrairement à ce qu'on pourrait penser, ce n'est pas l'allure la plus rapide car la vitesse du vent apparent diminue.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card">
                <CardHeader><CardTitle className="text-2xl flex items-center gap-2"><Wind className="w-6 h-6"/>Vent Réel vs. Vent Apparent</CardTitle></CardHeader>
                <CardContent>
                    <p>Le <strong>vent réel</strong> est le vent que vous mesurez à l'arrêt. Mais dès que votre char avance, il crée son propre vent, le "vent vitesse". Le <strong>vent apparent</strong> est la combinaison du vent réel et du vent vitesse. C'est ce vent apparent que votre voile "ressent" et qui vous propulse. C'est pourquoi, même en allant vite, on a l'impression que le vent vient toujours plus de l'avant.</p>
                </CardContent>
            </Card>

             <Card className="bg-card">
                <CardHeader><CardTitle className="text-2xl">Lire la Plage : Rafales et Molles</CardTitle></CardHeader>
                <CardContent>
                    <p>Le vent n'est jamais parfaitement constant. Observez la surface du sable ou de l'eau (les petites flaques à marée basse). Une zone plus sombre et agitée annonce une <strong>rafale</strong> (surcroît de vent). Préparez-vous à border la voile ou à vous pencher ! Une zone plus lisse indique une <strong>molle</strong> (baisse de vent). Il faudra peut-être relancer le char en pompant avec la voile pour ne pas s'arrêter.</p>
                </CardContent>
            </Card>

            <p>Maîtriser le vent prend du temps et de l'observation. Chaque session est une occasion d'apprendre. C'est cette lecture permanente de l'environnement qui rend le char à voile si passionnant. Venez affûter vos sens avec nous à Denneville !</p>
          </div>
        </article>
      </main>
    </div>
  );
}
