# Mecanova — Maquette fonctionnelle des écrans

## Design System & Direction artistique « Apple »

|                    |                                     |
| ------------------ | ----------------------------------- |
| **Version**        | 1.0                                 |
| **Date**           | Juin 2026                           |
| **Style**          | Apple-like — minimaliste, premium, rassurant |

---

# Design System

## Palette

| Usage | Couleur | Hex |
| ----- | ------- | --- |
| Fond principal | Blanc | `#FFFFFF` |
| Fond secondaire | Gris clair | `#F5F5F7` |
| Texte principal | Noir | `#1D1D1F` |
| Texte secondaire | Gris | `#86868B` |
| Accent principal | Bleu Mecanova | `#007AFF` |
| Urgence / SOS | Rouge | `#FF3B30` |
| Succès | Vert | `#34C759` |
| Séparateurs | Gris ultra clair | `#E5E5EA` |

## Typographie

| Élément | Police | Poids | Taille |
| ------- | ------ | ----- | ------ |
| Titre écran | SF Pro (ou Inter) | Bold | 28px |
| Sous-titre | SF Pro | Semibold | 20px |
| Corps | SF Pro | Regular | 16px |
| Légende | SF Pro | Regular | 13px |
| Bouton | SF Pro | Semibold | 17px |

## Composants clés

| Composant | Règle |
| --------- | ----- |
| **Bouton principal** | Fond bleu, texte blanc, coins 14px, hauteur 50px |
| **Bouton SOS** | Fond rouge `#FF3B30`, icône alert, pleine largeur, pulsation légère |
| **Bouton secondaire** | Fond gris clair, texte bleu, coins 14px |
| **Carte** | Fond blanc, coins 16px, shadow douce (0 2px 12px rgba(0,0,0,0.08)) |
| **Input** | Bordure 1px `#E5E5EA`, coins 12px, padding 16px |
| **Navigation bar** | Translucide (blur), titre centré, bouton retour gauche |
| **Tab bar** | Fond blanc, icônes fines, 5 onglets max |
| **Liste** | Style iOS : séparateur pleine largeur, flèche de navigation |

---

# Application Client — Écrans

## FLOW 1 : Onboarding & Authentification

---

### EC-01 — Splash Screen

```
┌──────────────────────────────┐
│                              │
│                              │
│            [Logo]            │
│           Mecanova             │
│   Le mécanicien et le        │
│   dépannage à portée de main │
│                              │
│                              │
│                              │
│                              │
│      ──── Loading ────       │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Logo** | Icône épurée : lettrage Mecanova, monochrome, ou symbole stylisé (clé à molette + marqueur de carte, fin) |
| **Slogan** | En gris secondaire, taille 15px |
| **Fond** | Blanc, ou dégradé subtil bleu très clair vers blanc |
| **Animation** | Logo apparaît avec fade, slogan slide up doux |
| **Durée** | 2 secondes max, transition automatique vers EC-02 |
| **Style Apple** | Écran de démarrage sobre, pas de branding agressif |

---

### EC-02 — Onboarding (1/3)

```
┌──────────────────────────────┐
│                              │
│                              │
│      [Illustration 1]        │
│      Panne sur le bord       │
│      de la route             │
│                              │
│  Besoin d'un mécanicien ?    │
│                              │
│  Trouvez le bon professionnel │
│  à proximité en quelques     │
│  secondes.                   │
│                              │
│                              │
│    ─── ● ● ● ───            │
│                              │
│       [Suivant]              │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Illustration** | Dessin vectoriel minimaliste : voiture au bord de la route, tons doux (bleu/gris) |
| **Titre** | « Besoin d'un mécanicien ? » — Bold 28px |
| **Sous-titre** | Description courte — 16px, gris, 2 lignes max |
| **Dot indicators** | 3 dots, premier actif en bleu |
| **Bouton** | « Suivant » — bleu, coins arrondis |
| **Skip** | Optionnel : petit lien « Passer » en haut à droite |
| **Style Apple** | Illustration large en haut, texte centré, pagination discrète — comme iOS Setup Assistant |

---

### EC-03 — Onboarding (2/3)

```
┌──────────────────────────────┐
│                              │
│      [Illustration 2]        │
│      Mobile Money +          │
│      suivi temps réel        │
│                              │
│  Paiement sécurisé           │
│                              │
│  Payez directement depuis    │
│  l'application. Suivez votre │
│  intervention en temps réel. │
│                              │
│                              │
│    ─── ○ ● ○ ───            │
│                              │
│       [Suivant]              │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Illustration** | Téléphone + Mobile Money + carte avec itinéraire |
| **Titre** | « Paiement sécurisé » |
| **Style** | Même template que EC-02 |

---

### EC-04 — Onboarding (3/3)

```
┌──────────────────────────────┐
│                              │
│      [Illustration 3]        │
│      Bouton SOS rouge        │
│      + mécanicien souriant   │
│                              │
│  SOS Panne                   │
│                              │
│  Un problème urgent ?        │
│  Un bouton, un professionnel │
│  en moins de 30 secondes.   │
│                              │
│                              │
│    ─── ○ ○ ● ───            │
│                              │
│       [Commencer]            │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Bouton** | « Commencer » — mène à EC-05 (connexion) |
| **Onboarding** | Présenté uniquement à la première ouverture |

---

### EC-05 — Connexion (téléphone)

