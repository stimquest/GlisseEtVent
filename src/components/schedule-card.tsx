
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
import { CalendarCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScheduleCard({ className }: { className?: string }) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-4xl flex items-center gap-2">
          <CalendarCheck className="w-8 h-8 text-accent" />
          Réserver votre créneau
        </CardTitle>
        <CardDescription className="text-xl">
          Consultez nos disponibilités et réservez votre aventure en ligne.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-xl">
            Prêt à prendre le vent ? Sélectionnez le créneau qui vous convient et remplissez notre formulaire de réservation en quelques clics. Votre char à voile vous attend !
        </p>
      </CardContent>
       <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-accent hover:text-accent-foreground">
            <Link href="/reservations">
                Voir les disponibilités
                <ArrowRight className="ml-2 h-4 w-4"/>
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
