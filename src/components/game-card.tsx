
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Gamepad2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function GameCard({ className }: { className?: string }) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-4xl flex items-center gap-2">
          <Gamepad2 className="w-8 h-8 text-accent" />
          Mini-Jeu : Le Défi du Pilote
        </CardTitle>
        <CardDescription className="text-2xl">
          Faites le meilleur score en 60 secondes !
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-xl">
          Esquivez les rochers et survivez 60 secondes ! Déplacez le char avec votre souris et cliquez frénétiquement pour tendre la voile et accélérer. Attention aux rafales de vent qui décuplent votre vitesse mais vous déstabilisent !
        </p>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image src="/ScreenGame.png" alt="Capture d'écran du mini-jeu de char à voile" fill className="object-cover" />
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-accent hover:text-accent-foreground">
            <Link href="/jeu">
                Lancer le jeu
                <ArrowRight className="ml-2 h-4 w-4"/>
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