```
┌──────────────────────────────┐
│  ← Retour                    │
│                              │
│  Bienvenue                   │
│                              │
│  Entrez votre numéro de      │
│  téléphone                   │
│                              │
│  +225 [___ ___ ___ ___]     │
│                              │
│  Vous recevrez un code de    │
│  vérification par SMS.       │
│                              │
│                              │
│      [Continuer]             │
│                              │
│  ─────────────────────────   │
│  Déjà un compte ?            │
│  Connectez-vous              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Input** | Préfixe +225 fixe, champ téléphone en focus automatiquement |
| **Validation** | Format automatique : 01 23 45 67 89 |
| **Bouton** | Grisé tant que le numéro n'est pas valide (10 chiffres) |
| **Style Apple** | Grand titre, input centré, clavier numérique automatique — comme iOS FaceTime |

---

### EC-06 — Vérification OTP

```
┌──────────────────────────────┐
│  ← Retour                    │
│                              │
│  Code de vérification        │
│                              │
│  Entrez le code envoyé       │
│  au +225 01 23 45 67 89     │
│                              │
│  [_][_][_][_][_][_]         │
│                              │
│  Code reçu dans 0:32         │
│                              │
│  [Renvoyer le code]          │
│                              │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **OTP Input** | 6 cases individuelles, remplissage automatique, focus auto |
| **Timer** | Compte à rebours 60s, puis lien « Renvoyer » actif |
| **Auto-submit** | Quand les 6 chiffres sont saisis, validation automatique |
| **Style Apple** | Design OTP iOS natif — vibrations sur saisie, pas de bouton submit |

---

### EC-07 — Création du profil

```
┌──────────────────────────────┐
│                              │
│  Finalisons votre profil     │
│                              │
│  [Photo]                     │
│  Ajouter une photo           │
│                              │
│  Prénom                      │
│  [_____________________]    │
│                              │
│  Nom                         │
│  [_____________________]    │
│                              │
│  Ville                       │
│  [_____________________]    │
│  ▼ Abidjan                   │
│                              │
│  Email (optionnel)           │
│  [_____________________]    │
│                              │
│                              │
│      [Terminer]              │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Photo** | Cercle vide 80px, appui pour prendre ou choisir photo |
| **Ville** | Picker natif iOS avec villes de Côte d'Ivoire |
| **Email** | Champ optionnel, masqué par défaut, lien « Ajouter email » |
| **Style Apple** | Saisie type fiche contact iOS — propre, aéré, champs espacés |

---

### EC-08 — Ajout du véhicule

```
┌──────────────────────────────┐
│  ← Retour                    │
│                              │
│  Votre véhicule              │
│                              │
│  Marque                      │
│  [Toyota          ▼]        │
│                              │
│  Modèle                      │
│  [Corolla          ▼]       │
│                              │
│  Année                       │
│  [2021             ▼]       │
│                              │
│  Immatriculation             │
│  [AB-123-CD]                 │
│                              │
│                              │
│      [Ajouter]               │
│                              │
│  Passer cette étape          │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Picker** | Listes déroulantes avec recherche (marques populaires en tête) |
| **Immatriculation** | Format automatique AB-123-CD |
| **Passer** | Lien gris, l'utilisateur peut ajouter le véhicule plus tard |
| **Style Apple** | Picker wheel iOS, transition fluide |

---

## FLOW 2 : Accueil

---

### EC-09 — Accueil

```
┌──────────────────────────────┐
│  12:30                   📶🔋│
│                              │
│  Bonjour, Jean 👋            │
│  ████████████████████████    │
│                              │
│  [🚨 SOS PANNE]             │
│  ▶ Bouton rouge pleine lrg  │
│                              │
│  ┌──────────────────────┐   │
│  │  🔧 Mécanicien        │   │
│  │  ⚡ Dépannage urgence  │   │
│  │  🚛 Remorquage        │   │
│  │  🏪 Garages proches   │   │
│  └──────────────────────┘   │
│                              │
│  Proches de vous             │
│  ┌────┐ ┌────┐ ┌────┐      │
│  │ 🛵 │ │ 🛵 │ │ 🛵 │      │
│  │Kouamé│ │Diallo│ │Koné  │      │
│  │2km ⭐4.5│ │3km ⭐4.2│ │5km ⭐4.8│
│  └────┘ └────┘ └────┘      │
│                              │
│  [Accueil] [Services] [Act.]│
│  [Profil]                   │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Header** | Prénom + heure système (statut bar iOS) |
| **Bouton SOS** | Pleine largeur, rouge `#FF3B30`, icône 🚨 + texte « SOS PANNE », effet de pulsation subtile, coins 16px |
| **Grille services** | 4 icônes en grille 2×2, fond gris clair `#F5F5F7`, coins 12px |
| **Section pros** | Scroll horizontal, cartes avec photo, nom, distance, note |
| **Map** | Optionnel : mini-carte en arrière-plan de la section pros |
| **Tab bar** | 3-5 onglets en bas : Accueil, Services, Activité, Profil |
| **Style Apple** | Widgets type iOS Today View — cards, espaces, blur subtil |

---

## FLOW 3 : Mécanicien à domicile

---

### EC-10 — Service : Mécanicien à domicile (choix du problème)

```
┌──────────────────────────────┐
│  ← Services                  │
│                              │
│  🔧 Mécanicien à domicile   │
│                              │
│  Quel est le problème ?      │
│                              │
│  ┌────────────────────────┐ │
│  │ 🔧 Réparation sur place │ │
│  ├────────────────────────┤ │
│  │ 🛢️ Vidange / Entretien  │ │
│  ├────────────────────────┤ │
│  │ 📋 Diagnostic élec.    │ │
│  ├────────────────────────┤ │
│  │ ⚡ Électricité auto     │ │
│  ├────────────────────────┤ │
│  │ ❄️ Climatisation        │ │
│  └────────────────────────┘ │
│                              │
│  [Continuer]                 │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Liste** | Style iOS Settings : icône + label + flèche de navigation |
| **Sélection** | Radio bouton à droite de chaque ligne, ou tap sur la ligne |
| **Style Apple** | Liste Settings iOS — clean, séparateur pleine largeur, navigation push |

---

### EC-11 — Sélection du véhicule

```
┌──────────────────────────────┐
│  ← Problème                  │
│                              │
│  Pour quel véhicule ?        │
│                              │
│  ┌────────────────────────┐ │
│  │ 🚗 Toyota Corolla 2021 │ │
│  │ AB-123-CD              │ │
│  │ 45 000 km              │ │
│  └────────────────────────┘ │
│                              │
│  + Ajouter un autre véhicule │
│                              │
│                              │
│      [Continuer]             │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Carte véhicule** | Card sélectionnable, check bleu quand sélectionné |
| **Style Apple** | iOS payment card selection — carte visuelle, espacement |

