"use client";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Vérifie l'URL pour afficher le message de succès après redirection Netlify
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setStatus("success");
      // Optionnel: nettoyer les champs après redirection
      setName("");
      setEmail("");
      setMessage("");
      // Nettoyer l'URL (facultatif)
      if (window.history && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.delete("success");
        window.history.replaceState({}, document.title, url.toString());
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-4xl flex items-center gap-3">
                            <MapPin className="w-8 h-8 text-accent" />
                            Contact & Accès
                        </CardTitle>
                        <CardDescription className="text-xl">Le point de rendez-vous se situe devant le bar Le Gravelot, où nos moniteurs vous accueilleront avant chaque séance.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-lg">
                        <div className="flex items-center gap-4">
                            <MapPin className="w-6 h-6 text-accent shrink-0"/>
                            <span>1 Av. de Jersey, 50580 Port-Bail-sur-Mer</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone className="w-6 h-6 text-accent shrink-0"/>
                            <a href="tel:+33629137852" className="hover:text-accent">06 29 13 78 52</a>
                        </div>
                        {/*  <div className="flex items-center gap-4">
                            <Mail className="w-6 h-6 text-accent shrink-0"/>
                            <a href="mailto:contact@glisseetvent.com" className="hover:text-accent">contact@glisseetvent.com</a>
                        </div> */}
                    </CardContent>
                </Card>
                 <Card className="aspect-[16/9]">
                    <CardContent className="p-0 h-full">
                         <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2607.243423374898!2d-1.7719688846278856!3d49.20091877932236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x480c5f7d1e1f2a3b%3A0x1b7b7b1b3b1b7b7b!2sDenneville-Plage%2C%2050580%20Denneville!5e0!3m2!1sfr!2sfr!4v1622540000000!5m2!1sfr!2sfr" 
                            width="100%" 
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Carte de Denneville-Plage">
                        </iframe>
                    </CardContent>
                </Card>
            </div>
            <div className="min-h-[500px]">
                 <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">Contactez-nous</CardTitle>
                      <CardDescription>Envoyez-nous un message, nous vous répondrons rapidement.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Netlify Forms configuration: name, method=POST, data-netlify, honeypot, hidden form-name */}
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

                        <div>
                          <label className="block text-sm font-medium">Nom</label>
                          <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border bg-input p-2 text-foreground"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border bg-input p-2 text-foreground"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Message</label>
                          <textarea
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-1 block w-full rounded-md border bg-input p-2 text-foreground"
                            rows={6}
                            required
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            type="submit"
                            className="inline-flex items-center rounded bg-accent px-4 py-2 text-white"
                          >
                            Envoyer
                          </button>
                          {status === "success" && <span className="text-green-500">Message envoyé — merci !</span>}
                          {status === "error" && <span className="text-red-500">Erreur lors de l'envoi. Vérifiez les champs et réessayez.</span>}
                        </div>
                      </form>
                    </CardContent>
                 </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
