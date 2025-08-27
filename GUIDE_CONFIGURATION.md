# 🚀 Guide de Configuration - Résolution des Problèmes

## ❌ Problème Identifié

Votre site ne fonctionne pas car les variables d'environnement Supabase ne sont pas configurées avec vos vraies valeurs.

**Dans votre fichier `.env`, vous avez :**
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

Ces valeurs sont des **placeholders** et doivent être remplacées par vos vraies clés Supabase.

## ✅ Solution en 5 Minutes

### **Étape 1 : Créer un compte Supabase**

1. **Allez sur** [https://supabase.com](https://supabase.com)
2. **Créez un compte gratuit** (bouton "Start your project")
3. **Vérifiez votre email** et confirmez votre compte
4. **Cliquez sur** "New project"

### **Étape 2 : Configurer votre projet**

1. **Choisissez un nom** pour votre projet (ex: "glisse-et-vent")
2. **Sélectionnez une région** proche de vos utilisateurs (ex: "EU West (London)")
3. **Créez un mot de passe** pour votre base de données
4. **Cliquez sur** "Create new project"

### **Étape 3 : Récupérer vos clés API**

1. **Dans votre projet**, allez dans **Settings** (engrenage) → **API**
2. **Copiez ces deux valeurs :**
   - **Project URL** : `https://abcdefghijklmnop.supabase.co`
   - **anon/public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **Étape 4 : Configurer votre fichier .env**

**Ouvrez votre fichier `.env`** et remplacez :

```bash
# AVANT (❌ Ne fonctionne pas)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# APRÈS (✅ Fonctionne)
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Étape 5 : Tester la configuration**

1. **Redémarrez votre serveur de développement :**
   ```bash
   npm run dev
   ```

2. **Allez sur** `http://localhost:3000/status` pour vérifier que tout fonctionne

3. **Si vous utilisez Netlify**, mettez à jour les variables dans votre dashboard :
   - **Site Settings** → **Environment Variables**
   - Ajoutez/modifiez `SUPABASE_URL` et `SUPABASE_ANON_KEY`
   - **Cochez "Secret"** pour ces deux variables

## 🔍 Diagnostic Automatique

J'ai créé une page de diagnostic automatique : **`/status`**

Elle vous indique exactement :
- ✅ Si Supabase est configuré correctement
- ✅ Si les emails fonctionnent
- ✅ Quelles actions vous devez effectuer

**Allez sur `http://localhost:3000/status`** pour voir l'état de votre configuration.

## 📧 Configuration des Emails (Optionnel)

Pour recevoir les messages de contact, configurez l'une de ces options :

### **Option A : Web3Forms (Recommandé - Gratuit)**

1. **Allez sur** [https://web3forms.com](https://web3forms.com)
2. **Créez un compte gratuit**
3. **Récupérez votre clé d'accès**
4. **Ajoutez dans votre `.env` :**
   ```bash
   WEB3FORMS_ACCESS_KEY=votre-clé-ici
   ```

### **Option B : Netlify Forms (Intégré)**

1. **Dans votre dashboard Netlify**
2. **Site Settings** → **Forms**
3. **Activez les forms**
4. **Ajoutez dans votre `.env` :**
   ```bash
   NEXT_PUBLIC_USE_NETLIFY_FORMS=true
   ```

## 🚦 États Possibles

### **✅ Configuration Valide**
- Votre site fonctionne parfaitement
- Les réservations marchent
- L'administration est accessible

### **⚠️ Configuration Incomplète**
- Certaines fonctionnalités ne marchent pas
- La page `/status` vous indique quoi faire

### **❌ Configuration Manquante**
- Rien ne fonctionne
- Erreurs dans la console
- Suivez ce guide pour résoudre

## 🆘 Support

Si vous êtes bloqué :

1. **Vérifiez la page `/status`** - elle vous guide
2. **Consultez les logs** de votre terminal/console
3. **Vérifiez que vos clés Supabase** sont correctes
4. **Redémarrez votre serveur** après les modifications

## 📋 Checklist Final

- [ ] Compte Supabase créé
- [ ] Projet Supabase configuré
- [ ] Clés API copiées
- [ ] Fichier `.env` mis à jour
- [ ] Serveur redémarré
- [ ] Page `/status` vérifiée
- [ ] Variables Netlify mises à jour (si applicable)
- [ ] Emails configurés (optionnel)

**Votre site sera opérationnel en moins de 5 minutes ! 🚀**

---

**Note :** Cette configuration est **100% sécurisée** car les clés sont côté serveur uniquement.