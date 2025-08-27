# Sécurité des Variables d'Environnement sur Netlify

## ⚠️ Variables Dangereuses Détectées

Votre fichier `.env` contient des variables sensibles qui sont actuellement **visibles dans le navigateur** :

### Variables à Risque Élevé :
- `NEXT_PUBLIC_SUPABASE_URL` - URL de base de données (visible dans le code client)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé d'API publique Supabase (visible dans le code client)
- `NEXT_PUBLIC_WEATHERAPI_KEY` - Clé API météo (visible dans le code client)

## Comment Netlify Gère les Variables d'Environnement

### ✅ Sécurisé (Côté Serveur)
- Variables sans préfixe `NEXT_PUBLIC_` : Stockées chiffrées, accessibles seulement côté serveur
- Injectées lors du build, non visibles dans le code client
- Parfaites pour : mots de passe, clés API privées, tokens d'accès

### ❌ Non Sécurisé (Côté Client)
- Variables avec préfixe `NEXT_PUBLIC_` : Incluses dans le bundle JavaScript
- Visibles dans le code source du navigateur (F12 > Sources)
- Accessibles à tous les visiteurs du site

## Recommandations Immédiates

### 1. Déplacer les Variables Sensibles vers Netlify

#### Étape 1 : Accéder au Dashboard Netlify
1. Allez sur [netlify.com](https://netlify.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre site
4. Allez dans : **Site Settings** → **Build & Deploy** → **Environment**

#### Étape 2 : Ajouter les Variables
Ajoutez ces variables dans Netlify (sans `NEXT_PUBLIC_` pour les rendre sécurisées) :

```
SUPABASE_URL=https://jivxkppdtrewdvyjwmqo.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
WEATHERAPI_KEY=b75458565b494aceaa7135718250608
```

#### Étape 3 : Supprimer du fichier .env
Modifiez votre `.env` local :

```env
# Variables publiques (visibles côté client - OK pour l'URL seulement)
NEXT_PUBLIC_SUPABASE_URL=https://jivxkppdtrewdvyjwmqo.supabase.co

# Variables privées (maintenant dans Netlify - supprimées du .env local)
# SUPABASE_ANON_KEY=... # DÉPLACÉ VERS NETLIFY
# WEATHERAPI_KEY=...    # DÉPLACÉ VERS NETLIFY
```

### 2. Variables d'Email SMTP

Vos variables SMTP sont correctement configurées (sans `NEXT_PUBLIC_`), donc elles sont sécurisées.

## Vérification de Sécurité

### Comment Vérifier que vos Clés sont Sécurisées

1. **Inspecter le code source** :
   - Ouvrez votre site en production
   - Appuyez F12 → Onglet "Sources"
   - Cherchez votre clé API dans les fichiers JavaScript
   - Si vous la trouvez : ❌ DANGER - Visible par tous

2. **Utiliser des outils en ligne** :
   - Sites comme [haveibeenpwned.com](https://haveibeenpwned.com) pour vérifier si vos clés ont été compromises

## Meilleures Pratiques

### Variables Publiques (NEXT_PUBLIC_)
Utilisez UNIQUEMENT pour :
- URLs de services (comme l'URL Supabase)
- Configuration d'interface utilisateur
- Valeurs qui n'ont pas d'impact sécurité

### Variables Privées (sans NEXT_PUBLIC_)
Utilisez pour :
- Clés API
- Mots de passe
- Tokens d'authentification
- Clés secrètes

### Gestion des Environnements

#### Développement Local (.env)
```env
# Seulement les variables nécessaires pour le développement
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_dev
```

#### Production (Netlify Dashboard)
```
SUPABASE_ANON_KEY=votre_cle_production_securisee
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre.email@gmail.com
SMTP_PASS=votre_mot_de_passe_app
CONTACT_EMAIL=votre.email@gmail.com
```

## Actions Immédiates Recommandées

1. **URGENT** : Déplacez `SUPABASE_ANON_KEY` et `WEATHERAPI_KEY` vers Netlify
2. **URGENT** : Supprimez ces clés de votre fichier `.env`
3. **Rebuild** : Déclenchez un nouveau déploiement sur Netlify
4. **Vérifiez** : Confirmez que les clés ne sont plus visibles dans le code source

## Outils de Sécurité

- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)
- [Have I Been Pwned](https://haveibeenpwned.com) - Vérifier si vos clés ont été compromises
- [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## Questions Fréquentes

**Q: Puis-je garder quelques variables dans .env pour le développement ?**
R: Oui, mais seulement celles nécessaires au développement local. Les variables sensibles doivent être dans Netlify.

**Q: Que se passe-t-il si quelqu'un trouve ma clé API ?**
R: Changez immédiatement la clé, supprimez l'ancienne, et surveillez les utilisations suspectes.

**Q: Les variables dans Netlify sont-elles vraiment sécurisées ?**
R: Oui, elles sont chiffrées et ne sont visibles que lors du processus de build côté serveur.