---

### EC-12 — Description du problème

```
┌──────────────────────────────┐
│  ← Véhicule                  │
│                              │
│  Décrivez le problème        │
│                              │
│  Dites-nous ce qui se passe  │
│                              │
│  ┌────────────────────────┐ │
│  │                        │ │
│  │ "Le moteur fait un     │ │
│  │ bruit étrange quand    │ │
│  │ j'accélère..."         │ │
│  │                        │ │
│  │                  0/500 │ │
│  └────────────────────────┘ │
│                              │
│  Ajouter une photo           │
│  [📷 Prendre photo]          │
│                              │
│  [Continuer]                 │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Textarea** | Grande zone, placeholder indicatif, compteur 500 caractères |
| **Photo** | Un bouton pour prendre/choisir une photo, vignette une fois ajoutée |
| **Style Apple** | Champ notes iOS — large, aéré, espace pour écrire |

---

### EC-13 — Estimation

```
┌──────────────────────────────┐
│  ← Description               │
│                              │
│  Estimation                 │
│                              │
│  📍 Cocody, Angré           │
│                              │
│  💰 8 000 - 15 000 FCFA    │
│                              │
│  🕐 Arrivée estimée :       │
│  15 - 25 min                │
│                              │
│  ████████████████░░░░░░░    │
│  (barre de confiance)        │
│                              │
│  Le prix final sera confirmé │
│  par le professionnel       │
│                              │
│                              │
│  [Confirmer la demande]      │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Position** | Adresse détectée automatiquement |
| **Prix** | Fourchette haute + basse, en gras |
| **Barre confiance** | Visuelle : indique le niveau de précision de l'estimation |
| **Bouton** | « Confirmer la demande » — envoie la requête aux pros |
| **Style Apple** | Apple Wallet / Apple Pay — carte estimation avec blur, clean |

---

### EC-14 — Recherche de professionnel

```
┌──────────────────────────────┐
│                              │
│   🔧 Recherche en cours...   │
│                              │
│                              │
│      [Loading animation]     │
│                              │
│  Recherche d'un mécanicien   │
│  disponible dans votre zone  │
│                              │
│  ─────────────────────────   │
│                              │
│  🕐 3 professionnels         │
│  consultent votre demande    │
│                              │
│  Annuler                     │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Animation** | Cercle animé type iOS loading, ou animation de carte qui tourne |
| **Texte** | Statut en temps réel : « Recherche... » → « Professionnel trouvé ! » |
| **Son** | Son de notification quand un pro est trouvé |
| **Style Apple** | iOS FaceTime "Connecting..." — minimal, centré, élégant |

---

### EC-15 — Professionnel trouvé

```
┌──────────────────────────────┐
│  ← Annuler                   │
│                              │
│  ✅ Professionnel trouvé     │
│                              │
│  ┌────────────────────────┐ │
│  │                        │ │
│  │   [Photo pro 80px]     │ │
│  │                        │ │
│  │   Kouamé Frédéric      │ │
│  │   ⭐ 4.8 • 15 missions  │ │
│  │                        │ │
│  │   🛵 ETA : 12 min      │ │
│  │   📍 Distance : 2.5 km │ │
│  │                        │ │
│  └────────────────────────┘ │
│                              │
│  [📞 Appeler]  [Suivre]     │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Carte pro** | Photo, nom, note, nombre missions, ETA, distance |
| **Boutons** | Appeler (lien téléphone) + Suivre (carte) |
| **Style Apple** | iOS Contact Card — photo large, infos clean |

---

## FLOW 4 : Suivi de mission

---

### EC-16 — Suivi en temps réel (carte)

```
┌──────────────────────────────┐
│  ← Retour                    │
│                              │
│  🔧 Mission en cours         │
│                              │
│  ┌────────────────────────┐ │
│  │                        │ │
│  │       [Carte]          │ │
│  │   ● Client             │ │
│  │   ──── itinéraire ───  │ │
│  │   ■ Professionnel      │ │
│  │                        │ │
│  └────────────────────────┘ │
│                              │
│  🛵 Kouamé arrive dans      │
│  8 min                      │
│                              │
│  [📞 Appeler]  [💬 Message] │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Carte** | Pleine largeur, centrée sur la zone |
| **Marqueurs** | Client (bleu), Professionnel (vert, animé, se déplace) |
| **ETA** | Barre en bas de carte, mise à jour en temps réel |
| **Boutons** | Appel direct + Message (simple, texte) |
| **Style Apple** | Apple Maps — carte fullscreen, bottom sheet avec infos, blur |

---

### EC-17 — Arrivée du professionnel

```
┌──────────────────────────────┐
│                              │
│  ✅ Le professionnel est     │
│  arrivé !                   │
│                              │
│  ┌────────────────────────┐ │
│  │   [Photo pro]          │ │
│  │   Kouamé Frédéric      │ │
│  └────────────────────────┘ │
│                              │
│  L'intervention peut         │
│  commencer                   │
│                              │
│  [Confirmer début]           │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Notification visuelle** | Confirmation que le pro est sur place |
| **Bouton** | « Confirmer début » → change le statut côté pro |
| **Style Apple** | iOS notification de livraison Uber — grande carte, confirmation |

