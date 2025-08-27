# 🚀 Déploiement sur Netlify - Guide de sécurisation

## ❌ Problème actuel

Netlify détecte automatiquement les variables d'environnement `NEXT_PUBLIC_*` comme des secrets et bloque le déploiement car elles sont exposées dans le code client.

**Erreur rencontrée :**
```
Secrets scanning found secrets in build output or repo code
Secret env var "NEXT_PUBLIC_SUPABASE_URL" detected
Secret env var "NEXT_PUBLIC_SUPABASE_ANON_KEY" detected
```

## ✅ Solution implémentée

### 1. **Variables d'environnement côté serveur uniquement**

**Avant (problématique) :**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Après (sécurisé) :**
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. **Configuration dans Netlify**

#### Étapes à suivre dans votre dashboard Netlify :

1. **Accédez aux variables d'environnement :**
   - Allez dans votre projet Netlify
   - **Site Settings** > **Environment Variables**

2. **Supprimez les anciennes variables :**
   - Supprimez `NEXT_PUBLIC_SUPABASE_URL`
   - Supprimez `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Ajoutez les nouvelles variables sécurisées :**
   ```
   Nom: SUPABASE_URL
   Valeur: https://your-project-id.supabase.co
   Type: Secret (cochez la case)
   ```

   ```
   Nom: SUPABASE_ANON_KEY
   Valeur: your-anon-key-here
   Type: Secret (cochez la case)
   ```

4. **Ajoutez les autres variables nécessaires :**
   ```
   Nom: SMTP_HOST
   Valeur: smtp.gmail.com
   Type: Secret
   ```

   ```
   Nom: SMTP_PORT
   Valeur: 587
   Type: Secret
   ```

   ```
   Nom: SMTP_USER
   Valeur: votre-email@gmail.com
   Type: Secret
   ```

   ```
   Nom: SMTP_PASS
   Valeur: votre-mot-de-passe-application
   Type: Secret
   ```

   ```
   Nom: CONTACT_EMAIL
   Valeur: votre-email@gmail.com
   Type: Secret
   ```

## 🔒 Avantages de cette approche

- ✅ **Sécurité maximale** : Les clés ne sont plus exposées côté client
- ✅ **Conformité Netlify** : Plus de détection de secrets
- ✅ **Performance** : Build plus rapide sans analyse de sécurité
- ✅ **Maintenance** : Plus besoin de gérer des variables publiques sensibles

## 🚀 Redéploiement

Après avoir configuré les variables dans Netlify :

1. **Poussez vos changements** sur Git
2. **Netlify détectera automatiquement** les nouveaux commits
3. **Le build devrait réussir** sans erreurs de sécurité
4. **Votre site sera opérationnel** avec la nouvelle configuration sécurisée

## 📋 Checklist de vérification

- [ ] Anciennes variables `NEXT_PUBLIC_*` supprimées
- [ ] Nouvelles variables `SUPABASE_*` ajoutées en mode "Secret"
- [ ] Variables SMTP configurées
- [ ] Build Netlify réussi
- [ ] Fonctionnalités testées :
  - [ ] Réservations fonctionnelles
  - [ ] Dashboard admin accessible
  - [ ] Formulaire de contact opérationnel

## 🆘 Dépannage

### Si le build échoue encore :

1. **Vérifiez les noms des variables** : Elles doivent être exactement `SUPABASE_URL` et `SUPABASE_ANON_KEY`
2. **Mode "Secret"** : Assurez-vous que la case "Secret" est cochée
3. **Redémarrage du build** : Forcez un nouveau build depuis l'interface Netlify
4. **Cache** : Netlify peut garder en cache l'ancienne configuration

### Variables non sensibles (peuvent rester publiques) :

Ces variables peuvent garder le préfixe `NEXT_PUBLIC_` car elles ne contiennent pas d'informations sensibles :

- `NEXT_PUBLIC_WEATHERAPI_KEY` (clé API météo)
- Toute autre variable non sensible

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de build Netlify
2. Comparez avec le fichier `.env.example`
3. Testez localement avec `npm run dev`