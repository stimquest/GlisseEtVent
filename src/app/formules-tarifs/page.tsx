
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingCart, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";

const formulas = [
  {
    title: "Séance Initiation",
    duration: "2 heures",
    target: "À partir de 8 ans",
    price: "35€",
    priceDetail: "par personne",
    description: "Découvrez les bases du char à voile et ressentez vos premières sensations de glisse en toute sécurité avec un moniteur.",
    features: ["Idéal pour les débutants", "Encadrement professionnel", "Plaisir garanti"]
  },
  {
    title: "Char à Voile Double",
    duration: "2 heures",
    target: "Pour 2 personnes",
    price: "50€",
    priceDetail: "pour le char",
    description: "Partagez l'expérience à deux ! Parfait pour un parent avec un enfant ou pour une balade en duo.",
    features: ["1 seul char biplace disponible", "Expérience conviviale", "Sensations partagées"]
  }
];

const equipment = {
  provided: [
    { name: "Casque", icon: ShieldCheck }
  ],
  required: [
    { name: "Chaussures fermées", icon: UserCheck },
    { name: "Gants (conseillés)", icon: UserCheck }
  ]
};

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 space-y-8">
        <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl">Nos Formules et Tarifs</h1>
            <p className="text-2xl text-muted-foreground mt-2">Simplicité et transparence pour une aventure inoubliable.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {formulas.map(formula => (
            <Card key={formula.title} className="flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">{formula.title}</CardTitle>
                <p className="text-accent text-5xl font-bold">{formula.price}</p>
                <CardDescription className="text-xl">{formula.priceDetail} / {formula.duration}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <p className="text-center text-muted-foreground text-xl min-h-[80px]">{formula.description}</p>
                <p className="text-center font-semibold text-lg">{formula.target}</p>
                <ul className="space-y-2 text-xl">
                    {formula.features.map(feature => (
                        <li key={feature} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-accent hover:text-accent-foreground">
                    <Link href="/reservations">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Je réserve
                    </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-3xl text-center">Équipement</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6 text-center">
                <div>
                    <h3 className="text-2xl font-semibold mb-2">Fourni par le club</h3>
                    <ul className="space-y-2 text-xl">
                        {equipment.provided.map(item => (
                            <li key={item.name} className="flex items-center justify-center gap-2">
                                <item.icon className="w-6 h-6 text-primary"/>
                                <span>{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="text-2xl font-semibold mb-2">À prévoir par vos soins</h3>
                     <ul className="space-y-2 text-xl">
                        {equipment.required.map(item => (
                            <li key={item.name} className="flex items-center justify-center gap-2">
                                <item.icon className="w-6 h-6 text-primary"/>
                                <span>{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