---

### EC-18 — Fin d'intervention

```
┌──────────────────────────────┐
│                              │
│  ✅ Intervention terminée    │
│                              │
│  ┌────────────────────────┐ │
│  │ 🔧 Réparation          │ │
│  │ 🚗 Toyota Corolla      │ │
│  │ 📍 Cocody, Angré       │ │
│  │ 🕐 Durée : 45 min      │ │
│  └────────────────────────┘ │
│                              │
│  Montant : 12 000 FCFA      │
│                              │
│  ─────────────────────────   │
│  Le professionnel prépare    │
│  votre facture...            │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Récapitulatif** | Service, véhicule, lieu, durée |
| **Montant** | En attente de confirmation pro |
| **Style Apple** | Apple Pay confirmation — carte récap, transition vers paiement |

---

## FLOW 5 : Paiement

---

### EC-19 — Paiement Mobile Money

```
┌──────────────────────────────┐
│  ← Retour                    │
│                              │
│  Paiement                    │
│                              │
│  ┌────────────────────────┐ │
│  │ Intervention terminée  │ │
│  │                        │ │
│  │ Montant : 12 000 FCFA  │ │
│  │ Commission Mecanova :    │ │
│  │ 500 FCFA               │ │
│  │ ──────────────────     │ │
│  │ Total : 12 500 FCFA    │ │
│  └────────────────────────┘ │
│                              │
│  Choisissez votre moyen      │
│  de paiement                  │
│                              │
│  ┌────────────────────────┐ │
│  │ 📱 Orange Money    >  │ │
│  ├────────────────────────┤ │
│  │ 📱 MTN MoMo        >  │ │
│  ├────────────────────────┤ │
│  │ 📱 Wave             >  │ │
│  ├────────────────────────┤ │
│  │ 💵 Espèces          >  │ │
│  └────────────────────────┘ │
│                              │
│  [Payer 12 500 FCFA]        │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Récapitulatif** | Card avec détail montant + commission plateforme |
| **Liste paiements** | Logos des opérateurs Mobile Money |
| **Bouton** | Pleine largeur, bleu, montant inclus |
| **Style Apple** | Apple Pay sheet — fond blanc, bottom sheet, blur, Touch ID / Face ID (V2) |

---

### EC-20 — Paiement réussi

```
┌──────────────────────────────┐
│                              │
│                              │
│          ✅                   │
│                              │
│  Paiement confirmé           │
│                              │
│  12 500 FCFA                 │
│  Orange Money                │
│                              │
│  Réf : MCI-2024-06-14-XXXX  │
│                              │
│  Un reçu vous a été envoyé   │
│  par SMS                     │
│                              │
│  [Noter le professionnel]    │
│                              │
│  Retour à l'accueil          │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Animation** | Check vert animé, haptique succès |
| **Référence** | Numéro de transaction unique |
| **Bouton** | « Noter le professionnel » — mène à EC-21 |
| **Style Apple** | Apple Pay success — large checkmark, feedback haptique |

---

## FLOW 6 : Avis

---

### EC-21 — Notation

```
┌──────────────────────────────┐
│  ← Retour                    │
│                              │
│  Notez votre intervention    │
│                              │
│  ┌────────────────────────┐ │
│  │   [Photo pro]          │ │
│  │   Kouamé Frédéric      │ │
│  └────────────────────────┘ │
│                              │
│  Comment s'est passée        │
│  l'intervention ?            │
│                              │
│  ★ ★ ★ ★ ☆                   │
│                              │
│  Tapez votre avis...         │
│  [________________________] │
│                              │
│                              │
│  [Publier mon avis]          │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Étoiles** | 5 étoiles, tap pour noter, animation de remplissage |
| **Commentaire** | Champ texte optionnel |
| **Bouton** | « Publier mon avis » |
| **Style Apple** | iOS App Store review — 5 stars, bottom sheet, rapide |

---

## FLOW 7 : SOS PANNE

---

### EC-22 — SOS PANNE (déclenchement)

```
┌──────────────────────────────┐
│                              │
│                              │
│    🚨                        │
│                              │
│  SOS PANNE                   │
│                              │
│  Demande d'urgence envoyée   │
│                              │
│  📍 Position détectée        │
│  Cocody, Angré               │
│                              │
│  ─────────────────────────   │
│                              │
│  🔍 Recherche du meilleur    │
│  professionnel...            │
│                              │
│  [Annuler]                   │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Fond** | Fond rouge léger ou animation d'urgence |
| **Texte** | « Demande d'urgence envoyée » — rassurant |
| **Loading** | Rapide — max 15 secondes avant résultat |
| **Style Apple** | Urgence médicale iOS — grand texte, pas de distractions |

---

### EC-23 — SOS PANNE (résultat)

```
┌──────────────────────────────┐
│  🚨 SOS ACTIF                │
│                              │
│  Professionnels disponibles  │
│                              │
│  ┌────────────────────────┐ │
│  │ 🛵 MÉCANICIEN          │ │
│  │ Kouamé Frédéric        │ │
│  │ ⭐ 4.8 • 2.5 km        │ │
│  │ 🕐 ETA : 10 min        │ │
│  │ 💰 5 000 - 8 000 FCFA  │ │
│  │ [✅ Accepter]           │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │ 🚛 REMORQUEUR          │ │
│  │ Diallo Moussa          │ │
│  │ ⭐ 4.5 • 4 km          │ │
│  │ 🕐 ETA : 18 min        │ │
│  │ 💰 15 000 - 20 000 FCFA│ │
│  │ [✅ Accepter]           │ │
│  └────────────────────────┘ │
│                              │
│  [Annuler la demande]        │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Header** | SOS ACTIF — rouge, persistent |
| **Deux options** | Mécanicien + remorqueur, cartes séparées |
| **CTA** | Accepter immédiatement — pas d'étape intermédiaire |
| **Style Apple** | iOS App Store purchase card — deux cartes empilées, CTA fort |

