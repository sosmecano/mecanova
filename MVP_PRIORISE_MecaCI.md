# Mecanova — MVP priorisé

## Lancer vite, apprendre vite, itérer

|                    |                                     |
| ------------------ | ----------------------------------- |
| **Version**        | 1.0                                 |
| **Date**           | Juin 2026                           |
| **Objectif**       | Définir le périmètre minimal viable pour un lancement en 3-4 mois |

---

# Principes directeurs du MVP

1. **Moins de fonctionnalités = plus de qualité** — mieux vaut 5 features parfaites que 15 buggées
2. **Priorité à l'urgence** — le besoin réel est le dépannage immédiat, pas le carnet d'entretien
3. **Deux apps, un backend** — deux expériences distinctes (client + pro), base technique mutualisée
4. **Paiement obligatoire dans l'app** — contrôle total de l'expérience et des commissions
5. **Abidjan uniquement au lancement** — concentration des ressources pour un effet réseau local fort

---

# 1. Périmètre MVP — Application client

## P0 — Indispensable au lancement

| # | Fonctionnalité | Justification |
| - | -------------- | ------------- |
| 1 | **Inscription / Connexion par téléphone + OTP** | Nécessaire pour toute interaction |
| 2 | **Ajout d'au moins 1 véhicule** | Requis pour demander un service |
| 3 | **Géolocalisation** | Trouver le professionnel proche, suivi |
| 4 | **Bouton SOS PANNE** | Fonction signature, besoin critique |
| 5 | **Dépannage d'urgence** (crevaison, batterie, panne) | Premier cas d'usage |
| 6 | **Mécanicien à domicile** (entretien, réparation) | Second cas d'usage |
| 7 | **Suivi temps réel** (carte, statut, ETA) | Confiance et transparence |
| 8 | **Paiement Mobile Money** | Monétisation, traçabilité |

## P1 — Vague 2 (semaines 5-8 après lancement)

| # | Fonctionnalité | Justification |
| - | -------------- | ------------- |
| 9 | **Remorquage** | Fonctionnalité importante mais moins fréquente que dépannage |
| 10 | **Recherche de garages** (liste + fiche simple) | Usage programmé, complémentaire |
| 11 | **Avis et notation** (note 5 étoiles + commentaire) | Confiance et qualité |
| 12 | **Devis estimatif avant validation** | Transparence prix |
| 13 | **Messagerie simple** (texte uniquement) | Communication de base |

## P2 — Post-MVP / V2 uniquement

| Fonctionnalité | Raison du report |
| -------------- | ----------------- |
| Carnet d'entretien numérique | Usage non urgent, complexité |
| Diagnostic IA | Coût, dépendance IA, à valider |
| Vidéo / notes vocales | Périphérique au parcours principal |
| Multi-véhicules avancé | 1 véhicule suffit au lancement |
| Gestion des photos avant/après | Surcharge UX, peut attendre |
| Alertes entretien automatiques | Nécessite carnet d'entretien |

---

## 1.1 Détail des écrans MVP

### Écran 1 — Inscription (P0)

```
[Logo Mecanova]
[Illustration]

Numéro de téléphone : [____]
[Recevoir le code]

→ Vérification OTP (6 chiffres)
→ Nom & Prénom
→ Ville
→ Ajouter mon véhicule (marque, modèle, année, immatriculation)
→ [Terminer]
```

### Écran 2 — Accueil (P0)

```
[Barre de recherche "Que cherchez-vous ?"]
[Carte interactive — position utilisateur]

[🚨 SOS PANNE — bouton rouge, pleine largeur]

Services :
  🔧 Mécanicien à domicile
  ⚡ Dépannage urgence

Proches de vous :
  [Carte avec mécaniciens disponibles]
```

### Écran 3 — SOS PANNE (P0)

```
📍 Position détectée

🚨 URGENCE — Demande envoyée

Mécanicien le plus proche :
  Nom, distance, ⭐ 4.5
  ETA : 12 min
  Estimation : 5 000 - 10 000 FCFA

Remorqueur le plus proche :
  Nom, distance, ⭐ 4.2
  ETA : 20 min
  Estimation : 15 000 - 25 000 FCFA

[Annuler la demande]
```

### Écran 4 — Suivi mission en cours (P0)

