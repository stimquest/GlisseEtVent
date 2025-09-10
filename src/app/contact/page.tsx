import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage({ searchParams }: { searchParams?: { success?: string } }) {
  const success = searchParams?.success === "true";

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
                      {/* Netlify Forms configuration: minimal form markup */}
                      <form
                        name="contact"
                        method="POST"
                        data-netlify="true"
                        action="/contact?success=true"
                        className="space-y-4"
                      >
                        <input type="hidden" name="form-name" value="contact" />

                        <p>
                          <label className="block text-sm font-medium">Nom
                            <input
                              type="text"
                              name="name"
                              className="mt-1 block w-full rounded-md border bg-input p-2 text-foreground"
                              required
                            />
                          </label>
                        </p>

                        <p>
                          <label className="block text-sm font-medium">Email
                            <input
                              type="email"
                              name="email"
                              className="mt-1 block w-full rounded-md border bg-input p-2 text-foreground"
                              required
                            />
                          </label>
                        </p>

                        <p>
                          <label className="block text-sm font-medium">Message
                            <textarea
                              name="message"
                              className="mt-1 block w-full rounded-md border bg-input p-2 text-foreground"
                              rows={6}
                              required
                            />
                          </label>
                        </p>

                        <p>
                          <button
                            type="submit"
                            className="inline-flex items-center rounded bg-accent px-4 py-2 text-white"
                          >
                            Envoyer
                          </button>
                        </p>
                      </form>
                    </CardContent>
                 </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
