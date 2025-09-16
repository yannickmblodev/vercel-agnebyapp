# Dashboard BackOffice - Pharmacies de Garde Agneby Tiassa

## 📱 À propos du projet

Ce dashboard sert de backoffice pour une application mobile de gestion des pharmacies de garde et des hôtels dans la région d'Agneby Tiassa (Agboville, Tiassalé, Azaguié, Sikensi, Taabo, Grand morié, Yapo, Aboudé).

## 🚀 Configuration Firebase

### 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Créer un projet"
3. Donnez un nom à votre projet (ex: "pharmacies-garde-agneby")
4. Suivez les étapes de création

### 2. Configurer l'authentification

1. Dans votre projet Firebase, allez dans **Authentication**
2. Cliquez sur **Get started**
3. Dans l'onglet **Sign-in method**, activez **Email/Password**
4. Créez votre premier utilisateur admin dans l'onglet **Users**

### 3. Configurer Firestore Database

1. Allez dans **Firestore Database**
2. Cliquez sur **Create database**
3. Choisissez **Start in production mode**
4. Sélectionnez la région (europe-west1 pour la France)

### 4. Configurer Storage

1. Allez dans **Storage**
2. Cliquez sur **Get started**
3. Utilisez les règles par défaut pour commencer

### 5. Obtenir la configuration

1. Allez dans **Project settings** (roue dentée)
2. Faites défiler jusqu'à **Your apps**
3. Cliquez sur **Web** (icône </>)
4. Enregistrez votre app avec un nom
5. Copiez la configuration qui s'affiche

### 6. Configuration dans votre projet

1. Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

2. Remplacez les valeurs par celles de votre configuration Firebase

### 7. Règles Firestore

Allez dans **Firestore Database > Rules** et remplacez par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les pharmacies
    match /pharmacies/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Règles pour les hôtels
    match /hotels/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Règles pour les événements
    match /events/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Règles pour les offres d'emploi
    match /jobOffers/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Règles pour le marketplace
    match /products/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Règles pour les services publics
    match /publicServices/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Règles pour les annonces
    match /announcements/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Règles pour les notifications
    match /notifications/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 8. Règles Storage

Allez dans **Storage > Rules** et remplacez par :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /hotels/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📦 Installation et démarrage

1. Clonez le projet
2. Installez les dépendances :
```bash
npm install
```

3. Configurez votre fichier `.env.local` (voir section Firebase)

4. Lancez le serveur de développement :
```bash
npm run dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000)

## 🏗️ Structure du projet

```
/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx (Login)
│   ├── dashboard/
│   │   ├── page.tsx (Dashboard principal)
│   │   ├── pharmacies/
│   │   │   ├── page.tsx (Liste des pharmacies)
│   │   │   └── new/page.tsx (Nouvelle pharmacie)
│   │   └── hotels/
│   │       ├── page.tsx (Liste des hôtels)
│   │       └── new/page.tsx (Nouvel hôtel)
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── pharmacies/
│   ├── hotels/
│   └── ui/
├── lib/
│   ├── firebase.ts (Configuration Firebase)
│   ├── firestore.ts (Fonctions Firestore)
│   └── utils.ts
└── types/
    └── index.ts (Types TypeScript)
```

## 👨‍💻 Utilisation

### 1. Connexion
- Utilisez votre email et mot de passe créés dans Firebase Auth
- Une fois connecté, vous accédez au dashboard principal

### 2. Gestion des pharmacies
- Ajoutez des pharmacies avec nom, adresse, téléphone, ville
- Marquez/démarquez le statut "de garde"
- Modifiez ou supprimez les pharmacies existantes

### 3. Gestion des hôtels
- Ajoutez des hôtels avec informations complètes
- Uploadez des images via Firebase Storage
- Gérez la liste des hôtels

## 🔧 Variables d'environnement

Créez un fichier `.env.local` avec ces variables :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 🚀 Déploiement

1. **Build du projet :**
```bash
npm run build
```

2. **Déploiement sur Vercel (recommandé) :**
```bash
vercel --prod
```

3. **N'oubliez pas de configurer les variables d'environnement sur votre plateforme de déploiement**

## 📱 Villes supportées

- Agboville
- Tiassalé
- Azaguié
- Sikensi
- Taabo
- Grand morié
- Yapo
- Aboudé

## 🎯 Fonctionnalités

- ✅ Authentification Firebase
- ✅ Dashboard administrateur
- ✅ CRUD Pharmacies
- ✅ Statut de garde
- ✅ CRUD Hôtels
- ✅ Upload d'images
- ✅ Interface responsive
- ✅ Protection des routes

## 🆘 Support

Si vous rencontrez des problèmes, vérifiez :
1. La configuration Firebase dans `.env.local`
2. Les règles Firestore et Storage
3. L'activation de l'authentification Email/Password
4. La création d'un utilisateur admin

Bon développement ! 🚀