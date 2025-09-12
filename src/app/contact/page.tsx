import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export default async function ContactPage({ searchParams }: { searchParams: { success?: string } }) {
  const success = (await searchParams)?.success === "true";

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
                            src="https://maps.google.com/maps?q=Denneville-Plage,50580&t=&z=15&ie=UTF8&iwloc=&output=embed"
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
                      <ContactForm showLink={true} />
                    </CardContent>
                 </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
