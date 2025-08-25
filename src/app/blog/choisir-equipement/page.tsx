
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sailboat, Wind, Shield } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Choisir son Équipement : Le Guide du Débutant en Char à Voile | Glisse et Vent",
  description: "Découvrez comment choisir le bon équipement pour débuter en char à voile. Nos conseils sur le char, la voile, le casque et la tenue pour une pratique sûre et confortable.",
};

export default function ArticleEquipement() {
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
          
          <header>
            <h1 className="text-4xl md:text-6xl font-headline text-center mb-8">
              Choisir son Équipement : Le Guide du Débutant
            </h1>
          </header>

          <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-8">
            <Image 
              src="/img/Blog/Art4.jpg" 
              alt="Alignement de chars à voile sur la plage, prêts à l'emploi" 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 1000px"
              className="object-cover"
              data-ai-hint="sailing equipment" 
            />
          </div>

          <div className="prose prose-xl max-w-none mx-auto text-foreground space-y-6 text-xl">
            <p>Se lancer dans le char à voile est une aventure excitante ! Mais avant de sentir le sable filer sous vos roues, il est important de comprendre le rôle de chaque pièce d'équipement. Chez Glisse et Vent, nous fournissons tout le matériel nécessaire, mais savoir de quoi il s'agit vous mettra plus en confiance pour votre première session.</p>
            
            <section>
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle as="h2" className="text-2xl flex items-center gap-2"><Sailboat className="w-6 h-6"/>Le Char : Votre Compagnon de Glisse</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Le char est votre cockpit. Il se compose d'un châssis, de trois roues, et d'un siège où vous serez confortablement installé. La direction se contrôle avec les pieds, grâce à un palonnier. Nos chars sont modernes, stables et adaptés à l'initiation, pour vous garantir une prise en main facile et sécurisante.</p>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card className="bg-card">
                  <CardHeader><CardTitle as="h2" className="text-2xl flex items-center gap-2"><Wind className="w-6 h-6"/>La Voile : Le Moteur</CardTitle></CardHeader>
                  <CardContent>
                      <p>C'est elle qui capte la force du vent pour vous propulser. La taille de la voile peut varier en fonction de la force du vent et du poids du pilote. Pour les débutants et les jours de grand vent, on utilise une plus petite voile pour un contrôle optimal. Vous apprendrez à la régler avec une corde appelée "écoute" pour accélérer ou ralentir.</p>
                  </CardContent>
              </Card>
            </section>

            <section>
               <Card className="bg-card">
                  <CardHeader><CardTitle as="h2" className="text-2xl flex items-center gap-2"><Shield className="w-6 h-6"/>Le Casque : La Sécurité Avant Tout</CardTitle></CardHeader>
                  <CardContent>
                      <p>Non négociable ! Le port du casque est obligatoire pour tous. Il vous protège en cas de dessalage (le char se couche sur le côté) ou de tout autre imprévu. Nous fournissons des casques homologués et confortables à votre taille. Votre sécurité est notre priorité absolue.</p>
                  </CardContent>
              </Card>
            </section>

             <section>
               <Card className="bg-card">
                  <CardHeader><CardTitle as="h2" className="text-2xl">La Tenue : Confort et Protection</CardTitle></CardHeader>
                  <CardContent>
                      <p>Même en été, le vent peut être frais sur la plage. Prévoyez une tenue confortable qui ne craint pas le sable et l'eau de mer. Un coupe-vent est souvent une bonne idée. Le plus important : des chaussures fermées (baskets ou bottillons néoprène) sont obligatoires pour protéger vos pieds. Les gants sont fortement conseillés pour protéger vos mains de l'écoute.</p>
                  </CardContent>
              </Card>
            </section>

            <p>Vous voilà prêt ! N'oubliez pas que nos moniteurs sont là pour vous guider dans le choix et le réglage du matériel avant chaque session. Leur objectif est que vous vous sentiez à l'aise pour ne penser qu'à une chose : le plaisir de la glisse !</p>
          </div>
        </article>
      </main>
    </div>
  );
}
