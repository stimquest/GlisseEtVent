import { Header } from "@/components/header";
import Link from "next/link";

export default function RGPDPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Politique de Confidentialité</h1>
            <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Chez Glisse et Vent, nous nous engageons à protéger votre vie privée et vos données personnelles.
                Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations
                lorsque vous utilisez notre site web et nos services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Données collectées</h2>
              <h3 className="text-lg font-medium mb-2">2.1 Données fournies volontairement</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Informations relatives aux réservations (dates, créneaux, nombre de chars)</li>
              </ul>

              <h3 className="text-lg font-medium mb-2">2.2 Données collectées automatiquement</h3>
              <ul className="list-disc pl-6">
                <li>Adresse IP</li>
                <li>Type de navigateur et version</li>
                <li>Pages visitées et durée de consultation</li>
                <li>Données de navigation (cookies)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Utilisation des données</h2>
              <p>Nous utilisons vos données personnelles pour :</p>
              <ul className="list-disc pl-6">
                <li>Gérer vos réservations de cours de char à voile</li>
                <li>Vous contacter concernant vos réservations</li>
                <li>Améliorer nos services et notre site web</li>
                <li>Répondre à vos questions et demandes</li>
                <li>Vous envoyer des informations sur nos activités (avec votre consentement)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Partage des données</h2>
              <p>
                Nous ne vendons, n'échangeons ni ne louons vos données personnelles à des tiers.
                Vos données ne sont partagées qu'avec :
              </p>
              <ul className="list-disc pl-6">
                <li>Notre équipe interne pour la gestion des réservations</li>
                <li>Les prestataires techniques nécessaires au fonctionnement du site</li>
                <li>Les autorités légales en cas d'obligation légale</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Cookies</h2>
              <p>
                Notre site utilise des cookies essentiels pour son fonctionnement. Ces cookies sont nécessaires
                pour la navigation sur le site et la gestion de vos réservations. Vous pouvez contrôler l'utilisation
                des cookies via les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Sécurité des données</h2>
              <p>
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles
                contre tout accès, modification, divulgation ou destruction non autorisée.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Durée de conservation</h2>
              <p>
                Vos données personnelles sont conservées uniquement le temps nécessaire aux finalités pour lesquelles
                elles ont été collectées, et en conformité avec la législation applicable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Vos droits</h2>
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc pl-6">
                <li><strong>Droit d'accès</strong> : connaître les données vous concernant</li>
                <li><strong>Droit de rectification</strong> : faire corriger vos données inexactes</li>
                <li><strong>Droit d'effacement</strong> : faire supprimer vos données</li>
                <li><strong>Droit à la portabilité</strong> : récupérer vos données dans un format lisible</li>
                <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
              <p>
                Pour exercer vos droits ou pour toute question concernant cette politique de confidentialité,
                vous pouvez nous contacter :
              </p>
              <ul className="list-none pl-0 mt-4">
                <li>Email : contact@glisse-et-vent.fr</li>
                <li>Adresse : Plage de Denneville, 50580 Denneville, France</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Modifications</h2>
              <p>
                Cette politique de confidentialité peut être modifiée à tout moment. Les modifications seront
                publiées sur cette page avec une date de mise à jour.
              </p>
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