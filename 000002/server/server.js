import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 4242);
const publicDir = path.join(__dirname, '..', 'public');
const appUrl = process.env.APP_URL || `http://localhost:${port}`;
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const prices = {
    studio: process.env.STRIPE_STUDIO_PRICE_ID,
    agency: process.env.STRIPE_AGENCY_PRICE_ID
};

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return response.status(503).send('Stripe non configure');
    try {
        const event = stripe.webhooks.constructEvent(request.body, request.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
        if (event.type === 'checkout.session.completed') console.log(`Abonnement active: ${event.data.object.id}`);
        if (event.type === 'customer.subscription.deleted') console.log(`Abonnement termine: ${event.data.object.id}`);
        response.json({ received: true });
    } catch (error) {
        response.status(400).send(`Webhook invalide: ${error.message}`);
    }
});

app.use(express.json());
app.use(express.static(publicDir));

app.get('/api/stripe/config', (request, response) => {
    response.json({ configured: Boolean(stripe && prices.studio && prices.agency) });
});

app.post('/api/stripe/checkout', async (request, response) => {
    if (!stripe) return response.status(503).json({ error: 'Stripe est encore en configuration.' });
    const plan = request.body?.plan;
    if (!prices[plan]) return response.status(400).json({ error: 'Plan Stripe inconnu.' });
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [{ price: prices[plan], quantity: 1 }],
            allow_promotion_codes: true,
            success_url: `${appUrl}/pages/create.html?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/pages/premium.html?subscription=cancelled`,
            metadata: { plan }
        });
        response.json({ url: session.url });
    } catch (error) {
        response.status(500).json({ error: 'Impossible de créer la session Stripe.' });
    }
});

app.get('/api/stripe/session', async (request, response) => {
    if (!stripe) return response.status(503).json({ error: 'Stripe est encore en configuration.' });
    if (!request.query.session_id) return response.status(400).json({ error: 'Session Stripe manquante.' });
    try {
        const session = await stripe.checkout.sessions.retrieve(request.query.session_id);
        response.json({ customerId: session.customer, active: session.payment_status === 'paid' || session.status === 'complete' });
    } catch {
        response.status(404).json({ error: 'Session Stripe introuvable.' });
    }
});

app.post('/api/stripe/portal', async (request, response) => {
    if (!stripe) return response.status(503).json({ error: 'Stripe est encore en configuration.' });
    const customerId = request.body?.customerId;
    if (!customerId) return response.status(400).json({ error: 'Identifiant client manquant.' });
    try {
        const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${appUrl}/pages/settings.html` });
        response.json({ url: session.url });
    } catch (error) {
        response.status(500).json({ error: 'Impossible d’ouvrir le portail Stripe.' });
    }
});

app.listen(port, () => console.log(`Nova disponible sur ${appUrl}`));