```
🔧 Intervention en cours

Professionnel : Nom du mécanicien
Note : ⭐ 4.5
Véhicule : 🚐 ABC-123

🟢 En route — arrive dans 12 min

[Carte avec itinéraire professionnel → client]

[📞 Appeler]    [💬 Message]
```

### Écran 5 — Paiement (P0)

```
Intervention terminée ✅

Montant : 8 500 FCFA
Commission Mecanova : 500 FCFA
Total à payer : 9 000 FCFA

Payer par :
📱 Mobile Money
  [Orange Money]
  [MTN MoMo]
  [Wave]

[Confirmer le paiement]
```

### Écran 6 — Profil (P0)

```
Mon profil
  Nom, téléphone, ville

Mes véhicules
  Toyota Corolla 2021 — AB-123-CD

Historique des interventions
  [Liste des missions passées]
```

---

# 2. Périmètre MVP — Espace professionnel

## 2.1 Fonctionnalités P0 (MVP)

| # | Fonctionnalité | Détail |
| - | -------------- | ------ |
| 1 | **Inscription pro** | Téléphone + OTP, nom, spécialité, zone intervention |
| 2 | **Validation KYC simple** | Upload pièce d'identité + photo, validation manuelle admin |
| 3 | **Réception des demandes** | Notification + écran des missions disponibles |
| 4 | **Acceptation / Refus** | Un bouton, choix binaire |
| 5 | **Navigation vers le client** | Lien Maps ou carte intégrée |
| 6 | **Statut mission** | En route / Arrivé / Terminé |
| 7 | **Confirmation fin d'intervention** | Photo facultative, validation |
| 8 | **Disponibilité on/off** | Switch simple en ligne/hors ligne |

## 2.2 Fonctionnalités P1 (vague 2)

| Fonctionnalité | Détail |
| -------------- | ------ |
| Historique des missions | Liste des interventions passées |
| Revenus | Montant total, missions du jour |
| Devis personnalisé | Envoyer un prix avant validation |
| Appel client | Intégré depuis l'application |

## 2.3 Écrans MVP pro

### Écran pro 1 — Accueil

```
👤 Nom du mécanicien
🟢 En ligne / 🔴 Hors ligne    [Switch]

Nouvelles demandes (3)
  [Liste des demandes : distance, service, urgence]

En cours :
  Mission — Client à 3 km — ETA 8 min
```

### Écran pro 2 — Demande reçue

```
🔧 Demande de dépannage

Client : Jean K.
Position : Cocody, Angré
Distance : 2.5 km
Problème : Batterie déchargée

[✅ Accepter]    [❌ Refuser]
```

### Écran pro 3 — Mission en cours

```
📍 En route vers le client

Client : Jean K.
Distance restante : 0.8 km

[📞 Appeler]

Statut :
    🟢 En route
    ⬜ Arrivé
    ⬜ Terminé
```

---

# 3. Périmètre MVP — Back-office admin

| Fonctionnalité | Priorité | Détail |
| -------------- | -------- | ------ |
| **Dashboard** | P0 | Nombre utilisateurs, missions en cours, revenus du jour |
| **Validation pros** | P0 | Liste des inscriptions, upload pièces, approuver/refuser |
| **Liste utilisateurs** | P0 | Consultation, recherche, suspension |
| **Suivi missions** | P0 | Carte live des missions en cours |
| **Gestion paiements** | P1 | Historique, montants, litiges |
| **Notifications manuelles** | P1 | Envoyer une notification push à un utilisateur |

---

# 4. Architecture technique MVP

## 4.1 Stack recommandée

| Couche | Technologie | Justification |
| ------ | ----------- | ------------- |
| **Backend** | Node.js / Express + TypeScript | Rapidité de développement, écosystème riche |
| **Base de données** | PostgreSQL | Fiabilité, géolocalisation (PostGIS) |
| **Temps réel** | WebSocket (Socket.io) | Suivi mission, notifications |
| **Mobile client** | React Native (Expo) | iOS + Android, code partagé, itération rapide |
| **Mobile pro** | React Native (Expo) | Même codebase, modules partagés |
| **Back-office** | React + Vite | Web rapide, moderne |
| **Stockage** | Cloud (AWS S3 / Cloudinary) | Images, documents |
| **SMS** | Twilio ou service local | OTP |
| **Paiement** | API Mobile Money (Orange, MTN, Wave) | Via agrégateur (CinetPay, etc.) |
| **Maps** | Mapbox / Google Maps | Géolocalisation, suivi |

