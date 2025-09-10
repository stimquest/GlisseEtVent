"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactFormProps {
  showLink?: boolean;
}

export function ContactForm({ showLink = false }: ContactFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Contactez-nous</h2>
        <p className="text-muted-foreground">
          Une question ? N'hésitez pas à nous contacter !
        </p>
      </div>

      <form
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        action="/contact?success=true"
        className="space-y-4"
      >
        {/* Hidden input required by Netlify to identify the form */}
        <input type="hidden" name="form-name" value="contact" />
        {/* Honeypot field (invisible for users) */}
        <p className="hidden">
          <label>
            Ne pas remplir: <input name="bot-field" />
          </label>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
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
            placeholder="Votre message..."
            rows={5}
          />
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Envoyer le message
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