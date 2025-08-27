# Configuration de l'envoi d'emails avec Resend

## Étape 1 : Créer un compte Resend

1. Allez sur [Resend.com](https://resend.com)
2. Créez un compte gratuit
3. Vérifiez votre adresse email

## Étape 2 : Obtenir votre clé API

1. Dans le dashboard Resend, allez dans "API Keys"
2. Cliquez sur "Create API Key"
3. Donnez un nom à votre clé (ex: "Site Glisse et Vent")
4. Copiez la clé API générée

## Étape 3 : Configurer les domaines d'email

1. Dans Resend, allez dans "Domains"
2. Ajoutez votre domaine (ex: `votredomaine.com`)
3. Suivez les instructions DNS pour vérifier votre domaine
4. Une fois vérifié, vous pourrez envoyer des emails depuis ce domaine

## Étape 4 : Mettre à jour les variables d'environnement

Modifiez le fichier `.env` avec vos informations réelles :

```env
# Resend Email Configuration
RESEND_API_KEY=re_1234567890abcdefghijklmnopqrstuvwxyz
CONTACT_EMAIL=contact@votredomaine.com  # Email où recevoir les messages
FROM_EMAIL=noreply@votredomaine.com     # Email d'envoi (doit être vérifié dans Resend)
```

## Étape 5 : Tester la configuration

1. Redémarrez le serveur de développement : `npm run dev`
2. Remplissez le formulaire de contact
3. Vérifiez que vous recevez bien les emails de confirmation

## Dépannage

### Erreurs courantes :
- **"Invalid API key"** : Vérifiez que la clé API est correcte
- **"Domain not verified"** : Vérifiez que votre domaine est bien configuré dans Resend
- **"Sender not authorized"** : L'email FROM doit être vérifié dans Resend

### Test en développement :
Pour tester sans configurer de domaine, vous pouvez utiliser :
- `RESEND_API_KEY` : Votre clé API Resend
- `CONTACT_EMAIL` : Votre email personnel
- `FROM_EMAIL` : `onboarding@resend.dev` (email de test Resend)

## Alternatives

Si Resend ne convient pas, vous pouvez utiliser d'autres services :

1. **Nodemailer avec SMTP** : Configuration plus complexe mais gratuite
2. **SendGrid** : Alternative populaire à Resend
3. **Amazon SES** : Solution économique pour gros volumes

## Sécurité

- Ne commitez jamais votre clé API Resend dans le code
- Utilisez toujours des variables d'environnement
- Restreignez les permissions de votre clé API au minimum nécessaire