# Next.js E-commerce (Learning Project)

Cette application est un exemple de frontend e-commerce moderne construit avec **Next.js 15 (App Router)** et **React 19** pour apprendre les bases et les bonnes pratiques du framework.

L'application communique avec l'API publique [FakeStoreAPI](https://fakestoreapi.com/) pour la récupération des produits et la simulation des actions (connexion, historique des commandes, panier).

---

## 🛠️ Stack Technique

- **Framework** : Next.js 15 (App Router, Server & Client Components)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4
- **Composants UI** : Shadcn UI primitives & Lucide Icons

---

## 🌟 Fonctionnalités

1. **Page d'Accueil Premium** : Hero section immersive s'adaptant aux thèmes clair/sombre, bandeau de réassurance, navigation rapide par catégories et liste dynamique des produits les mieux notés.
2. **Catalogue de Produits** : Barre de recherche textuelle instantanée, filtrage par catégories synchronisé avec l'URL (permettant le partage de liens), et tri multicritères (prix croissant/décroissant, pertinence, note).
3. **Fiche Produit Détaillée** : Layout à deux colonnes soigné, étoiles d'évaluation dynamiques, zoom sur image au survol, fil d'Ariane (breadcrumbs) et sélecteur de quantité avec ajout au panier animé.
4. **Panier d'achat Interactif** : Persistance locale (`localStorage`), notifications Toast animées lors de l'ajout, calcul de la TVA et processus d'achat simulé par appel API (avec écran de succès de commande).
5. **Liste des Favoris (Wishlist)** : Boutons favoris flottants (avec prévention de propagation de clic sur les cartes), page dédiée aux favoris avec ajout direct au panier.
6. **Espace Compte & Authentification** :
   - Formulaire de connexion simulé à l'aide de cookies de session (`token`, `username`).
   - Récupération dynamique et rendu de l'historique des commandes passées de l'utilisateur sur FakeStoreAPI.
   - *Note de test* : Utilisez des identifiants réels de l'API (ex : nom d'utilisateur `johnd` / mot de passe `m38rmF$`) pour charger un historique de commandes existant.

---

## 📂 Architecture & Bonnes Pratiques

Le projet applique des concepts d'architecture Next.js modernes :

- **Colocalisation des Composants** : Les composants réutilisables globalement sont stockés dans le dossier `/components` à la racine. Les composants spécifiques à une route (comme les formulaires de connexion ou les lignes du panier) sont placés dans un sous-dossier `components/` directement dans le répertoire de leur route correspondante (ex: `app/compte/components/`).
- **Rendu Hybride (Server/Client)** : Les données du catalogue et des détails produit sont récupérées côté serveur (Server Components) pour un chargement initial instantané et un excellent SEO, puis transmises à des sous-composants interactifs clients (`"use client"`) pour le filtrage, le tri et la recherche.
- **Prévention des désaccords d'hydratation (Hydration Mismatch)** : Pour toutes les données lues depuis le `localStorage` ou liées aux thèmes côté client, nous utilisons un garde d'effet de montage (`useEffect`) pour éviter les désaccords entre le rendu HTML initial du serveur et l'état local du navigateur.

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
pnpm install
```

### 2. Lancer le serveur de développement
```bash
pnpm dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 3. Valider les types TypeScript
```bash
pnpm typecheck
```

### 4. Compiler le projet pour la production
```bash
pnpm build
```