---

## FLOW 8 : Remorquage

---

### EC-24 — Remorquage (destination)

```
┌──────────────────────────────┐
│  ← Services                  │
│                              │
│  🚛 Remorquage               │
│                              │
│  Point de départ             │
│  📍 Cocody, Angré            │
│  [Modifier]                  │
│                              │
│  Destination                 │
│  [_____________________]    │
│  📍 Ou choisir sur la carte  │
│                              │
│  Véhicule                    │
│  🚗 Toyota Corolla 2021     │
│                              │
│                              │
│  [Estimer le prix]           │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Départ** | Détection automatique GPS |
| **Destination** | Champ adresse ou sélection carte |
| **Véhicule** | Pré-sélectionné |
| **Style Apple** | iOS Maps trajet — deux champs adresse, carte mini |

---

### EC-25 — Remorquage (estimation)

```
┌──────────────────────────────┐
│  ← Retour                    │
│                              │
│  Estimation remorquage       │
│                              │
│  📍 Départ : Cocody          │
│  📍 Arrivée : Plateau        │
│  📏 Distance : 12 km         │
│                              │
│  💰 18 000 - 25 000 FCFA    │
│                              │
│  Inclus :                    │
│  ✓ Prise en charge          │
│  ✓ Transport 12 km          │
│  ✓ Assistance conducteur    │
│                              │
│  [Confirmer la demande]      │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Détails** | Départ, arrivée, distance |
| **Prix** | Fourchette estimative |
| **Inclus** | Liste des prestations incluses |
| **Style Apple** | iOS Travel estimate — carte récap, détails inclus |

---

## FLOW 9 : Garages

---

### EC-26 — Recherche de garages

```
┌──────────────────────────────┐
│  ← Accueil                   │
│                              │
│  🔍 [Rechercher un garage]   │
│                              │
│  █▓▒░ Filtres ░▒▓█          │
│  Spécialité   Note   Dist.  │
│                              │
│  ┌────────────────────────┐ │
│  │🏪 Garage Central Auto  │ │
│  │⭐⭐⭐⭐☆ 4.2 • 1.2 km    │ │
│  │🔧 Vidange, Climatisation│ │
│  │🕐 Ouvert • 08h-18h     │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │🏪 Garage Frères Koffi  │ │
│  │⭐⭐⭐⭐⭐ 4.9 • 2.8 km   │ │
│  │🔧 Mécanique générale   │ │
│  │🕐 Ouvert • 24h/24      │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │🏪 Auto Plus Abidjan    │ │
│  │⭐⭐⭐☆ 3.5 • 0.8 km     │ │
│  │🔧 Carrosserie, Peinture│ │
│  │🕐 Fermé • 08h-18h      │ │
│  └────────────────────────┘ │
│                              │
│  [Carte]                     │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Search** | Barre de recherche en haut |
| **Filtres** | Chips déroulants : spécialité, note minimale, distance max |
| **Liste** | Cartes garage avec infos clés |
| **Toggle** | Bouton basculer entre liste et carte |
| **Style Apple** | iOS App Store search + Maps list — clean, filtres en chips |

---

### EC-27 — Fiche garage

```
┌──────────────────────────────┐
│  ← Recherche                 │
│                              │
│  🏪 Garage Central Auto      │
│                              │
│  ⭐ 4.2 • 120 interventions   │
│                              │
│  [📞 Appeler]  [📍 GPS]      │
│  [📅 Prendre RDV]            │
│                              │
│  ─────────────────────────   │
│                              │
│  📍 Rue Prince, Cocody       │
│  🕐 Lun-Sam : 08h-18h       │
│     Dim : Fermé              │
│  💰 Vidange : 15 000 FCFA   │
│     Révision : 35 000 FCFA  │
│                              │
│  Spécialités                 │
│  🔧 Vidange • Freinage •    │
│    Climatisation • Moteur   │
│                              │
│  Photos [3+]                 │
│  ┌──┐ ┌──┐ ┌──┐            │
│  │  │ │  │ │  │            │
│  └──┘ └──┘ └──┘            │
│                              │
│  Avis récents                │
│  ┌────────────────────────┐ │
│  │ "Très bon garage,      │ │
│  │  travail rapide" — Jean│ │
│  └────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Header** | Nom, note, interventions |
| **Actions** | Appeler, GPS, Prendre RDV — 3 boutons |
| **Infos** | Adresse, horaires, prix indicatifs |
| **Spécialités** | Tags/chips |
| **Photos** | Scroll horizontal |
| **Avis** | Extraits récents |
| **Style Apple** | iOS Business/Place card — Apple Maps fiche lieu |

---

## FLOW 10 : Profil & Historique

---

### EC-28 — Profil

