import { Header } from "@/components/header";

export default function StatusPage() {
  const configStatus = {
    supabase: {
      url: process.env.SUPABASE_URL ? '✅ Configuré' : '❌ Manquant',
      key: process.env.SUPABASE_ANON_KEY ? '✅ Configuré' : '❌ Manquant',
      valid: process.env.SUPABASE_URL &&
             process.env.SUPABASE_ANON_KEY &&
             !process.env.SUPABASE_URL.includes('your-project-id') &&
             !process.env.SUPABASE_ANON_KEY.includes('your-anon-key') ? '✅ Valide' : '❌ Invalide'
    },
    email: {
      web3forms: process.env.WEB3FORMS_ACCESS_KEY ? '✅ Configuré' : '❌ Non configuré',
      smtp: process.env.SMTP_HOST && process.env.SMTP_USER ? '✅ Configuré' : '❌ Non configuré',
      netlifyForms: process.env.NEXT_PUBLIC_USE_NETLIFY_FORMS ? '✅ Activé' : '❌ Désactivé'
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🔍 Diagnostic du Site</h1>
            <p className="text-muted-foreground">
              État de la configuration et diagnostic des problèmes
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Configuration Supabase */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">🗄️ Base de données Supabase</h2>
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span>URL du projet:</span>
                  <span className="font-mono text-sm">{configStatus.supabase.url}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Clé d'accès:</span>
                  <span className="font-mono text-sm">{configStatus.supabase.key}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Configuration:</span>
                  <span className="font-mono text-sm">{configStatus.supabase.valid}</span>
                </div>
              </div>

              {!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('your-project-id') ? (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <h3 className="font-semibold text-destructive mb-2">⚠️ Configuration manquante</h3>
                  <p className="text-sm mb-3">
                    Votre configuration Supabase n'est pas complète. Les réservations et l'administration ne fonctionneront pas.
                  </p>
                  <div className="text-xs space-y-1">
                    <p>1. Allez sur <a href="https://supabase.com" className="text-primary underline" target="_blank">supabase.com</a></p>
                    <p>2. Créez un compte gratuit</p>
                    <p>3. Créez un nouveau projet</p>
                    <p>4. Allez dans Settings → API</p>
                    <p>5. Copiez l'URL et la clé anon</p>
                    <p>6. Remplacez les valeurs dans votre fichier .env</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h3 className="font-semibold text-green-600 mb-2">✅ Configuration valide</h3>
                  <p className="text-sm">Votre base de données Supabase est correctement configurée !</p>
                </div>
              )}
            </div>

            {/* Configuration Email */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">📧 Formulaires de contact</h2>
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Web3Forms:</span>
                  <span className="font-mono text-sm">{configStatus.email.web3forms}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>SMTP Gmail:</span>
                  <span className="font-mono text-sm">{configStatus.email.smtp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Netlify Forms:</span>
                  <span className="font-mono text-sm">{configStatus.email.netlifyForms}</span>
                </div>
              </div>

              {!process.env.WEB3FORMS_ACCESS_KEY && !process.env.SMTP_HOST && !process.env.NEXT_PUBLIC_USE_NETLIFY_FORMS ? (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h3 className="font-semibold text-yellow-600 mb-2">⚠️ Aucun service email configuré</h3>
                  <p className="text-sm mb-3">
                    Les formulaires de contact fonctionneront en mode dégradé (logging uniquement).
                  </p>
                  <div className="text-xs space-y-1">
                    <p>Recommandé: Configurez Web3Forms (gratuit, simple)</p>
                    <p>Alternative: Utilisez Netlify Forms</p>
                    <p>Voir le guide dans FORMULARIO_CONTACTO.md</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h3 className="font-semibold text-green-600 mb-2">✅ Service email configuré</h3>
                  <p className="text-sm">Les formulaires de contact sont opérationnels !</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions recommandées */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">🛠️ Actions recommandées</h2>

            {(!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('your-project-id')) && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h3 className="font-semibold text-blue-600 mb-2">🔧 Priorité 1: Configurer Supabase</h3>
                <p className="text-sm mb-2">Sans Supabase, les réservations et l'administration ne fonctionneront pas.</p>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  className="inline-flex items-center px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Créer un compte Supabase →
                </a>
              </div>
            )}

            {!process.env.WEB3FORMS_ACCESS_KEY && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">💡 Priorité 2: Configurer les emails</h3>
                <p className="text-sm mb-2">Pour recevoir les messages de contact, configurez un service email.</p>
                <a
                  href="https://web3forms.com"
                  target="_blank"
                  className="inline-flex items-center px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Configurer Web3Forms →
                </a>
              </div>
            )}
          </div>

          {/* Informations système */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">ℹ️ Informations système</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl mb-2">🌐</div>
                <div className="text-sm font-medium">Environnement</div>
                <div className="text-xs text-muted-foreground">{process.env.NODE_ENV || 'development'}</div>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-medium">Next.js</div>
                <div className="text-xs text-muted-foreground">v15.3.3</div>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl mb-2">🗄️</div>
                <div className="text-sm font-medium">Base de données</div>
                <div className="text-xs text-muted-foreground">Supabase</div>
              </div>
            </div>
          </div>

          <div className="text-center pt-8">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Retour à l'accueil
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}