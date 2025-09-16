'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Search, MapPin, Phone, Edit, Trash2, Star, Image } from 'lucide-react';
import { getHotels, deleteHotel } from '@/lib/firestore';
import { Hotel, CITIES, PRICE_RANGES } from '@/types';
import { toast } from 'sonner';

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');

  const fetchHotels = async () => {
    try {
      const data = await getHotels();
      setHotels(data);
      setFilteredHotels(data);
    } catch (error) {
      console.error('Erreur lors du chargement des hôtels:', error);
      toast.error('Erreur lors du chargement des hôtels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    let filtered = hotels;

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par ville
    if (selectedCity !== 'all') {
      filtered = filtered.filter(hotel => hotel.city === selectedCity);
    }

    // Filtrer par gamme de prix
    if (selectedPriceRange !== 'all') {
      filtered = filtered.filter(hotel => hotel.priceRange === selectedPriceRange);
    }

    setFilteredHotels(filtered);
  }, [hotels, searchTerm, selectedCity, selectedPriceRange]);

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteHotel(id);
      setHotels(prev => prev.filter(h => h.id !== id));
      toast.success(`Hôtel "${name}" supprimé avec succès`);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Hôtels</h1>
          <p className="text-gray-600">Gérez les hôtels et leurs informations</p>
        </div>
        <Link href="/dashboard/hotels/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un hôtel
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher par nom, description ou adresse..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Toutes les villes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {CITIES.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Toutes les gammes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les gammes</SelectItem>
                {PRICE_RANGES.map(range => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredHotels.length} hôtel(s) trouvé(s)
        </p>
      </div>

      {/* Hotels Grid */}
      {filteredHotels.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucun hôtel trouvé</p>
            <Link href="/dashboard/hotels/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter le premier hôtel
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredHotels.map((hotel) => (
            <Card key={hotel.id} className="hover:shadow-md transition-shadow overflow-hidden">
              {/* Image */}
              {hotel.images && hotel.images.length > 0 ? (
                <div className="h-48 bg-gray-100 relative">
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  {hotel.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Image className="h-3 w-3" />
                      {hotel.images.length}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <Image className="h-12 w-12 text-gray-400" />
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{hotel.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {hotel.city}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(hotel.rating)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{hotel.description}</p>
                  <p className="text-sm text-gray-600">{hotel.address}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {hotel.phone}
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {hotel.priceRange}
                  </Badge>
                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hotel.amenities.slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{hotel.amenities.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/dashboard/hotels/${hotel.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer l'hôtel "{hotel.name}" ?
                          Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(hotel.id!, hotel.name)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}