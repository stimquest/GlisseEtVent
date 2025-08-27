import { Header } from "@/components/header";
import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Mentions Légales</h1>
            <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Informations générales</h2>
              <div className="space-y-2">
                <p><strong>Nom de l'entreprise :</strong> Glisse et Vent</p>
                <p><strong>Statut juridique :</strong> [À compléter selon votre structure]</p>
                <p><strong>Adresse :</strong> Plage de Denneville, 50580 Denneville, France</p>
                <p><strong>Email :</strong> contact@glisse-et-vent.fr</p>
                <p><strong>Téléphone :</strong> [Votre numéro de téléphone]</p>
                <p><strong>Directeur de la publication :</strong> [Nom du responsable]</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Hébergement du site</h2>
              <div className="space-y-2">
                <p><strong>Hébergeur :</strong> Netlify, Inc.</p>
                <p><strong>Adresse :</strong> 2325 3rd Street, Suite 215, San Francisco, CA 94107, États-Unis</p>
                <p><strong>Site web :</strong> <a href="https://www.netlify.com" className="text-primary hover:underline">www.netlify.com</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Propriété intellectuelle</h2>
              <p>
                Le contenu de ce site web (textes, images, logos, graphismes, etc.) est protégé par le droit d'auteur.
                Toute reproduction, distribution, modification ou exploitation commerciale sans autorisation préalable
                est strictement interdite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Responsabilité</h2>
              <p>
                Glisse et Vent s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site,
                mais ne peut garantir l'absence d'erreurs ou d'omissions. L'utilisation des informations et services
                disponibles sur ce site se fait sous l'entière responsabilité de l'utilisateur.
              </p>
              <p>
                Glisse et Vent ne pourra être tenu responsable des dommages directs ou indirects résultant de
                l'utilisation de ce site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Liens externes</h2>
              <p>
                Ce site peut contenir des liens vers d'autres sites web. Glisse et Vent n'exerce aucun contrôle sur
                ces sites externes et décline toute responsabilité quant à leur contenu ou à leur politique de confidentialité.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Droit applicable</h2>
              <p>
                Ces mentions légales sont régies par le droit français. En cas de litige, les tribunaux français
                seront seuls compétents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
              <p>
                Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
              </p>
              <ul className="list-none pl-0 mt-4">
                <li>Email : contact@glisse-et-vent.fr</li>
                <li>Adresse : Plage de Denneville, 50580 Denneville, France</li>
              </ul>
            </section>
          </div>

          <div className="text-center pt-8">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>

      <footer className="mt-16 py-6 border-t border-border/50 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="text-center md:text-left">
              <p>&copy; 2024 Glisse et Vent - École de Char à Voile</p>
              <p className="text-xs mt-1">Tous droits réservés</p>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <Link href="/rgpd" className="hover:text-foreground transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/mentions-legales" className="hover:text-foreground transition-colors">
                Mentions légales
              </Link>
              <a
                href="/admin"
                className="text-muted-foreground/60 hover:text-muted-foreground transition-colors opacity-60"
                title="Administration"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}