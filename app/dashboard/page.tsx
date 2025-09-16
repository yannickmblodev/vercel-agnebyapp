'use client';

import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hospital, Building2, MapPin, Clock, ShoppingBag, Calendar, Briefcase, Megaphone, Bell } from 'lucide-react';
import { 
  getPharmacies, 
  getOnDutyPharmacies, 
  getHotels, 
  getProducts, 
  getEvents, 
  getJobOffers, 
  getPublicServices, 
  getAnnouncements 
} from '@/lib/firestore';
import { Pharmacy, Hotel, Product, Event, JobOffer, PublicService, Announcement } from '@/types';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [onDutyPharmacies, setOnDutyPharmacies] = useState<Pharmacy[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [publicServices, setPublicServices] = useState<PublicService[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          pharmaciesData, 
          onDutyData, 
          hotelsData, 
          productsData, 
          eventsData, 
          jobOffersData, 
          publicServicesData, 
          announcementsData
        ] = await Promise.all([
          getPharmacies(),
          getOnDutyPharmacies(),
          getHotels(),
          getProducts(),
          getEvents(),
          getJobOffers(),
          getPublicServices(),
          getAnnouncements(),
        ]);
        
        setPharmacies(pharmaciesData);
        setOnDutyPharmacies(onDutyData);
        setHotels(hotelsData);
        setProducts(productsData);
        setEvents(eventsData);
        setJobOffers(jobOffersData);
        setPublicServices(publicServicesData);
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculer les événements à venir (dans les 30 prochains jours)
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    return eventDate >= now && eventDate <= thirtyDaysFromNow;
  });

  // Calculer les offres d'emploi récentes (derniers 7 jours)
  const recentJobOffers = jobOffers.filter(job => {
    const jobDate = new Date(job.createdAt);
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    return jobDate >= sevenDaysAgo;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Vue d'ensemble de vos données</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <StatsCard
          title="Total Pharmacies"
          value={pharmacies.length}
          description="Pharmacies enregistrées"
          icon={Hospital}
        />
        <StatsCard
          title="Pharmacies de garde"
          value={onDutyPharmacies.length}
          description="Actuellement de garde"
          icon={Clock}
        />
        <StatsCard
          title="Total Hôtels"
          value={hotels.length}
          description="Hôtels enregistrés"
          icon={Building2}
        />
        <StatsCard
          title="Produits"
          value={products.length}
          description="Marketplace"
          icon={ShoppingBag}
        />
        <StatsCard
          title="Événements"
          value={upcomingEvents.length}
          description="À venir (30j)"
          icon={Calendar}
        />
        <StatsCard
          title="Offres d'emploi"
          value={recentJobOffers.length}
          description="Récentes (7j)"
          icon={Briefcase}
        />
        <StatsCard
          title="Services publics"
          value={publicServices.length}
          description="Enregistrés"
          icon={MapPin}
        />
        <StatsCard
          title="Annonces"
          value={announcements.length}
          description="Artisans"
          icon={Megaphone}
        />
        <StatsCard
          title="Villes couvertes"
          value={8}
          description="Agneby Tiassa"
          icon={Bell}
        />
      </div>

      {/* Notifications */}
      {(upcomingEvents.length > 0 || recentJobOffers.length > 0) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription className="text-blue-600">
              Activités récentes qui déclencheront des notifications mobiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">
                    {upcomingEvents.length} événement(s) à venir
                  </span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Notification programmée
                  </Badge>
                </div>
              )}
              {recentJobOffers.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">
                    {recentJobOffers.length} nouvelle(s) offre(s) d'emploi
                  </span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Notification envoyée
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* On Duty Pharmacies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Pharmacies de garde
            </CardTitle>
            <CardDescription>
              Pharmacies actuellement de garde
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {onDutyPharmacies.length === 0 ? (
                <p className="text-sm text-gray-500">Aucune pharmacie de garde actuellement</p>
              ) : (
                onDutyPharmacies.slice(0, 5).map((pharmacy) => (
                  <div key={pharmacy.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{pharmacy.name}</p>
                      <p className="text-xs text-gray-500">{pharmacy.city}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      De garde
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Hotels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Hôtels récents
            </CardTitle>
            <CardDescription>
              Derniers hôtels ajoutés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hotels.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun hôtel enregistré</p>
              ) : (
                hotels.slice(0, 5).map((hotel) => (
                  <div key={hotel.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{hotel.name}</p>
                      <p className="text-xs text-gray-500">{hotel.city}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-yellow-500">★</span>
                        <span className="text-xs text-gray-600">{hotel.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">{hotel.priceRange}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-purple-600" />
              Produits récents
            </CardTitle>
            <CardDescription>
              Derniers produits ajoutés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun produit enregistré</p>
              ) : (
                products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        {new Intl.NumberFormat('fr-FR').format(product.price)} FCFA
                      </p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}