
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide." }),
  message: z
    .string()
    .min(10, { message: "Le message doit contenir au moins 10 caractères." })
    .max(500, { message: "Le message ne doit pas dépasser 500 caractères." }),
});

export function ContactCard({ className, showLink }: { className?: string, showLink?: boolean }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await submitContactForm(values);
    if (result.success) {
      toast({
        title: "Message envoyé !",
        description: "Merci pour votre message ! Nous vous répondrons bientôt.",
      });
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Oh non ! Quelque chose s'est mal passé.",
        description: "Veuillez réessayer plus tard.",
      });
    }
  }
  
  if (showLink) {
    return (
       <Card className={cn("flex flex-col", className)}>
        <CardHeader>
            <CardTitle className="text-4xl flex items-center gap-2">
                <Mail className="w-8 h-8 text-accent" />
                Contact
            </CardTitle>
             <CardDescription className="text-xl">Une question ? Un projet ?</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
             <p className="text-muted-foreground mb-4 text-xl">
                Que ce soit pour une simple réservation de char à voile, l'organisation d'un séminaire d'entreprise ou une demande de devis personnalisé, notre équipe est à votre écoute à Denneville-Plage.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-accent hover:text-accent-foreground">
                <Link href="/contact">
                    Contactez-nous
                </Link>
            </Button>
        </CardContent>
    </Card>
    )
  }


  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-4xl flex items-center gap-2">
          <Mail className="w-8 h-8 text-accent" />
          Envoyez-nous un message
        </CardTitle>
        <CardDescription className="text-xl">
          Remplissez le formulaire et nous vous répondrons rapidement.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-grow flex flex-col">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre Nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="votre.email@exemple.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow flex flex-col">
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Posez-nous n'importe quelle question..."
                      className="resize-none flex-grow"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-accent hover:text-accent-foreground" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
