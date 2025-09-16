import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Pharmacy, Hotel, Product, Event, JobOffer, PublicService, Announcement } from '@/types';

// Vérifier si Firebase est configuré
const checkFirebaseConfig = () => {
  if (!db) {
    throw new Error('Firebase n\'est pas configuré. Veuillez configurer vos variables d\'environnement Firebase dans le fichier .env.local');
  }
};

// PHARMACIES
export const pharmaciesCollection = db ? collection(db, 'pharmacies') : null;

export const addPharmacy = async (pharmacy: Omit<Pharmacy, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    checkFirebaseConfig();
    const pharmacyData = {
      ...pharmacy,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(pharmaciesCollection!, pharmacyData);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la pharmacie:', error);
    throw error;
  }
};

export const getPharmacies = async () => {
  try {
    checkFirebaseConfig();
    const q = query(pharmaciesCollection!, orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Pharmacy[];
  } catch (error) {
    console.error('Erreur lors de la récupération des pharmacies:', error);
    throw error;
  }
};

export const getOnDutyPharmacies = async () => {
  try {
    checkFirebaseConfig();
    const q = query(
      pharmaciesCollection!,
      where('isOnDuty', '==', true)
    );
    const querySnapshot = await getDocs(q);
    const pharmacies = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Pharmacy[];
    
    return pharmacies.sort((a, b) => {
      if (a.city !== b.city) {
        return a.city.localeCompare(b.city);
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des pharmacies de garde:', error);
    throw error;
  }
};

export const updatePharmacy = async (id: string, updates: Partial<Omit<Pharmacy, 'id' | 'createdAt'>>) => {
  try {
    checkFirebaseConfig();
    const pharmacyRef = doc(db, 'pharmacies', id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(pharmacyRef, updateData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la pharmacie:', error);
    throw error;
  }
};

export const deletePharmacy = async (id: string) => {
  try {
    checkFirebaseConfig();
    await deleteDoc(doc(db, 'pharmacies', id));
  } catch (error) {
    console.error('Erreur lors de la suppression de la pharmacie:', error);
    throw error;
  }
};

export const togglePharmacyDutyStatus = async (id: string, isOnDuty: boolean) => {
  try {
    await updatePharmacy(id, { isOnDuty });
  } catch (error) {
    console.error('Erreur lors du changement du statut de garde:', error);
    throw error;
  }
};

// HOTELS
export const hotelsCollection = db ? collection(db, 'hotels') : null;

export const addHotel = async (hotel: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    checkFirebaseConfig();
    const hotelData = {
      ...hotel,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(hotelsCollection!, hotelData);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'hôtel:', error);
    throw error;
  }
};

export const getHotels = async () => {
  try {
    checkFirebaseConfig();
    const q = query(hotelsCollection!, orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Hotel[];
  } catch (error) {
    console.error('Erreur lors de la récupération des hôtels:', error);
    throw error;
  }
};

export const updateHotel = async (id: string, updates: Partial<Omit<Hotel, 'id' | 'createdAt'>>) => {
  try {
    checkFirebaseConfig();
    const hotelRef = doc(db, 'hotels', id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(hotelRef, updateData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'hôtel:', error);
    throw error;
  }
};

export const deleteHotel = async (id: string) => {
  try {
    checkFirebaseConfig();
    await deleteDoc(doc(db, 'hotels', id));
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'hôtel:', error);
    throw error;
  }
};

// PRODUCTS (MARKETPLACE)
export const productsCollection = db ? collection(db, 'products') : null;

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    checkFirebaseConfig();
    const productData = {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(productsCollection!, productData);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit:', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    checkFirebaseConfig();
    const q = query(productsCollection!, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Product[];
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
  try {
    checkFirebaseConfig();
    const productRef = doc(db, 'products', id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(productRef, updateData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    checkFirebaseConfig();
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    throw error;
  }
};

// EVENTS
export const eventsCollection = db ? collection(db, 'events') : null;

export const addEvent = async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    checkFirebaseConfig();
    const eventData = {
      ...event,
      date: Timestamp.fromDate(event.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(eventsCollection!, eventData);
    
    // Déclencher une notification pour le nouvel événement
    console.log('🔔 Notification: Nouvel événement ajouté -', event.title);
    // TODO: Intégrer avec Firebase Cloud Messaging pour l'app mobile
    
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'événement:', error);
    throw error;
  }
};

export const getEvents = async () => {
  try {
    checkFirebaseConfig();
    const q = query(eventsCollection!, orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Event[];
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    throw error;
  }
};

export const updateEvent = async (id: string, updates: Partial<Omit<Event, 'id' | 'createdAt'>>) => {
  try {
    checkFirebaseConfig();
    const eventRef = doc(db, 'events', id);
    const updateData = {
      ...updates,
      ...(updates.date && { date: Timestamp.fromDate(updates.date) }),
      updatedAt: Timestamp.now(),
    };
    await updateDoc(eventRef, updateData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    throw error;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    checkFirebaseConfig();
    await deleteDoc(doc(db, 'events', id));
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    throw error;
  }
};

// JOB OFFERS
export const jobOffersCollection = db ? collection(db, 'jobOffers') : null;

export const addJobOffer = async (jobOffer: Omit<JobOffer, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    checkFirebaseConfig();
    const jobOfferData = {
      ...jobOffer,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(jobOffersCollection!, jobOfferData);
    
    // Déclencher une notification pour la nouvelle offre d'emploi
    console.log('🔔 Notification: Nouvelle offre d\'emploi ajoutée -', jobOffer.title);
    // TODO: Intégrer avec Firebase Cloud Messaging pour l'app mobile
    
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'offre d\'emploi:', error);
    throw error;
  }
};

export const getJobOffers = async () => {
  try {
    checkFirebaseConfig();
    const q = query(jobOffersCollection!, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as JobOffer[];
  } catch (error) {
    console.error('Erreur lors de la récupération des offres d\'emploi:', error);
    throw error;
  }
};

export const updateJobOffer = async (id: string, updates: Partial<Omit<JobOffer, 'id' | 'createdAt'>>) => {
  try {
    checkFirebaseConfig();
    const jobOfferRef = doc(db, 'jobOffers', id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(jobOfferRef, updateData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'offre d\'emploi:', error);
    throw error;
  }
};

export const deleteJobOffer = async (id: string) => {
  try {
    checkFirebaseConfig();
    await deleteDoc(doc(db, 'jobOffers', id));
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'offre d\'emploi:', error);
    throw error;
  }
};

// PUBLIC SERVICES
export const publicServicesCollection = db ? collection(db, 'publicServices') : null;

export const addPublicService = async (publicService: Omit<PublicService, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    checkFirebaseConfig();
    const publicServiceData = {
      ...publicService,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(publicServicesCollection!, publicServiceData);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du service public:', error);
    throw error;
  }
};

export const getPublicServices = async () => {
  try {
    checkFirebaseConfig();
    const q = query(publicServicesCollection!, orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as PublicService[];
  } catch (error) {
    console.error('Erreur lors de la récupération des services publics:', error);
    console.error('Détails de l\'erreur Firebase:', JSON.stringify(error, null, 2));
    throw error;
  }
};

export const updatePublicService = async (id: string, updates: Partial<Omit<PublicService, 'id' | 'createdAt'>>) => {
  try {
    checkFirebaseConfig();
    const publicServiceRef = doc(db, 'publicServices', id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(publicServiceRef, updateData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du service public:', error);
    throw error;
  }
};

export const deletePublicService = async (id: string) => {
  try {
    checkFirebaseConfig();
    await deleteDoc(doc(db, 'publicServices', id));
  } catch (error) {
    console.error('Erreur lors de la suppression du service public:', error);
    throw error;
  }
};

// ANNOUNCEMENTS
export const announcementsCollection = db ? collection(db, 'announcements') : null;

export const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    checkFirebaseConfig();
    const announcementData = {
      ...announcement,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(announcementsCollection!, announcementData);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'annonce:', error);
    throw error;
  }
};

export const getAnnouncements = async () => {
  try {
    checkFirebaseConfig();
    const q = query(announcementsCollection!, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Announcement[];
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    throw error;
  }
};

export const updateAnnouncement = async (id: string, updates: Partial<Omit<Announcement, 'id' | 'createdAt'>>) => {
  try {
    checkFirebaseConfig();
    const announcementRef = doc(db, 'announcements', id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(announcementRef, updateData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'annonce:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string) => {
  try {
    checkFirebaseConfig();
    await deleteDoc(doc(db, 'announcements', id));
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'annonce:', error);
    throw error;
  }
};