
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Users, Sunset, Mail } from "lucide-react";

const monitors = [
  {
    name: "Frenzy",
    role: "Moniteur Principal & Fondateur",
    bio: "Passionné de char à voile depuis son plus jeune âge, François a fondé Glisse et Vent pour partager son amour de la glisse et du vent. Il saura vous transmettre les meilleures techniques en toute sécurité.",
    image: "https://placehold.co/400x400.png",
    hint: "male portrait"
  },
  {
    name: "Rayan",
    role: "Moniteur & Spécialiste Vitesse",
    bio: "Compétieur dans l'âme, Rayan est notre expert en vitesse et en perfectionnement. Il vous poussera à dépasser vos limites sur le sable de Denneville.",
    image: "https://placehold.co/400x400.png",
    hint: "male portrait"
  }
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle as="h1" className="text-4xl flex items-center gap-3">
              <Sunset className="w-8 h-8 text-accent" />
              Notre École, Notre Passion
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 space-y-4">
              <p className="text-2xl">
                Bienvenue chez Glisse et Vent, votre école de char à voile à Denneville-Plage. Née de la passion pour le vent et les grands espaces, notre mission est de vous faire découvrir les joies de ce sport exaltant dans un cadre exceptionnel et une ambiance conviviale.
              </p>
              <p className="text-xl">
                Que vous soyez débutant curieux ou pilote confirmé, nous nous engageons à vous offrir une expérience inoubliable, alliant apprentissage, sécurité et plaisir.
              </p>
            </div>
            <div className="md:w-1/2 h-64 md:h-80 relative rounded-lg overflow-hidden">
              <Image src="https://placehold.co/800x600.png" alt="Char à voile naviguant au coucher du soleil sur la plage de Denneville - École Glisse et Vent" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" data-ai-hint="sailing sunset" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle as="h2" className="text-4xl flex items-center gap-3">
              <Users className="w-8 h-8 text-accent" />
              Nos Moniteurs
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            {monitors.map(monitor => (
              <div key={monitor.name} className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-32 h-32 relative rounded-full overflow-hidden shrink-0">
                  <Image src={monitor.image} alt={`Portrait de ${monitor.name} - ${monitor.role} chez Glisse et Vent`} fill sizes="128px" className="object-cover" data-ai-hint={monitor.hint} />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-semibold">{monitor.name}</h3>
                  <p className="text-accent font-semibold text-lg">{monitor.role}</p>
                  <p className="mt-2 text-muted-foreground text-xl">{monitor.bio}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="text-center">
            <CardHeader>
                <CardTitle as="h2" className="text-4xl">Prêt à nous rejoindre ?</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-xl">Contactez-nous pour toute question ou réservation.</p>
                <Button asChild size="lg" className="bg-primary hover:bg-accent hover:text-accent-foreground">
                    <Link href="/contact">
                        <Mail className="mr-2 h-5 w-5" />
                        Contactez-nous
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
