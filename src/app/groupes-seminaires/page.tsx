
"use client";

import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Users, Building, Send } from "lucide-react";

const quoteSchema = z.object({
  name: z.string().min(2, { message: "Le nom est requis." }),
  company: z.string().optional(),
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide." }),
  phone: z.string().optional(),
  participants: z.coerce.number().min(1, { message: "Veuillez indiquer le nombre de participants." }),
  project: z.string().min(10, { message: "Veuillez décrire votre projet (10 caractères min)." }),
});


export default function GroupsPage() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof quoteSchema>>({
        resolver: zodResolver(quoteSchema),
        defaultValues: {
            name: "",
            company: "",
            email: "",
            phone: "",
            participants: 10,
            project: "",
        },
    });

    async function onSubmit(values: z.infer<typeof quoteSchema>) {
        console.log("Nouvelle demande de devis:", values);
        toast({
            title: "Demande de devis envoyée !",
            description: "Merci ! Nous vous recontacterons très prochainement avec une proposition sur mesure.",
        });
        form.reset();
    }


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl md:text-5xl flex items-center justify-center gap-3">
              <Users className="w-10 h-10 text-accent" />
              Activité Char à Voile pour Groupes & Séminaires
            </CardTitle>
            <CardDescription className="text-2xl">
                Renforcez la cohésion de vos équipes avec une expérience inoubliable sur la côte normande.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-8 items-center">
             <div className="md:w-1/2 h-64 md:h-96 relative rounded-lg overflow-hidden">
              <Image src="/img/image2.jpeg" alt="Groupe faisant du char à voile" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" data-ai-hint="team building" />
            </div>
            <div className="md:w-1/2 space-y-4">
              <p className="text-2xl font-semibold">
                À la recherche d'une idée originale pour votre prochain événement d'entreprise, séminaire, ou sortie de groupe (EVG, EVJF) ?
              </p>
              <p className="text-xl">
                Glisse et Vent vous propose des formules sur mesure pour faire vivre à vos collaborateurs ou amis un moment fort en émotions et en partage. Le char à voile est l'activité idéale pour :
              </p>
              <ul className="list-disc list-inside space-y-2 text-xl">
                <li><span className="font-semibold">Fédérer vos équipes (Team Building)</span> : challenge, entraide et communication sont au cœur de l'activité.</li>
                <li><span className="font-semibold">Marquer les esprits</span> : offrez un grand bol d'air et des souvenirs impérissables.</li>
                <li><span className="font-semibold">S'adapter à tous</span> : accessible à tous, sportifs ou non, pour un succès garanti.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-4xl flex items-center gap-3">
                    <Building className="w-8 h-8 text-accent" />
                    Demandez votre devis personnalisé
                </CardTitle>
                <CardDescription className="text-xl">Remplissez ce formulaire et nous créerons une offre adaptée à votre projet et à votre budget.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Votre Nom</FormLabel><FormControl><Input placeholder="Jean Dupont" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="company" render={({ field }) => (
                                <FormItem><FormLabel>Entreprise / Groupe (optionnel)</FormLabel><FormControl><Input placeholder="Nom du groupe" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="votre.email@exemple.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Téléphone (optionnel)</FormLabel><FormControl><Input type="tel" placeholder="06 12 34 56 78" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="participants" render={({ field }) => (
                                <FormItem><FormLabel>Nombre de participants</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="project" render={({ field }) => (
                            <FormItem><FormLabel>Description de votre projet</FormLabel><FormControl><Textarea placeholder="Date souhaitée, objectifs, demandes particulières..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="text-right">
                            <Button type="submit" size="lg" className="bg-primary hover:bg-accent hover:text-accent-foreground" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Envoi en cours..." : <><Send className="mr-2 h-5 w-5" /> Envoyer ma demande</>}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
