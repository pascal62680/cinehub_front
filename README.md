# CineHub — Interface web (React)

Interface web de **CineHub**, application de gestion de cinéma. Ce front consomme l'API REST [cinehub_back](https://github.com/pascal62680/cinehub_back) (Node.js / Express / MySQL) : un utilisateur consulte les films et réserve des places ; un administrateur gère les films, les salles et les séances.

## Technologies
React 19, Vite, `react-router`, `fetch` (aucune bibliothèque de requêtes), CSS simple, ESLint.

## Prérequis
- Node.js 20 ou plus
- L'API **cinehub_back** installée et **lancée** sur `http://127.0.0.1:3000` (voir son README).
  L'API autorise ce front grâce à CORS (`origin: http://localhost:5173`).

## Installation et lancement
```bash
git clone https://github.com/pascal62680/cinehub_front.git
cd cinehub_front
npm install
npm run dev
```
Le site est disponible sur **http://localhost:5173**.

> Les deux serveurs doivent tourner en même temps : l'API (port 3000) dans un terminal, le front (port 5173) dans un autre.

## Comptes de test
| Rôle  | Username | Mot de passe |
|-------|----------|--------------|
| admin | `pascal` | `pascal62680` |
| user  | `jean`   | `jean1234`    |

## Fonctionnalités

**Utilisateur connecté**
- Connexion / déconnexion (le token JWT est conservé dans `localStorage`, la session survit au rechargement)
- Liste des films à l'affiche
- Détail d'un film et de ses prochaines séances
- Réservation de places sur une séance (un e-mail de confirmation est envoyé par l'API)
- Liste de ses réservations et annulation

**Administrateur** (menu « Admin », visible uniquement pour le rôle `admin`)
- Films : création, retrait de l'affiche (soft delete) et remise à l'affiche
- Salles : liste et création
- Séances : création (choix du film et de la salle), suppression

Les règles métier (places disponibles, séance passée, double réservation, validation des champs, droits admin) sont **appliquées par l'API** : le front affiche ses réponses et ses messages d'erreur. Masquer l'espace admin côté front est un confort ; la protection réelle est le middleware `checkAdmin` de l'API (403).

## Pages
| Adresse | Page |
|---|---|
| `/` | Films à l'affiche |
| `/films/:id` | Détail d'un film, séances et réservation |
| `/login` | Connexion |
| `/reservations` | Mes réservations |
| `/admin` | Espace administrateur (admin uniquement) |
| autre | Page introuvable |

## Structure
```
src/
├─ main.jsx            point d'entrée (BrowserRouter)
├─ App.jsx             routes + token partagé (connexion / déconnexion)
├─ api.js              apiFetch : appels à l'API, ajout automatique du token
├─ auth.js             readToken : lecture du contenu du JWT (nom, rôle)
├─ format.js           formatDate : dates en français
├─ pages/              Home, FilmDetail, Login, MyReservations, Admin, NotFound
└─ components/         Navbar, ScreeningItem, AdminFilms, AdminRooms, AdminScreenings
```

## Scripts
| Commande | Rôle |
|---|---|
| `npm run dev` | lance le serveur de développement |
| `npm run build` | crée la version de production dans `dist/` |
| `npm run lint` | vérifie le code avec ESLint |
