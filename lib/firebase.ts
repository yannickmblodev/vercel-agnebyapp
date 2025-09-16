import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Vérifier que toutes les variables d'environnement sont définies
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0 && process.env.NODE_ENV !== 'development') {
  console.warn('⚠️  Variables d\'environnement Firebase manquantes:', missingEnvVars.join(', '));
  console.warn('📝 Veuillez créer un fichier .env.local avec vos clés Firebase pour activer l\'authentification.');
  console.warn('📖 Consultez le README.md pour les instructions de configuration.');
}

// Initialize Firebase
let app;
let auth;
let db;
let storage;

// Toujours initialiser Firebase si au moins l'API key est présente
if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  // Toutes les variables sont présentes, initialiser Firebase normalement
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  // Variables manquantes, créer des objets mock pour éviter les erreurs
  console.warn('🔥 Firebase non configuré - mode démo activé');
  app = null;
  auth = null as any;
  db = null as any;
  storage = null as any;
}

export { auth, db, storage };

export default app;