```
┌──────────────────────────────┐
│                              │
│  Profil                      │
│                              │
│  [Photo]                     │
│  Jean Kouamé                 │
│  +225 01 23 45 67 89        │
│  Abidjan, Cocody            │
│                              │
│  ─────────────────────────   │
│                              │
│  🚗 Mes véhicules          │
│  Toyota Corolla 2021    >  │
│  AB-123-CD                  │
│  + Ajouter un véhicule      │
│                              │
│  ─────────────────────────   │
│                              │
│  📋 Mes interventions    > │
│  💳 Mes paiements        > │
│  ⚙️ Paramètres           > │
│  ❓ Aide et support       > │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Photo** | Rond, modifiable |
| **Infos** | Nom, téléphone, ville |
| **Liste** | Style iOS Settings — avec flèches de navigation |
| **Style Apple** | iOS Settings / App Store account — clean, sections séparées |

---

### EC-29 — Mes interventions (historique)

```
┌──────────────────────────────┐
│  ← Profil                    │
│                              │
│  Mes interventions           │
│                              │
│  [Toutes] [En cours]         │
│                              │
│  ┌────────────────────────┐ │
│  │ ✅ 14 Juin 2026        │ │
│  │ 🔧 Dépannage urgence   │ │
│  │ 🛵 Kouamé Frédéric     │ │
│  │ 💰 12 500 FCFA         │ │
│  │ ⭐⭐⭐⭐⭐                │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │ ✅ 10 Juin 2026        │ │
│  │ 🛢️ Vidange            │ │
│  │ 🏪 Garage Central Auto │ │
│  │ 💰 15 000 FCFA         │ │
│  │ ⭐⭐⭐⭐☆                │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │ ✅ 2 Juin 2026         │ │
│  │ 🚛 Remorquage          │ │
│  │ 🛵 Diallo Moussa       │ │
│  │ 💰 22 000 FCFA         │ │
│  │ ⭐⭐⭐⭐⭐                │ │
│  └────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Filtres** | Segments : Toutes / En cours |
| **Cartes** | Date, type service, professionnel, montant, note |
| **Tap** | Ouvre le détail de l'intervention |
| **Style Apple** | iOS Wallet transaction history — cards, timeline |

---

### EC-30 — Paramètres

```
┌──────────────────────────────┐
│  ← Profil                    │
│                              │
│  Paramètres                  │
│                              │
│  ─── COMPTE ───             │
│  Informations personnelles   │
│  Changer de numéro          │
│  Langue : Français        > │
│                              │
│  ─── NOTIFICATIONS ───     │
│  Notifications push    [ON] │
│  SMS                    [ON] │
│                              │
│  ─── À PROPOS ───          │
│  Conditions d'utilisation   │
│  Politique de confidentialité│
│  Version 1.0.0              │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Sections** | Compte / Notifications / À propos |
| **Toggles** | Switches iOS natifs |
| **Style Apple** | iOS Settings — sections groupées, switches, navigation |

---

# Application Professionnel — Écrans

## FLOW 11 : Authentification pro

---

### EC-P01 — Connexion pro

```
┌──────────────────────────────┐
│                              │
│  Espace professionnel        │
│                              │
│  Vous êtes mécanicien,       │
│  remorqueur ou garage ?      │
│                              │
│  Entrez votre numéro         │
│                              │
│  +225 [___ ___ ___ ___]     │
│                              │
│  [Continuer]                 │
│                              │
│  ─────────────────────────   │
│                              │
│  Vous êtes un client ?       │
│  [Application client]        │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Distinction** | Design différent de l'app client — fond bleu clair |
| **Texte** | « Espace professionnel » en header |
| **Lien** | Basculer vers app client |

---

### EC-P02 — Onboarding pro (KYC step 1)

```
┌──────────────────────────────┐
│  ← Retour                    │
│                              │
│  Devenir partenaire Mecanova   │
│                              │
│  Étape 1/3 : Votre profil    │
│                              │
│  Vous êtes ?                 │
│  [🔧 Mécanicien          ▼] │
│                              │
│  Nom du garage / structure   │
│  [_____________________]    │
│                              │
│  Spécialités                 │
│  [☑ Moteur] [☑ Vidange]    │
│  [☐ Climatisation]          │
│  [☐ Électricité]           │
│                              │
│  Téléphone                   │
│  +225 [________________]    │
│                              │
│  [Suivant]                   │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Stepper** | 1/3, 2/3, 3/3 en haut |
| **Type** | Picker : Mécanicien / Remorqueur / Garage |
| **Spécialités** | Chips sélectionnables |
| **Style Apple** | iOS Setup Assistant — progress steps, champs simples |

---

### EC-P03 — Onboarding pro (KYC step 2)

```
┌──────────────────────────────┐
│  ← Retour                    │
│                              │
│  Étape 2/3 : Documents       │
│                              │
│  Pièce d'identité *          │
│  [📄 Ajouter un fichier]     │
│  (CNI ou passeport)          │
│                              │
│  Photo de profil *           │
│  [📷 Prendre une photo]      │
│                              │
│  Photo atelier / véhicule    │
│  [📷 Ajouter une photo]      │
│  (optionnel mais recommandé) │
│                              │
│  Numéro Mobile Money *       │
│  [___ ___ ___ ___]          │
│                              │
│  [Suivant]                   │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Upload** | Boutons ajout fichier, vignettes quand ajoutés |
| **Obligatoire** | Marqué * |
| **Style Apple** | iOS document scanner — upload propre, progression |

---

### EC-P04 — Onboarding pro (KYC step 3)

```
┌──────────────────────────────┐
│  ← Retour                    │
│                              │
│  Étape 3/3 : Zone            │
│  d'intervention              │
│                              │
│  Zone de couverture          │
│                              │
│  ┌────────────────────────┐ │
│  │                        │ │
│  │       [Carte]          │ │
│  │   Définissez votre     │ │
│  │   zone d'intervention  │ │
│  │                        │ │
│  └────────────────────────┘ │
│                              │
│  Horaires d'ouverture        │
│  Lun-Ven : 08h - 18h        │
│  Sam : 09h - 14h            │
│  Dim : Fermé                │
│                              │
│  [Terminer l'inscription]    │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Carte** | Sélection de zone (cercle de rayon ajustable) |
| **Horaires** | Picker jour par jour |
| **Bouton** | Soumet pour validation admin |

---

### EC-P05 — En attente de validation

```
┌──────────────────────────────┐
│                              │
│                              │
│    ⏳                        │
│                              │
│  Inscription envoyée         │
│                              │
│  Votre demande est en cours  │
│  de validation par l'équipe │
│  Mecanova.                     │
│                              │
│  Vous serez notifié dès      │
│  votre compte activé.        │
│                              │
│  Délai moyen : 24-48h       │
│                              │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Statut** | Sablier animé |
| **Texte** | Rassurant, délai indiqué |
| **Notification** | Push + SMS à l'activation |

