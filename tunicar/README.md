# TuniCar — Site de location de voitures (Tunisie)

Site multilingue (Français, Arabe tunisien, English) avec réservation, paiement et espace administrateur.
Aucune dépendance externe : Node.js 18+ suffit.

## Lancer le site

```bash
cd tunicar
ADMIN_USER=owner ADMIN_PASS='un-mot-de-passe-solide' node server.js
```

- Site public : http://localhost:3000
- Administration : http://localhost:3000/admin

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `ADMIN_USER` / `ADMIN_PASS` | Identifiants de l'administrateur (obligatoires en production) |
| `COMPANY_NAME` | Nom de la société affiché |
| `DELIVERY_FEE` | Frais de livraison à domicile en DT (défaut 10) |
| `CONTACT_PHONE`, `CONTACT_WHATSAPP`, `CONTACT_EMAIL`, `CONTACT_ADDRESS` | Coordonnées affichées |
| `USDT_ADDRESS`, `BTC_ADDRESS` | Adresses de réception crypto |
| `PAYPAL_EMAIL` | Compte PayPal recevant les paiements |
| `CARD_PAYMENT_URL` | Lien de la passerelle carte (Stripe, Konnect, etc.) |
| `PORT` | Port d'écoute (défaut 3000) |

## Données

- `data/db.json` : véhicules et réservations
- `data/visits.json` : journal des visites (une ligne JSON par visite)
- `uploads/` : preuves de paiement envoyées par les clients (accessibles uniquement depuis l'admin)

Sauvegardez régulièrement le dossier `data/` et `uploads/`.

## Mise en production

Placez le site derrière HTTPS (Nginx, Caddy ou un hébergeur Node). Si le site est derrière Cloudflare,
le pays du visiteur est lu automatiquement depuis l'en-tête `CF-IPCountry`.
