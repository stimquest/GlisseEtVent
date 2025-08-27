"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/app/actions";

interface ContactFormProps {
  showLink?: boolean;
}

export function ContactForm({ showLink = false }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  // Version Web3Forms/Netlify Forms hybride
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        toast({
          title: "Message envoyé !",
          description: result.message,
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Version alternative avec Netlify Forms (si activé)
  const handleNetlifySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      });

      if (response.ok) {
        toast({
          title: "Message envoyé !",
          description: "Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Utilise Web3Forms par défaut, Netlify Forms si la variable est définie
  const useNetlifyForms = process.env.NEXT_PUBLIC_USE_NETLIFY_FORMS === 'true';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Contactez-nous</h2>
        <p className="text-muted-foreground">
          Une question ? N'hésitez pas à nous contacter !
        </p>
      </div>

      <form
        onSubmit={useNetlifyForms ? handleNetlifySubmit : handleSubmit}
        className="space-y-4"
        {...(useNetlifyForms && {
          name: "contact",
          method: "POST",
          "data-netlify": "true",
          "data-netlify-honeypot": "bot-field"
        })}
      >
        {/* Champ honeypot pour Netlify Forms */}
        {useNetlifyForms && (
          <input type="hidden" name="form-name" value="contact" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Votre nom"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="votre.email@exemple.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Votre message..."
            rows={5}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
        </Button>
      </form>

      {showLink && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          Vous pouvez aussi nous contacter directement par email à{" "}
          <a
            href="mailto:contact@glisse-et-vent.fr"
            className="text-primary hover:underline"
          >
            contact@glisse-et-vent.fr
          </a>
        </p>
      )}
    </div>
  );
}