## 4.2 Architecture simplifiée MVP

```
[Mobile Client] --\
                   --> [API Gateway] --> [Auth Service]
[Mobile Pro]   ---/                      [Mission Service]
                                         [Payment Service]
                                         [Pro Matching Service]
                                         [Notification Service]

[Back-office Admin] --> [Admin API]   --> [Admin Service]

Services connectés à :
  - PostgreSQL (avec PostGIS pour la géolocalisation)
  - Cache Redis (sessions, temps réel)
  - Stockage Cloud (images KYC, photos)
```

## 4.3 Ce qu'on NE fait PAS dans le MVP

| Élément | Report | Raison |
| ------- | ------ | ------ |
| Microservices complets | V2 | Monolithe modulaire suffit au début |
| IA diagnostic | V2 | Complexité, coût, pas validé |
| CI/CD avancé | V2 | Déploiement manuel suffit |
| Tests automatisés complets | V2 | Tests manuels + tests critiques |
| Monitoring avancé | V2 | Logs suffisent |
| Multi-langue | V2 | Français uniquement au lancement |

---

# 5. Planning MVP recommandé

## Sprint 0 — Setup (1 semaine)

- Mise en place des environnements (dev, staging)
- Dépôt Git, CI basique
- Configuration base de données
- Choix et validation des APIs externes

## Sprint 1 — Auth + Profils (2 semaines)

- Inscription/connexion client OTP
- Inscription/connexion pro OTP
- Gestion profil client (nom, téléphone, véhicule)
- Gestion profil pro (nom, spécialité, zone)
- Validation KYC pro (back-office)

## Sprint 2 — Demande & Matching (2 semaines)

- Création d'une demande client
- Algorithme de matching (proximité, spécialité, disponibilité)
- Réception de demande côté pro
- Acceptation / refus pro

## Sprint 3 — Suivi & Paiement (2 semaines)

- Suivi temps réel (WebSocket)
- Carte avec position du pro
- Statuts mission (en route, arrivé, terminé)
- Intégration paiement Mobile Money
- Confirmation de fin d'intervention

## Sprint 4 — SOS & Rafraîchissements (1 semaine)

- Fonction SOS PANNE complète
- Flux ultra-court (3 étapes max)
- Notification prioritaire pro
- Améliorations UX

## Sprint 5 — Back-office + Finalisation (2 semaines)

- Dashboard admin
- Validation pros
- Suivi des missions
- Tests utilisateurs
- Correction bugs

## Sprint 6 — Lancement pilote (1 semaine)

- Déploiement production
- Recrutement 50 premiers professionnels
- Communication ciblée Abidjan
- Support utilisateurs intensif

---

**Total : 10-11 semaines** pour un MVP fonctionnel

---

# 6. Budget technique estimé (MVP)

## Coûts récurrents mensuels

| Poste | Coût estimé (FCFA/mois) |
| ----- | ----------------------- |
| Hébergement backend (VPS/Cloud) | 50 000 - 100 000 |
| Base de données | 30 000 - 60 000 |
| API SMS (OTP) | 20 000 - 50 000 |
| API Maps | 30 000 - 80 000 |
| API Mobile Money (agrégateur) | 10 000 - 30 000 |
| Notifications push | 10 000 - 25 000 |
| Stockage cloud | 10 000 - 20 000 |
| Nom de domaine + email | 5 000 |
| **Total mensuel** | **~165 000 - 370 000 FCFA** |

## Développement (estimation)

| Poste | Effort estimé |
| ----- | ------------- |
| Développement backend | 4-6 semaines |
| Application mobile client | 5-7 semaines |
| Application mobile pro | 3-4 semaines |
| Back-office admin | 2-3 semaines |
| Intégration paiement | 1 semaine |
| Tests et déploiement | 2 semaines |

---

# 7. User stories MVP — Par priorité

## P0 — Sprint 1 & 2