---

## FLOW 12 : Accueil pro

---

### EC-P06 — Accueil pro

```
┌──────────────────────────────┐
│                              │
│  🔧 Garage Central Auto     │
│                              │
│  🟢 Disponible   [Hors ligne]│
│                              │
│  ─────────────────────────   │
│                              │
│  📋 Nouvelles demandes (3)  │
│                              │
│  ┌────────────────────────┐ │
│  │ 🚨 URGENT • 0 min      │ │
│  │ 🔧 Dépannage batterie  │ │
│  │ 📍 Cocody • 2.5 km     │ │
│  │ 👤 Jean K.             │ │
│  │ [✅ Accepter] [❌]     │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │ 🔧 Mécanicien à dom.   │ │
│  │ 🛢️ Vidange             │ │
│  │ 📍 Marcory • 5 km      │ │
│  │ 👤 Marie D.            │ │
│  │ [✅ Accepter] [❌]     │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │ 🔧 Diagnostic élec.   │ │
│  │ 📍 Plateau • 3 km      │ │
│  │ 👤 Paul A.             │ │
│  │ [✅ Accepter] [❌]     │ │
│  └────────────────────────┘ │
│                              │
│  [Accueil] [Missions] [Rev.]│
│  [Profil]                   │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Header** | Nom + switch disponibilité |
| **Demandes** | Card par demande : priorité, service, distance, client |
| **SOS** | Demande urgente marquée 🚨, placée en tête |
| **CTA** | Accepter / Refuser directement |
| **Tab bar** | Accueil, Missions, Revenus, Profil |
| **Style Apple** | iOS Mail inbox + Apple Pay — cartes empilées, actions rapides |

---

## FLOW 13 : Mission en cours (pro)

---

### EC-P07 — Mission en cours (pro)

```
┌──────────────────────────────┐
│  ← Retour                    │
│                              │
│  🔧 Mission en cours         │
│                              │
│  Client : Jean K.            │
│  📞 +225 01 23 45 67 89     │
│  📍 Cocody, Angré           │
│                              │
│  Problème : batterie         │
│  déchargée                   │
│                              │
│  ┌────────────────────────┐ │
│  │                        │ │
│  │       [Carte]          │ │
│  │   ● Client             │ │
│  │   ─── 2.5 km ───       │ │
│  │   ■ Vous               │ │
│  │                        │ │
│  └────────────────────────┘ │
│                              │
│  [📞 Appeler le client]      │
│                              │
│  Statut mission              │
│  🟢 En route                 │
│  ⬜ Arrivé                   │
│  ⬜ Terminé                  │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Infos client** | Nom, téléphone, adresse, problème |
| **Carte** | Itinéraire client → pro |
| **Bouton appel** | Appel direct |
| **Statut** | 3 étapes : En route → Arrivé → Terminé |
| **Style Apple** | iOS navigation — carte, étapes, appel |

---

### EC-P08 — Fin de mission (pro)

```
┌──────────────────────────────┐
│  ← Retour                    │
│                              │
│  ✅ Mission terminée          │
│                              │
│  Récapitulatif               │
│                              │
│  Client : Jean K.            │
│  Service : Dépannage batterie│
│  Durée : 35 min              │
│  Distance : 2.5 km          │
│                              │
│  Montant facturé             │
│  [12 000] FCFA               │
│                              │
│  Commission Mecanova (10%)     │
│  1 200 FCFA                 │
│  ─────────────────           │
│  Net : 10 800 FCFA          │
│                              │
│  [Confirmer et envoyer]      │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Récapitulatif** | Client, service, durée, distance |
| **Montant** | Champ éditable (le pro peut ajuster) |
| **Commission** | Calculée automatiquement |
| **Bouton** | « Confirmer et envoyer » → envoie la facture au client |
| **Style Apple** | iOS payment terminal — récap, montant, commission |

---

## FLOW 14 : Revenus & Historique (pro)

---

### EC-P09 — Revenus

```
┌──────────────────────────────┐
│                              │
│  Mes revenus                 │
│                              │
│  ┌────────────────────────┐ │
│  │  ✅ 1 250 000 FCFA     │ │
│  │  Ce mois-ci            │ │
│  │                        │ │
│  │  ┌────┐ ┌────┐ ┌────┐│ │
│  │  │Juin│ │Mai │ │Avr ││ │
│  │  │1.2M│ │0.8M│ │0.9M││ │
│  │  └────┘ └────┘ └────┘│ │
│  └────────────────────────┘ │
│                              │
│  Missions aujourd'hui : 3   │
│  En cours : 1               │
│                              │
│  ─── Dernières missions ─── │
│  ┌────────────────────────┐ │
│  │ 14/06 • Dépannage      │ │
│  │ Jean K. • 10 800 FCFA  │ │
│  └────────────────────────┘ │
│  ┌────────────────────────┐ │
│  │ 14/06 • Vidange        │ │
│  │ Marie D. • 14 000 FCFA │ │
│  └────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

| Élément | Description |
| ------- | ----------- |
| **Chiffre** | Gros montant mensuel |
| **Mini graphique** | Barres des 3 derniers mois |
| **Stats** | Missions aujourd'hui, en cours |
| **Liste** | Dernières missions avec montant net |
| **Style Apple** | iOS Health / Wallet — gros chiffre, graph, timeline |

---

# Back-office Admin — Écrans (web)

---

### EC-A01 — Dashboard admin

