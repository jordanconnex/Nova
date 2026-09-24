# Nova

## Arborescence

```text
.
+-- public/                 # Fichiers servis au navigateur
|   +-- index.html
|   +-- pages/              # Ecrans secondaires
|   +-- assets/
|       +-- css/style.css   # CSS distribue
|       +-- js/             # Modules JavaScript navigateur
+-- src/scss/style.scss     # Source des styles
+-- server/server.js        # Serveur Express et API Stripe
+-- package.json
+-- .env.example
```

## Demarrer avec Stripe

1. Installer Node.js 18+.
2. Executer `npm install`.
3. Copier `.env.example` vers `.env` et renseigner les identifiants Stripe de test.
4. Executer `npm start` puis ouvrir `http://localhost:4242`.
5. Configurer le webhook Stripe `POST /api/stripe/webhook` avec les evenements `checkout.session.completed` et `customer.subscription.deleted`.

La cle `STRIPE_SECRET_KEY` reste uniquement sur le serveur. Le navigateur ne recoit que l'URL de Checkout.
