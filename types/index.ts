export interface Pharmacy {
  id?: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  isOnDuty: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hotel {
  id?: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  description: string;
  images: string[];
  rating: number;
  priceRange: string;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  contact: string;
  isWhatsApp: boolean;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id?: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  city: string;
  image?: string;
  contact: string;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobOffer {
  id?: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  salary?: string;
  type: string;
  city: string;
  contact: string;
  isWhatsApp: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicService {
  id?: string;
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  latitude: number;
  longitude: number;
  category: string;
  openingHours?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id?: string;
  title: string;
  description: string;
  category: string;
  contact: string;
  isWhatsApp: boolean;
  city: string;
  price?: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export const CITIES = [
  'Agboville',
  'Tiassalé',
  'Azaguié',
  'Sikensi',
  'Taabo',
  'Grand morié',
  'Yapo',
  'Aboudé'
] as const;

export type City = typeof CITIES[number];

export const PRICE_RANGES = [
  'Budget (< 15.000 FCFA)',
  'Moyen (15.000 - 35.000 FCFA)',
  'Premium (35.000 - 60.000 FCFA)',
  'Luxe (> 60.000 FCFA)'
] as const;

export type PriceRange = typeof PRICE_RANGES[number];

export const AMENITIES = [
  'WiFi gratuit',
  'Climatisation',
  'Parking',
  'Piscine',
  'Restaurant',
  'Bar',
  'Salle de sport',
  'Spa',
  'Room service',
  'Petit-déjeuner inclus',
  'Blanchisserie',
  'Réception 24h/24'
] as const;

export type Amenity = typeof AMENITIES[number];

export const PRODUCT_CATEGORIES = [
  'Électronique',
  'Mode & Vêtements',
  'Maison & Jardin',
  'Véhicules',
  'Immobilier',
  'Sport & Loisirs',
  'Livres & Médias',
  'Alimentation',
  'Santé & Beauté',
  'Autres'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

export const JOB_TYPES = [
  'CDI',
  'CDD',
  'Stage',
  'Freelance',
  'Temps partiel',
  'Saisonnier'
] as const;

export type JobType = typeof JOB_TYPES[number];

export const PUBLIC_SERVICE_CATEGORIES = [
  'Mairie',
  'Préfecture',
  'Hôpital',
  'École',
  'Police',
  'Pompiers',
  'Poste',
  'Banque',
  'Transport',
  'Autres'
] as const;

export type PublicServiceCategory = typeof PUBLIC_SERVICE_CATEGORIES[number];

export const ANNOUNCEMENT_CATEGORIES = [
  'Électricien',
  'Plombier',
  'Maçon',
  'Menuisier',
  'Peintre',
  'Mécanicien',
  'Informaticien',
  'Coiffeur',
  'Couturier',
  'Nettoyage',
  'Jardinage',
  'Autres'
] as const;

export type AnnouncementCategory = typeof ANNOUNCEMENT_CATEGORIES[number];