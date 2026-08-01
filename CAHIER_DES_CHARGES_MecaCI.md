# Mecanova

## Le mécanicien et le dépannage à portée de main

**Cahier des charges fonctionnel et technique**

|                    |                                     |
| ------------------ | ----------------------------------- |
| **Version**        | 1.0                                 |
| **Date**           | Juin 2026                           |
| **Zone de lancement** | Côte d'Ivoire                    |
| **Type**           | Plateforme mobile de mise en relation |
| **Concept**        | « Uber des mécaniciens »            |

---

# Résumé exécutif

Mecanova est une plateforme mobile de mise en relation entre automobilistes et professionnels de l'automobile (mécaniciens, remorqueurs, garages) lancée en Côte d'Ivoire.

**Problème :** Les automobilistes ivoiriens peinent à trouver rapidement un mécanicien fiable, manquent de visibilité sur les prix et ne disposent d'aucun suivi structuré pour l'entretien de leur véhicule.

**Solution :** Une application mobile intuitive permettant de demander un mécanicien à domicile, un dépannage d'urgence (bouton SOS), un remorquage ou de trouver un garage — avec géolocalisation, estimation de prix, paiement Mobile Money, suivi en temps réel et carnet d'entretien numérique.

**Cibles :** Particuliers (automobilistes, VTC, taxis), professionnels (mécaniciens, électriciens auto, remorqueurs, garages), administrateur plateforme.

**Modèle économique :** Abonnements premium pour mécaniciens (10 000 FCFA/mois) et garages (15 000 FCFA/mois), commission de 10 % sur les missions de remorquage, espaces publicitaires.

**MVP :** Inscription, mécanicien à domicile, SOS panne, remorquage, recherche de garages, suivi temps réel, paiement Mobile Money, avis, espace professionnel, back-office admin.

---

# Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Contexte et problématique](#2-contexte-et-problématique)
3. [Vision du produit](#3-vision-du-produit)
4. [Objectifs du projet](#4-objectifs-du-projet)
5. [Cibles utilisateurs](#5-cibles-utilisateurs)
6. [Positionnement et proposition de valeur](#6-positionnement-et-proposition-de-valeur)
7. [Périmètre fonctionnel global](#7-périmètre-fonctionnel-global)
8. [Spécifications fonctionnelles détaillées](#8-spécifications-fonctionnelles-détaillées)
9. [Fonction SOS PANNE](#9-fonction-sos-panne)
10. [Modèle économique](#10-modèle-économique)
11. [UX/UI — Direction artistique](#11-uxui--direction-artistique)
12. [Parcours utilisateurs clés](#12-parcours-utilisateurs-clés)
13. [Règles métier principales](#13-règles-métier-principales)
14. [Notifications](#14-notifications)
15. [Architecture fonctionnelle](#15-architecture-fonctionnelle)
16. [Intégrations externes](#16-intégrations-externes)
17. [Exigences non fonctionnelles](#17-exigences-non-fonctionnelles)
18. [Données principales](#18-données-principales)
19. [Administration et modération](#19-administration-et-modération)
20. [Sécurité, conformité et confiance](#20-sécurité-conformité-et-confiance)
21. [MVP recommandé](#21-mvp-recommandé)
22. [Planning projet](#22-planning-projet)
23. [KPI de succès](#23-kpi-de-succès)
24. [Risques et mitigation](#24-risques-et-mitigation)
25. [Questions à arbitrer](#25-questions-à-arbitrer)
26. [Livrables attendus](#26-livrables-attendus)
27. [Critères de recette](#27-critères-de-recette)
28. [Glossaire](#28-glossaire)

---

# 1. Présentation du projet

| Champ                 | Valeur                                          |
| --------------------- | ----------------------------------------------- |
| Nom du projet         | Mecanova                                          |
| Slogan                | Le mécanicien et le dépannage à portée de main  |
| Zone de lancement     | Côte d'Ivoire                                   |
| Type de solution      | Plateforme mobile de mise en relation           |
| Concept               | « Uber des mécaniciens » en Côte d'Ivoire       |

Mecanova est une **application mobile** qui permet à un utilisateur en panne ou ayant besoin d'un service automobile de :

- trouver rapidement un mécanicien, un remorqueur ou un garage à proximité ;
- consulter un prix estimatif ;
- suivre l'intervention en temps réel ;
- payer via Mobile Money ;
- conserver un historique d'entretien numérique.

L'application comporte aussi un **espace professionnel** destiné aux mécaniciens, remorqueurs et garages afin de recevoir, gérer et facturer leurs interventions.

---

# 2. Contexte et problématique

En Côte d'Ivoire, les automobilistes rencontrent plusieurs difficultés :

| Difficulté                                    | Impact                                           |
| --------------------------------------------- | ------------------------------------------------ |
| Difficulté à trouver rapidement un mécanicien fiable | Stress, perte de temps, risques d'arnaque    |
| Manque de visibilité sur les prix            | Mauvaises surprises, absence de références       |
| Absence de suivi lors d'un dépannage          | Inquiétude, méfiance envers le prestataire       |
| Faible digitalisation des garages             | Difficulté à comparer, à réserver, à tracer      |
| Manque d'historique structuré d'entretien     | Perte d'information, défaut de suivi             |
| Stress important en cas de panne urgente      | Prise de décision sous pression, mauvaise expérience |

**Mecanova** répond à cette problématique en centralisant l'offre de services automobiles dans une application unique, intuitive, rapide et sécurisée.

---

# 3. Vision du produit

Créer la **plateforme de référence en Côte d'Ivoire** pour tous les besoins liés à l'assistance automobile, à l'entretien et au dépannage, avec une expérience utilisateur haut de gamme, simple et rassurante.

La vision produit repose sur **5 piliers** :

| Pilier        | Description                                                   |
| ------------- | ------------------------------------------------------------- |
| **Rapidité**  | Trouver un professionnel proche en quelques secondes          |
| **Confiance** | Profils vérifiés, avis, historique et transparence des prix   |
| **Simplicité** | Expérience fluide, accessible et compréhensible par tous    |
| **Proximité** | Services géolocalisés adaptés au contexte local               |
| **Digitalisation** | Moderniser le métier de mécanicien, remorqueur et garage |

---

# 4. Objectifs du projet

## 4.1 Objectifs business

- Lancer une marketplace automobile locale rentable
- Générer des revenus via abonnements, commissions et publicité
- Structurer un réseau de professionnels partenaires
- Devenir un réflexe quotidien pour les automobilistes

## 4.2 Objectifs produit

- Permettre à l'utilisateur de demander un service en **moins de 2 minutes**
- Proposer un bouton **SOS PANNE** ultra visible
- Afficher un professionnel proche avec estimation d'arrivée et de prix
- Digitaliser le carnet d'entretien du véhicule
- Intégrer un diagnostic assisté par IA (V2)

## 4.3 Objectifs opérationnels

- Faciliter l'acquisition de clients pour les professionnels
- Réduire le temps de mise en relation
- Améliorer la traçabilité des interventions
- Automatiser la gestion des demandes, devis et paiements

---

# 5. Cibles utilisateurs

## 5.1 Utilisateurs particuliers

| Profil                               | Besoin principal                                    |
| ------------------------------------ | --------------------------------------------------- |
| Propriétaires de voitures            | Entretien courant, dépannage                        |
| Chauffeurs VTC / taxis               | Dépannage rapide, suivi entretien                   |
| Entreprises avec petite flotte       | Gestion centralisée de l'entretien                  |
| Conducteurs en panne d'urgence       | Intervention immédiate (SOS)                        |
| Conducteurs souhaitant entretenir leur véhicule | Rendez-vous garage, carnet d'entretien   |

## 5.2 Professionnels

| Profil                  | Besoin principal                                    |
| ----------------------- | --------------------------------------------------- |
| Mécaniciens indépendants | Acquérir des clients, gérer leurs missions         |
| Électriciens auto       | Recevoir des demandes ciblées                       |
| Spécialistes climatisation | Être trouvé par des clients spécifiques          |
| Dépanneurs / remorqueurs | Recevoir des missions de remorquage                |
| Garages / centres auto  | Gérer rendez-vous, interventions, employés         |

## 5.3 Administrateur plateforme

Équipe Mecanova en charge de la modération, du support, de la facturation et du pilotage opérationnel et commercial.

---

# 6. Positionnement et proposition de valeur

Mecanova se positionne comme une **super app automobile locale**, combinant :

| Service                      | Description                                         |
| ---------------------------- | --------------------------------------------------- |
| Mise en relation instantanée | Matching automatique par proximité et spécialité     |
| Dépannage d'urgence          | Bouton SOS PANNE — intervention en moins de 3 étapes |
| Remorquage                   | Demande en un clic, estimation, suivi               |
| Réservation services mécaniques | Mécanicien à domicile, entretien, vidange        |
| Recherche de garages         | Filtres, fiches détaillées, avis, prise de RDV      |
| Carnet d'entretien           | Historique, alertes, factures                       |
| Diagnostic IA                | Analyse photo/texte, estimation, orientation        |
| Paiement mobile intégré      | Mobile Money, espèces, suivi                        |

**Promesse principale :** En cas de panne ou de besoin mécanique, l'utilisateur obtient rapidement le bon professionnel, au bon endroit, avec plus de visibilité, plus de confiance et moins de stress.

---

# 7. Périmètre fonctionnel global

L'écosystème Mecanova comprend trois briques principales :

| Briques              | Type         | Cible                         |
| -------------------- | ------------ | ----------------------------- |
| Application client   | Mobile       | Automobilistes                |
| Espace professionnel | Mobile       | Mécaniciens, remorqueurs, garages |
| Back-office admin   | Web          | Équipe Mecanova                 |

---

# 8. Spécifications fonctionnelles détaillées

## 8.1 Application client

### A. Inscription et authentification

**Objectif :** Créer un compte rapidement et en confiance.

**Fonctionnalités :**

- Inscription par numéro de téléphone
- Vérification OTP par SMS
- Connexion par téléphone + code
- Possibilité d'ajouter email plus tard
- Gestion du profil utilisateur
- Photo de profil facultative
- Gestion de plusieurs véhicules sur un même compte

**Données profil :**

| Champ     | Type   | Obligatoire |
| --------- | ------ | ----------- |
| Nom       | Texte  | Oui         |
| Prénom    | Texte  | Oui         |
| Téléphone | Texte  | Oui         |
| Email     | Texte  | Non         |
| Ville     | Texte  | Oui         |
| Langue    | Choix  | Oui         |
| Photo     | Image  | Non         |

**Données véhicule :**

| Champ              | Type   | Obligatoire |
| ------------------ | ------ | ----------- |
| Marque             | Texte  | Oui         |
| Modèle             | Texte  | Oui         |
| Année              | Nombre | Oui         |
| Immatriculation    | Texte  | Oui         |
| Carburant          | Choix  | Oui         |
| Boîte de vitesse   | Choix  | Oui         |
| Kilométrage        | Nombre | Non         |
| Couleur            | Texte  | Non         |
| Assurance          | Date   | Non         |
| Date visite technique | Date | Non         |
| Date dernière vidange | Date | Non         |

---

### B. Accueil principal

**Objectif :** Permettre un accès immédiat aux services.

**Éléments d'écran :**

- Barre de recherche
- Carte avec position actuelle
- Bouton principal **SOS PANNE** (rouge/orange, visible en permanence)
- Raccourcis services :
  - Mécanicien à domicile
  - Dépannage d'urgence
  - Remorquage
  - Garages proches
  - Diagnostic IA
  - Carnet d'entretien
- Historique des dernières demandes
- Suggestions intelligentes selon l'état du véhicule

---

### C. Mécanicien à domicile

**Services couverts :**

- Réparation sur place
- Entretien et vidange
- Diagnostic électronique
- Électricité automobile
- Climatisation

**Parcours utilisateur :**

1. L'utilisateur choisit le service
2. Il indique son véhicule
3. Il décrit le problème
4. Il peut joindre photo, vidéo ou note vocale
5. L'application détecte sa position
6. Une estimation de prix et délai est affichée
7. La demande est envoyée aux professionnels proches
8. Un professionnel accepte
9. L'utilisateur suit son arrivée
10. Intervention, validation, paiement et note

**Fonctions clés :**

- Géolocalisation
- Matching automatique par proximité et spécialité
- Devis estimatif ou devis personnalisé
- Messagerie / appel sécurisé
- Suivi de l'arrivée sur carte
- Confirmation de fin d'intervention
- Notation du professionnel

---

### D. Dépannage d'urgence

**Cas d'usage :**

- Batterie déchargée
- Crevaison
- Véhicule qui ne démarre plus
- Panne moteur
- Problème électrique

**Parcours :**

1. L'utilisateur clique sur **SOS PANNE**
2. L'application identifie les professionnels les plus proches
3. Elle affiche :
   - Mécanicien le plus proche
   - Remorqueur le plus proche
   - Temps d'arrivée estimé
   - Prix estimatif
4. Le professionnel accepte la mission
5. Le client suit sa progression en temps réel

**Exigences spécifiques :**

- Bouton SOS toujours visible
- Flux ultra court — maximum 3 étapes
- Mode urgence prioritaire
- Notifications temps réel
- Possibilité de basculer vers remorquage si réparation sur place impossible

---

### E. Remorquage

**Fonctionnalités :**

- Demande de remorque en un clic
- Géolocalisation du camion
- Estimation de prix avant validation
- Suivi temps réel
- Paiement Mobile Money

**Règles métier :**

- Estimation basée sur distance, type de véhicule et zone
- Possibilité de fixer un tarif minimum de prise en charge
- Calcul automatique de la commission plateforme
- Preuve de prise en charge et livraison du véhicule
- Historique de missions

---

### F. Recherche de garages

**Fonctionnalités :**

- Liste et carte des garages proches
- Filtres par note, spécialité, distance, disponibilité
- Fiche garage détaillée
- Notes et avis
- Contact direct
- Navigation GPS
- Possibilité de prise de rendez-vous

**Informations fiche garage :**

| Champ                             | Type    |
| --------------------------------- | ------- |
| Nom                               | Texte   |
| Adresse                           | Texte   |
| Horaires                          | Texte   |
| Spécialités                       | Liste   |
| Photos                            | Images  |
| Avis                              | Notes   |
| Téléphone                         | Texte   |
| Services                          | Liste   |
| Prix indicatifs                   | Texte   |
| Nombre d'interventions via Mecanova | Nombre  |

---

### G. Carnet d'entretien numérique

**Objectif :** Fidéliser l'utilisateur au-delà de l'urgence.

**Fonctionnalités :**

- Historique des réparations
- Historique des vidanges
- Suivi dépenses auto
- Alertes de vidange
- Alertes assurance
- Alertes visite technique
- Archivage des factures et devis
- Rappels automatiques

**Valeur ajoutée :**

- Meilleure rétention utilisateur
- Meilleure connaissance du véhicule
- Possibilité future de scoring entretien

---

### H. Diagnostic IA

**Principe :** L'utilisateur prend une photo du problème ou envoie une description, et l'application fournit une analyse automatique, une estimation probable du coût et une recommandation du meilleur professionnel.

**Entrées possibles :**

| Type       | Description                |
| ---------- | -------------------------- |
| Photo      | Image du problème          |
| Texte      | Description libre          |
| Vidéo      | Courte vidéo explicative   |
| Note vocale | Message vocal descriptif  |

**Sorties attendues :**

- Nature probable de la panne
- Niveau d'urgence
- Fourchette budgétaire
- Conseil : mécanicien / électricien / climatisation / remorquage / garage

**Important :** Le diagnostic IA est présenté comme une aide à l'orientation, pas comme un diagnostic mécanique garanti.

---

### I. Paiement

**Moyens visés :**

| Moyen              | Priorité |
| ------------------ | -------- |
| Mobile Money       | 1 (MVP)  |
| Espèces            | 2        |
| Carte bancaire     | 3 (V2)   |

**Fonctionnalités :**

- Paiement avant ou après intervention selon type de service
- Ventilation commission plateforme
- Reçus numériques
- Suivi des paiements
- Remboursement / litige si nécessaire

---

### J. Avis et notation

**Fonctionnalités :**

- Note sur 5
- Commentaire texte
- Signalement d'un professionnel
- Système anti-fraude avis
- Impact de la note sur la visibilité du professionnel

---

## 8.2 Espace professionnel

L'espace professionnel peut être disponible via une application dédiée ou une application unique avec bascule de rôle. Il comprend trois profils :

### A. Espace mécanicien

**Fonctionnalités principales :**

- Recevoir des demandes
- Accepter ou refuser une mission
- Voir la position du client
- Afficher itinéraire
- Gérer les rendez-vous
- Émettre des devis
- Démarrer / terminer une intervention
- Historique des missions
- Revenus et statistiques
- Gestion du profil, zone d'intervention et disponibilités

**Informations profil :**

| Champ                        | Type    |
| ---------------------------- | ------- |
| Nom                          | Texte   |
| Spécialités                  | Liste   |
| Photo                        | Image   |
| Téléphone                    | Texte   |
| Pièces justificatives        | Fichier |
| Zone d'intervention          | Carte   |
| Horaires                     | Texte   |
| Note moyenne                 | Note    |
| Grille tarifaire indicative  | Tableau |

---

### B. Espace remorqueur

**Fonctionnalités principales :**

- Recevoir demandes de remorquage
- Voir position client
- Accepter ou refuser une mission
- Suivi de course
- Confirmation prise en charge
- Historique missions
- Revenus
- Disponibilité en ligne / hors ligne

---

### C. Espace garage

**Fonctionnalités principales :**

- Gestion des clients
- Gestion des interventions
- Gestion des employés
- Agenda
- Devis et factures
- Suivi de statut véhicule
- Réception de rendez-vous depuis l'application
- Statistiques d'activité

---

### D. Onboarding et vérification des professionnels

**Étapes :**

1. Création de compte
2. Dépôt des pièces
3. Validation par l'équipe Mecanova
4. Activation du compte
5. Formation rapide à l'usage de l'application

**Pièces possibles :**

| Pièce                        | Obligatoire |
| ---------------------------- | ----------- |
| Pièce d'identité             | Oui         |
| Photo                        | Oui         |
| Certificat ou preuve d'activité | Oui      |
| Photo atelier ou véhicule    | Non         |
| Numéro Mobile Money          | Oui         |
| Documents légaux (garage structuré) | Si garage |

---

## 8.3 Back-office administrateur

**Fonctionnalités admin attendues :**

| Fonctionnalité                | Description                         |
| ----------------------------- | ----------------------------------- |
| Gestion utilisateurs          | Consultation, suspension, blocage   |
| Gestion professionnels        | Validation KYC, activation          |
| Validation KYC                | Vérification des pièces             |
| Gestion garages               | Fiches, modération                  |
| Modération avis               | Signalements, masquage              |
| Suivi interventions           | Consultation, traçabilité           |
| Gestion litiges               | Traitement, remboursement           |
| Gestion paiements et commissions | Suivi, calcul, reversement       |
| Gestion abonnements premium   | Activation, résiliation             |
| Gestion campagnes publicitaires | Création, suivi                   |
| Paramétrage tarifs et zones   | Configuration                       |
| Tableau de bord KPI           | Métriques temps réel                |
| Support client                | Messagerie, tickets                 |
| Notifications push et SMS     | Envoi ciblé                         |
| Gestion contenu application   | Bannières, messages                 |

---

# 9. Fonction SOS PANNE

## 9.1 Objectif

Mettre l'utilisateur en relation immédiate avec le professionnel pertinent lorsqu'il est immobilisé.

## 9.2 Déclenchement

Le client clique sur le bouton **SOS PANNE**.

## 9.3 Réponse de l'application

L'application affiche automatiquement :

- Le mécanicien le plus proche
- Le remorqueur le plus proche
- Le temps d'arrivée estimé
- Le prix estimatif

## 9.4 Suite du parcours

1. Le professionnel reçoit l'alerte
2. Il accepte la mission
3. Il se dirige vers le client
4. Le client suit la mission en temps réel
5. L'intervention est clôturée dans l'application
6. Paiement et avis

## 9.5 Exigences prioritaires

| Exigence              | Priorité |
| --------------------- | -------- |
| Temps de réponse rapide | Critique |
| Ergonomie ultra simple  | Critique |
| Fiabilité de la géolocalisation | Critique |
| Notifications instantanées | Critique |
| Haute visibilité du bouton SOS | Critique |

---

# 10. Modèle économique

## 10.1 Grille tarifaire

| Profil       | Formule      | Tarif                    |
| ------------ | ------------ | ------------------------ |
| Mécaniciens  | Gratuit      | Jusqu'à 5 interventions/mois |
| Mécaniciens  | Premium      | 10 000 FCFA / mois       |
| Remorqueurs  | Commission   | 10 % par mission         |
| Garages      | Premium      | 15 000 FCFA / mois       |

## 10.2 Publicité

Espaces publicitaires pour :

- Pièces détachées
- Assurances
- Centres auto

## 10.3 Gestion fonctionnelle du modèle

Le système doit permettre :

- Le comptage mensuel des interventions
- Le blocage ou bridage après seuil gratuit
- La souscription premium
- Le calcul automatique des commissions
- La facturation
- Le reporting financier

---

# 11. UX/UI — Direction artistique

## 11.1 Intention de design

L'application doit transmettre : **confiance, calme, précision, modernité, qualité premium**.

## 11.2 Principes visuels

| Principe                | Description                              |
| ----------------------- | ---------------------------------------- |
| Interface minimaliste   | Sans surcharge visuelle                  |
| Fond clair/maîtrisé     | Palette sobre et élégante                |
| Grands espaces blancs   | Aération, lisibilité                     |
| Typographie nette       | Police lisible, hiérarchie claire        |
| Cartes arrondies        | Coins arrondis, élégance                 |
| Ombres douces           | Profondeur subtile                       |
| Animations fluides      | Transitions naturelles                   |
| Icônes fines            | Style ligne, élégance                    |
| Hiérarchie simple       | Priorité à l'action                     |
| Boutons forts           | Rassurants, contrastés                   |

## 11.3 Ambiance

Design **Apple-like** : sobriété, fluidité, sensation haut de gamme, priorité à la lisibilité et à la confiance.

## 11.4 Recommandations UI

- Écran d'accueil très épuré
- Bouton SOS rouge/orange très visible
- Cartes de professionnels avec photo, note, distance et délai
- Carte interactive élégante
- Parcours en peu d'étapes
- Composants premium : blur, profondeur, feedback haptique, micro-interactions

## 11.5 Accessibilité

- Grands contrastes
- Tailles de texte lisibles
- Boutons accessibles au pouce
- Parcours simple même pour utilisateur peu technophile

---

# 12. Parcours utilisateurs clés

## 12.1 Parcours 1 — Demande d'un mécanicien à domicile

```
Ouverture app → Choix service → Sélection véhicule → Description problème
→ Estimation prix → Envoi demande → Acceptation pro → Suivi trajet
→ Intervention → Paiement → Notation
```

## 12.2 Parcours 2 — SOS panne

```
Clic SOS → Récupération position → Affichage pro le plus proche + ETA + prix
→ Acceptation mission → Suivi temps réel → Dépannage ou remorquage → Clôture
```

## 12.3 Parcours 3 — Remorquage

```
Demande remorque → Type véhicule → Point départ / destination
→ Estimation prix → Acceptation → Tracking → Paiement
```

## 12.4 Parcours 4 — Recherche garage

```
Recherche par zone → Affichage liste/carte → Consultation fiche
→ Appel, GPS ou RDV
```

## 12.5 Parcours 5 — Diagnostic IA

```
Prise photo → Analyse → Proposition solution → Mise en relation recommandée
```

---

# 13. Règles métier principales

| Règle | Description |
| ----- | ----------- |
| Compatibilité mission | Un professionnel ne reçoit que les demandes compatibles avec son profil et sa zone |
| Disponibilité | Un professionnel peut passer en statut disponible / indisponible |
| Priorité urgence | Les demandes urgentes ont priorité |
| Suivi obligatoire | Une mission acceptée doit être suivie jusqu'à annulation ou clôture |
| Prix | Peut être fixe, estimatif ou validé après devis |
| Traçabilité | Toute intervention doit laisser une trace dans l'historique |
| Visibilité premium | Les professionnels premium bénéficient d'une meilleure visibilité |
| Multi-véhicules | Un utilisateur peut enregistrer plusieurs véhicules |
| Alertes entretien | Calculées à partir des données saisies |

---

# 14. Notifications

## 14.1 Notifications client

| Type | Déclencheur |
| ---- | ----------- |
| Demande reçue | Demande envoyée |
| Professionnel trouvé | Matching trouvé |
| Professionnel en route | Mission acceptée |
| Arrivée imminente | Professionnel proche |
| Devis reçu | Devis émis |
| Paiement confirmé | Paiement validé |
| Rappel vidange | Date dépassée |
| Rappel assurance | Échéance approche |
| Rappel visite technique | Échéance approche |

## 14.2 Notifications professionnel

| Type | Déclencheur |
| ---- | ----------- |
| Nouvelle demande | Demande client |
| Mission urgente | SOS panne |
| Mission acceptée | Acceptation |
| Annulation | Annulation client |
| Paiement reçu | Paiement validé |
| Quota atteint | Fin de mois |
| Abonnement à renouveler | Échéance approche |

---

# 15. Architecture fonctionnelle

## 15.1 Plateformes

| Plateforme            | Technologie | Public   |
| --------------------- | ----------- | -------- |
| Application client    | Mobile      | Particuliers |
| Application pro       | Mobile      | Professionnels |
| Back-office admin     | Web         | Équipe Mecanova |

## 15.2 Approche technique

Deux options :

| Option | Description | Avantage |
| ------ | ----------- | -------- |
| A — App unique multi-rôles | Un seul code, changement de rôle | Maintenance simplifiée |
| B — Deux apps distinctes | App client + App pro | Clarté marketing et ergonomique |

**Recommandation MVP :** Deux expériences distinctes, base technique mutualisée.

## 15.3 Modules techniques

| Module | Description |
| ------ | ----------- |
| Authentification | OTP, sessions, rôles |
| Géolocalisation | Position, carte, suivi |
| Matching | Algorithme de mise en relation |
| Chat / Notification | Messagerie temps réel |
| Paiement | Mobile Money, commissions |
| Gestion abonnements | Premium, quotas |
| Moteur de tarification | Estimation prix |
| IA diagnostic | Analyse photo / texte |
| Back-office | Administration web |

---

# 16. Intégrations externes

| Intégration | Usage |
| ----------- | ----- |
| SMS OTP | Vérification téléphone |
| Cartes et géolocalisation | Maps, position, suivi |
| Notifications push | Alertes temps réel |
| Mobile Money | Paiement (Orange Money, MTN MoMo, Wave) |
| Stockage images/documents | Photos, pièces justificatives |
| Moteur IA | Analyse photo/texte (V2) |
| Analytics | Métriques d'usage |
| Support client | Chat / ticket |

---

# 17. Exigences non fonctionnelles

## 17.1 Performance

- Application fluide
- Chargement rapide
- Géolocalisation fiable
- Rafraîchissement temps réel sur carte

## 17.2 Sécurité

- Chiffrement des données sensibles
- Gestion sécurisée des sessions
- Séparation des rôles
- Journalisation des actions importantes
- Protection anti-fraude

## 17.3 Disponibilité

- Haute disponibilité backend
- Monitoring
- Alertes incidents

## 17.4 Scalabilité

- Capacité à étendre à plusieurs villes
- Capacité à ajouter d'autres services auto

## 17.5 Maintenance

- Code modulaire
- Documentation technique
- Environnements : test / préproduction / production

---

# 18. Données principales

## 18.1 Entités principales

| Entité | Description |
| ------ | ----------- |
| Utilisateur | Profil particulier |
| Véhicule | Informations véhicule |
| Professionnel | Mécanicien, remorqueur, garage |
| Garage | Fiche établissement |
| Demande | Requête de service |
| Mission | Intervention en cours |
| Devis | Estimation ou devis ferme |
| Paiement | Transaction financière |
| Abonnement | Formule premium |
| Avis | Note et commentaire |
| Alerte entretien | Rappel automatique |
| Diagnostic IA | Analyse et résultat |
| Publicité | Campagne et emplacement |
| Notification | Message push/SMS |
| Litige | Réclamation |

## 18.2 Historisation

Le système doit conserver :

- Historique des demandes
- Historique des interventions
- Historique des paiements
- Historique des alertes
- Historique des changements de statut

---

# 19. Administration et modération

Le système admin doit permettre :

| Action | Description |
| ------ | ----------- |
| Suspendre un compte | Utilisateur ou professionnel |
| Valider / refuser un professionnel | KYC |
| Traiter un litige | Médiation, remboursement |
| Rembourser | Si nécessaire |
| Masquer un avis | Avis frauduleux ou abusifs |
| Gérer les zones de couverture | Configuration |
| Piloter les campagnes promotionnelles | Création, suivi |
| Consulter les métriques business | Tableau de bord |

---

# 20. Sécurité, conformité et confiance

| Élément | Description |
| ------- | ----------- |
| Consentement utilisateur | Collecte et traitement des données |
| Politique de confidentialité | Document légal |
| Conditions générales d'utilisation | CGU utilisateurs |
| Conditions partenaires professionnels | CG pro |
| Gestion des preuves d'intervention | Photos, signatures |
| Traçabilité des paiements | Journal des transactions |
| Contrôle des comptes professionnels | Vérification périodique |

---

# 21. MVP recommandé

## 21.1 Fonctionnalités MVP — Client

| Fonctionnalité | Priorité |
| -------------- | -------- |
| Inscription / connexion | P0 |
| Ajout véhicule | P0 |
| Géolocalisation | P0 |
| Mécanicien à domicile | P0 |
| Dépannage urgence (SOS) | P0 |
| Remorquage | P0 |
| Recherche garages | P1 |
| Suivi temps réel basique | P0 |
| Paiement Mobile Money | P0 |
| Notes et avis | P1 |
| Bouton SOS | P0 |

## 21.2 Fonctionnalités MVP — Professionnel

| Fonctionnalité | Priorité |
| -------------- | -------- |
| Onboarding pro | P0 |
| Réception demandes | P0 |
| Acceptation / refus | P0 |
| Navigation vers client | P0 |
| Statut mission | P0 |
| Historique | P1 |
| Revenus | P1 |
| Abonnement premium mécanicien | P1 |
| Commission remorqueur | P1 |

## 21.3 Fonctionnalités MVP — Admin

| Fonctionnalité | Priorité |
| -------------- | -------- |
| Validation pro (KYC) | P0 |
| Suivi missions | P0 |
| Gestion utilisateurs | P0 |
| Paiements | P1 |
| Dashboard simple | P0 |

## 21.4 Fonctionnalités V2

| Fonctionnalité | Priorité |
| -------------- | -------- |
| Diagnostic IA avancé | V2 |
| Carnet d'entretien enrichi | V2 |
| Publicité intelligente | V2 |
| Fidélité / coupons | V2 |
| Chat intégré | V2 |
| Assistance flotte entreprise | V2 |
| Scoring qualité professionnel | V2 |
| Recommandation IA améliorée | V2 |

---

# 22. Planning projet

| Phase | Description | Durée estimée |
| ----- | ----------- | ------------- |
| **Phase 1 — Cadrage** | Finalisation besoins, priorisation MVP, parcours, règles métier | 2 semaines |
| **Phase 2 — UX/UI** | Benchmark, wireframes, maquettes HD, design system | 4 semaines |
| **Phase 3 — Développement MVP** | Mobile client, mobile pro, backend, admin | 12 à 16 semaines |
| **Phase 4 — Tests** | QA fonctionnelle, tests terrain, corrections | 3 semaines |
| **Phase 5 — Lancement pilote** | Lancement 1-2 villes, recrutement pros, retours | 4 semaines |
| **Phase 6 — Optimisation** | Amélioration matching, pricing, montée en charge | Continu |

**Durée totale estimée MVP :** 5 à 6 mois

---

# 23. KPI de succès

## 23.1 KPI acquisition

| KPI | Cible indicatif |
| --- | --------------- |
| Nombre d'utilisateurs inscrits | N+1 : 5 000 |
| Nombre de professionnels actifs | N+1 : 200 |
| Coût d'acquisition | À définir |

## 23.2 KPI opérationnels

| KPI | Cible |
| --- | ----- |
| Temps moyen pour trouver un pro | < 30 secondes |
| Taux d'acceptation des missions | > 85 % |
| Temps moyen d'arrivée | < 20 minutes |
| Taux de missions finalisées | > 90 % |

## 23.3 KPI business

| KPI | Description |
| --- | ----------- |
| Chiffre d'affaires | Revenus totaux |
| Revenus abonnements | Premium pros |
| Revenus commissions | Remorquage |
| Revenus publicitaires | Annonceurs |
| Panier moyen | Montant moyen par intervention |

## 23.4 KPI qualité

| KPI | Cible |
| --- | ----- |
| Note moyenne des pros | > 4.0 / 5 |
| Taux de réclamation | < 3 % |
| Taux de rétention (M+1) | > 60 % |
| Fréquence d'utilisation | > 1 intervention/mois/utilisateur |

---

# 24. Risques et mitigation

| Risque | Probabilité | Impact | Mitigation |
| ------ | ----------- | ------ | ---------- |
| Faible disponibilité initiale de professionnels | Élevée | Critique | Recrutement proactif, incitations, zone pilote réduite |
| Géolocalisation imprécise | Moyenne | Élevé | Utilisation de plusieurs sources GPS, calibration |
| Désaccords sur les prix | Moyenne | Élevé | Grille tarifaire claire, devis avant intervention |
| Manque de confiance envers les profils | Moyenne | Critique | Vérification KYC, notes, avis, support |
| Difficulté d'adoption digitale des artisans | Élevée | Moyen | Formation onboarding, interface simple, support |
| Gestion des urgences en temps réel | Faible | Critique | Architecture temps réel robuste, monitoring |

---

# 25. Questions à arbitrer

| Question | Options | Décision |
| -------- | ------- | -------- |
| Une seule app ou deux apps distinctes ? | App unique / Deux apps | À arbitrer |
| Paiement obligatoire dans l'app ou hybride ? | Intégré / Hybride | À arbitrer |
| Prix fixes, estimatifs ou devis systématique ? | Fixe / Estimatif / Devis | À arbitrer |
| Lancement dans quelle ville en premier ? | Abidjan / Autre | À arbitrer |
| Diagnostic IA inclus dans le MVP ou V2 ? | MVP / V2 | À arbitrer |
| Garage avec plusieurs employés connectés ? | Oui / Non | À arbitrer |
| Visibilité premium : meilleur classement ou fonctionnalités ? | Classement / Fonctionnalités | À arbitrer |
| Remorquage : course simple ou service complet type VTC ? | Simple / Complet | À arbitrer |

---

# 26. Livrables attendus

## 26.1 Livrables produit

| Livrable | Format |
| -------- | ------ |
| Cahier des charges validé | Document |
| Arborescence fonctionnelle | Diagramme |
| User flows | Diagramme |
| Wireframes | Maquettes basse définition |
| Maquettes UI | Maquettes haute définition |
| Design system | Guide de styles |
| Application mobile client | Code / APK |
| Application mobile pro | Code / APK |
| Back-office admin | Web |
| Documentation technique | Document |

## 26.2 Livrables business

| Livrable | Format |
| -------- | ------ |
| Grille tarifaire | Tableau |
| Modèle de revenus | Document |
| Politique de commission | Document |
| Stratégie d'acquisition partenaires | Document |

---

# 27. Critères de recette

Le projet sera considéré comme conforme si :

1. Un utilisateur peut s'inscrire sans friction (OTP + profil)
2. Il peut demander un mécanicien ou un remorqueur rapidement
3. Un professionnel peut recevoir et accepter une mission
4. Le suivi de mission fonctionne correctement (temps réel)
5. Le paiement est traçable (Mobile Money)
6. Le bouton SOS est opérationnel
7. L'historique des interventions est consultable
8. L'admin peut valider les professionnels et suivre l'activité

---

# 28. Glossaire

| Terme | Définition |
| ----- | ---------- |
| Back-office | Interface d'administration web pour l'équipe Mecanova |
| CDC | Cahier des charges |
| Commission | Pourcentage prélevé par la plateforme sur une mission |
| Devis | Document estimatif ou ferme du coût d'une intervention |
| ETA | Estimated Time of Arrival — temps d'arrivée estimé |
| KPI | Indicateur clé de performance |
| KYC | Know Your Customer — processus de vérification d'identité |
| Matching | Algorithme de mise en relation client-professionnel |
| Mobile Money | Service de paiement par téléphone mobile (Orange Money, MTN MoMo, Wave) |
| MVP | Minimum Viable Product — produit minimal viable |
| OTP | One-Time Password — code de vérification unique |
| Premium | Formule payante offrant des avantages aux professionnels |
| Remorquage | Service de transport d'un véhicule en panne |
| SOS PANNE | Fonction d'urgence permettant une mise en relation immédiate |
| Super app | Application mobile combinant plusieurs services |

---

*Document généré le 14 juin 2026 — Version 1.0*

**Mecanova** — Le mécanicien et le dépannage à portée de main