```gherkin
# US-001 : Inscription client
Étant donné un utilisateur avec un numéro de téléphone
Quand il saisit son numéro sur l'écran d'inscription
Alors un code OTP lui est envoyé par SMS
Et il peut créer son compte après vérification

# US-002 : Ajout véhicule
Étant donné un utilisateur connecté
Quand il ajoute un véhicule (marque, modèle, année, immatriculation)
Alors le véhicule est associé à son compte

# US-003 : Demande de dépannage
Étant donné un utilisateur connecté avec un véhicule
Quand il sélectionne "Dépannage urgence"
Alors sa position est détectée
Et la demande est envoyée aux professionnels disponibles à proximité

# US-004 : Réception de demande (pro)
Étant donné un professionnel connecté et disponible
Quand une demande client correspond à son profil et sa zone
Alors il reçoit une notification avec les détails de la demande

# US-005 : Acceptation de mission (pro)
Étant donné un professionnel ayant reçu une demande
Quand il clique sur "Accepter"
Alors la mission est confirmée
Et le client est notifié
Et l'itinéraire vers le client est affiché
```

## P0 — Sprint 3 & 4

```gherkin
# US-006 : Suivi temps réel
Étant donné une mission en cours
Quand le professionnel se déplace
Alors le client voit sa position sur la carte en temps réel

# US-007 : Paiement Mobile Money
Étant donné une intervention terminée
Quand le professionnel confirme la fin
Alors un récapitulatif du paiement est affiché
Et le client peut payer via Mobile Money

# US-008 : SOS PANNE
Étant donné un utilisateur sur l'écran d'accueil
Quand il clique sur le bouton SOS PANNE
Alors la demande est envoyée en priorité
Et les professionnels les plus proches sont notifiés immédiatement
Et le meilleur pro est affiché avec ETA et prix estimé
```

## P1 — Sprint 5 & 6

```gherkin
# US-009 : Avis
Étant donné une intervention terminée et payée
Quand le client accède à l'écran de notation
Alors il peut noter le professionnel sur 5
Et laisser un commentaire facultatif

# US-010 : Remorquage
Étant donné un utilisateur connecté
Quand il sélectionne "Remorquage"
Alors il indique le point de départ et la destination
Et une estimation de prix lui est proposée
Et la demande est envoyée aux remorqueurs disponibles
```

---

# 8. Ce qui est explicitement HORS MVP

| Fonctionnalité | Dans V2 |
| -------------- | ------- |
| Diagnostic IA | V2 — analyse photo/texte, nécessite modèle IA |
| Carnet d'entretien numérique | V2 — alertes, historique, dépenses |
| Chat temps réel dans l'application | V2 — appel direct suffit au MVP |
| Plusieurs employés par garage | V2 — gestion d'équipe complexe |
| Publicité intelligente | V2 — nécessite assez d'utilisateurs |
| Fidélité / coupons | V2 — après rétention prouvée |
| Programme de parrainage | V2 — viralité après stabilisation |
| Mode sombre | V2 — non bloquant |
| Multi-langue (anglais) | V2 — français seulement au lancement |
| Widget SOS sur écran verrouillé | V2 — technique complexe |
| Signalement / Litige automatisé | V2 — traitement manuel au début |
| Scoring qualité pro | V2 — nécessite suffisamment d'avis |
| Assistance flotte entreprise | V2 — nouveau segment client |

---

# 9. Risques spécifiques au MVP

| Risque | Impact | Action |
| ------ | ------ | ------ |
| Pas assez de pros au lancement | Critique | Recruter 30 pros avant le jour J, zone pilote, incitations |
| Pro accepte mais ne vient pas | Moyen | Désactivation après 2 absences, notation impactée |
| Problème paiement Mobile Money | Critique | Tester tous les réseaux en avance, fallback espèces |
| GPS imprécis en zone urbaine dense | Moyen | Utiliser plusieurs providers, permettre à l'utilisateur de préciser sa position |
| Faible adoption utilisateurs | Moyen | Marketing ciblé Abidjan, parrainage, premiers pros relais |

---

# 10. Définition de fait (Definition of Done) — MVP

Une fonctionnalité MVP est considérée comme livrée quand :

- [ ] L'écran/flow est développé et fonctionne sur iOS et Android
- [ ] Les données sont correctement persistées en base
- [ ] Le professionnel peut interagir (recevoir/accepter)
- [ ] Le paiement Mobile Money est fonctionnel et traçable
- [ ] Les notifications (push/SMS) sont envoyées aux bons moments
- [ ] Un test utilisateur a validé le parcours (au moins 1 test)
- [ ] Pas de crash, pas de freeze, pas de régression sur les fonctionnalités P0 existantes

---

*Document généré le 14 juin 2026 — Version 1.0*

**Mecanova** — Le mécanicien et le dépannage à portée de main
