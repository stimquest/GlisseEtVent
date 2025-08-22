
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
import { Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AboutCard({ className }: { className?: string }) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-4xl flex items-center gap-2">
          <Users className="w-8 h-8 text-accent" />
          L'Équipe
        </CardTitle>
        <CardDescription className="text-xl">Notre école, notre passion, nos moniteurs.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-xl">Découvrez l'histoire de Glisse et Vent et rencontrez Julien et Claire, nos moniteurs passionnés qui vous accompagneront dans votre aventure.</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-accent hover:text-accent-foreground">
            <Link href="/a-propos">
                En savoir plus sur nous
                <ArrowRight className="ml-2 h-4 w-4"/>
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