```
┌─────────────────────────────────────────────────┐
│  Mecanova Admin                         👤 Admin  │
│                                                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│  │ 📊   │ │ 👥   │ │ 🔧  │ │ 💰  │           │
│  │ 1 250 │ │ 48   │ │ 12  │ │ 2.5M│           │
│  │ Utils │ │ Pros │ │ Miss │ │ CA   │           │
│  └──────┘ └──────┘ └──────┘ └──────┘           │
│                                                   │
│  ─── Missions en cours ───                       │
│  ┌───────────────────────────────────────┐       │
│  │ 🔧 Dépannage • Cocody • 💰 12 000    │       │
│  │ 👤 Jean K. → 🛵 Kouamé • 🕐 8 min    │       │
│  └───────────────────────────────────────┘       │
│                                                   │
│  ─── Validations en attente (5) ───              │
│  ┌───────────────────────────────────────┐       │
│  │ 🔧 Kouamé Frédéric • Cocody          │       │
│  │ 📄 CNI + Photo • Attente 2h          │       │
│  │ [✅ Valider] [❌ Refuser] [👁️ Voir]  │       │
│  └───────────────────────────────────────┘       │
│                                                   │
│  Menu : Dashboard | Utilisateurs | Pros          │
│  | Missions | Paiements | Contenu                │
└─────────────────────────────────────────────────┘
```

---

### EC-A02 — Validation KYC pro

```
┌─────────────────────────────────────────────────┐
│  ← Pros • Validation KYC                        │
│                                                   │
│  🔧 Kouamé Frédéric                              │
│  📞 +225 01 23 45 67 89                          │
│  🔧 Mécanicien • Cocody                         │
│                                                   │
│  ─── Documents fournis ───                       │
│                                                   │
│  📄 Pièce d'identité                             │
│  ┌──────────────────────┐   [✅ Vérifié]         │
│  │  [Aperçu CNI]        │                         │
│  └──────────────────────┘                         │
│                                                   │
│  📷 Photo profil                                 │
│  ┌──────────────────────┐   [✅ Vérifié]         │
│  │  [Photo]             │                         │
│  └──────────────────────┘                         │
│                                                   │
│  💳 Mobile Money : 01 23 45 67 89               │
│                                                   │
│  ──────────────────────────────────              │
│                                                   │
│  [✅ Valider le professionnel]                    │
│  [❌ Refuser]                    [💬 Contacter]   │
│                                                   │
└─────────────────────────────────────────────────┘
```

---

# Annexes

## Navigation globale — Application client

```
                  ┌─────────────┐
                  │  Splash EC-01│
                  └──────┬──────┘
                         │
                  ┌──────▼──────┐
                  │ Onboarding  │  (1ère fois)
                  │ EC-02~04    │
                  └──────┬──────┘
                         │
                  ┌──────▼──────┐
                  │ Connexion   │
                  │ EC-05~06   │
                  └──────┬──────┘
                         │
                  ┌──────▼──────┐
                  │ Profil +    │
                  │ Véhicule    │
                  │ EC-07~08   │
                  └──────┬──────┘
                         │
              ┌──────────▼──────────┐
              │      Accueil        │
              │      EC-09          │
              └────┬──────┬────┬────┘
                   │      │    │
       ┌───────────┘      │    └──────────────┐
       ▼                  ▼                   ▼
  ┌──────────┐     ┌──────────┐       ┌──────────┐
  │Mécanicien│     │ SOS PANNE│       │Remorquage│
  │EC-10~15  │     │EC-22~23  │       │EC-24~25  │
  └────┬─────┘     └────┬─────┘       └────┬─────┘
       │                │                  │
       ▼                ▼                  ▼
  ┌──────────┐     ┌──────────┐       ┌──────────┐
  │ Suivi    │     │  Suivi   │       │  Suivi   │
  │EC-16~18 │     │ EC-16~18 │       │ EC-16~18 │
  └────┬─────┘     └────┬─────┘       └────┬─────┘
       │                │                  │
       ▼                ▼                  ▼
  ┌──────────┐     ┌──────────┐       ┌──────────┐
  │Paiement  │     │Paiement  │       │Paiement  │
  │EC-19~20  │     │EC-19~20  │       │EC-19~20  │
  └────┬─────┘     └────┬─────┘       └────┬─────┘
       │                │                  │
       ▼                ▼                  ▼
  ┌──────────┐     ┌──────────┐       ┌──────────┐
  │  Note    │     │  Note    │       │  Note    │
  │ EC-21   │     │ EC-21   │       │ EC-21   │
  └──────────┘     └──────────┘       └──────────┘
       │
       └──→ Retour Accueil

  Autres flows :
  Garages    → EC-26 → EC-27
  Profil     → EC-28 → EC-29 (Historique)
                     → EC-30 (Paramètres)
```

## Navigation — Application pro

```
                  ┌─────────────┐
                  │ Connexion   │
                  │ EC-P01      │
                  └──────┬──────┘
                         │
                  ┌──────▼──────┐
                  │  Onboarding │  (1ère fois)
                  │  KYC        │
                  │ EC-P02~04  │
                  └──────┬──────┘
                         │
                  ┌──────▼──────┐
                  │ Attente     │
                  │ validation  │
                  │ EC-P05      │
                  └──────┬──────┘
                         │ (après validation)
                  ┌──────▼──────┐
                  │  Accueil    │
                  │  EC-P06     │
                  └──────┬──────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │ Mission  │ │ Revenus  │ │ Profil   │
       │ EC-P07   │ │ EC-P09   │ │          │
       └────┬─────┘ └──────────┘ └──────────┘
            ▼
       ┌──────────┐
       │ Fin      │
       │ EC-P08   │
       └──────────┘
```

---

*Document généré le 14 juin 2026 — Version 1.0*

**Mecanova** — Le mécanicien et le dépannage à portée de main
