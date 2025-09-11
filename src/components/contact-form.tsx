"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ContactFormProps {
  showLink?: boolean;
}

export function ContactForm({ showLink = false }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Merci de remplir tous les champs.",
      });
      return;
    }

    const accessKey =
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";
    if (!accessKey) {
      toast({
        variant: "destructive",
        title: "Erreur de configuration",
        description:
          "La clé Web3Forms (NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY) n'est pas définie.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        access_key: accessKey,
        subject: "Nouveau message depuis le site",
        name: formData.name,
        email: formData.email,
        message: formData.message,
      };

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        toast({
          title: "Message envoyé !",
          description: "Merci — nous vous répondrons bientôt.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: json?.message || "Échec de l'envoi.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur réseau s'est produite.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Contactez-nous</h2>
        <p className="text-muted-foreground">
          Une question ? N'hésitez pas à nous contacter !
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Votre nom"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="votre.email@exemple.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            name="message"
            required
            placeholder="Votre message..."
            rows={5}
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
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