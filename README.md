
# Glisse et Vent - École de Char à Voile

Site web pour l'école de char à voile de Denneville-Plage, Normandie.

## 🚀 Fonctionnalités

- **Page d'accueil** avec présentation de l'école
- **Système de réservation** de créneaux
- **Dashboard administrateur** complet
- **Gestion des créneaux** et réservations
- **Formulaire de contact** multi-options (Web3Forms, Netlify Forms, SMTP)
- **Pages légales** : RGPD et mentions légales
- **Footer professionnel** avec lien admin discret
- **Sécurité renforcée** : Variables d'environnement côté serveur

## 🔧 Configuration

### Variables d'environnement

Copiez le fichier `.env.example` vers `.env.local` et configurez les variables suivantes :

```bash
# Supabase (côté serveur - sécurisé)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Email SMTP (pour le formulaire de contact)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
CONTACT_EMAIL=votre-email@gmail.com

# Météo (optionnel)
WEATHERAPI_KEY=votre-cle-weatherapi
OPENWEATHERMAP_API_KEY=votre-cle-openweathermap
```

### Déploiement sur Netlify

1. **Variables d'environnement dans Netlify** :
   - Allez dans votre dashboard Netlify
   - Site Settings > Environment Variables
   - Ajoutez toutes les variables du `.env.example`
   - Marquez `SUPABASE_URL` et `SUPABASE_ANON_KEY` comme "secret"

2. **Configuration du build** :
   - Build command : `npm run build`
   - Publish directory : `.next`

## 🔒 Sécurité

- **Variables d'environnement côté serveur** uniquement
- **Pas de NEXT_PUBLIC_* pour les données sensibles**
- **Authentification admin** avec mot de passe
- **Lien admin discret** dans le footer

## 📧 Configuration des Formulaires de Contact

Votre site propose **3 solutions sécurisées** pour les formulaires de contact :

### **Option 1 : Web3Forms (RECOMMANDÉ)** ⭐
- ✅ **Sécurité maximale** : Pas de credentials exposés
- ✅ **RGPD compliant** : Gestion des données personnelles
- ✅ **Gratuit** : 250 emails/mois
- ✅ **Simple** : Configuration en 2 minutes

**Configuration :**
1. Créez un compte sur [https://web3forms.com/](https://web3forms.com/)
2. Ajoutez votre clé dans Netlify :
   ```
   Nom: WEB3FORMS_ACCESS_KEY
   Valeur: votre-clé-ici
   Type: Secret
   ```

### **Option 2 : Netlify Forms (Intégré)**
- ✅ **Parfaitement intégré** à Netlify
- ✅ **Analytics intégrés**
- ✅ **Aucune configuration externe**

**Configuration :**
```
Nom: NEXT_PUBLIC_USE_NETLIFY_FORMS
Valeur: true
Type: Public
```

### **Option 3 : SMTP Gmail (Classique)**
- ✅ **Contrôle total**
- ✅ **Personnalisation avancée**
- ⚠️ **Configuration plus complexe**

**Configuration :**
```
Nom: SMTP_HOST
Valeur: smtp.gmail.com
Type: Secret

Nom: SMTP_PORT
Valeur: 587
Type: Secret

Nom: SMTP_USER
Valeur: votre-email@gmail.com
Type: Secret

Nom: SMTP_PASS
Valeur: votre-mot-de-passe-application
Type: Secret

Nom: CONTACT_EMAIL
Valeur: votre-email@gmail.com
Type: Secret
```

**📖 Guide complet :** Consultez `FORMULARIO_CONTACTO.md` pour tous les détails.

## � Accès administrateur

- **URL** : `/admin`
- **Mot de passe** : `glisse123` (à changer en production)
- **Lien discret** : Disponible dans le footer de toutes les pages

## 🏃‍♂️ Démarrage rapide

```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run dev

# Build pour production
npm run build
```

## 📄 Pages disponibles

- `/` - Page d'accueil
- `/a-propos` - À propos de l'école
- `/formules-tarifs` - Tarifs et formules
- `/reservations` - Système de réservation
- `/contact` - Formulaire de contact
- `/blog` - Articles de blog
- `/rgpd` - Politique de confidentialité
- `/mentions-legales` - Mentions légales
- `/admin` - Interface d'administration
