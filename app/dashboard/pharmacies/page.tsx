'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Search, MapPin, Phone, Edit, Trash2, Clock } from 'lucide-react';
import { getPharmacies, deletePharmacy, togglePharmacyDutyStatus } from '@/lib/firestore';
import { Pharmacy, CITIES } from '@/types';
import { toast } from 'sonner';

export default function PharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const fetchPharmacies = async () => {
    try {
      const data = await getPharmacies();
      setPharmacies(data);
      setFilteredPharmacies(data);
    } catch (error) {
      console.error('Erreur lors du chargement des pharmacies:', error);
      toast.error('Erreur lors du chargement des pharmacies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  useEffect(() => {
    let filtered = pharmacies;

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par ville
    if (selectedCity !== 'all') {
      filtered = filtered.filter(pharmacy => pharmacy.city === selectedCity);
    }

    // Filtrer par statut
    if (selectedStatus !== 'all') {
      const isOnDuty = selectedStatus === 'on-duty';
      filtered = filtered.filter(pharmacy => pharmacy.isOnDuty === isOnDuty);
    }

    setFilteredPharmacies(filtered);
  }, [pharmacies, searchTerm, selectedCity, selectedStatus]);

  const handleDelete = async (id: string, name: string) => {
    try {
      await deletePharmacy(id);
      setPharmacies(prev => prev.filter(p => p.id !== id));
      toast.success(`Pharmacie "${name}" supprimée avec succès`);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleDutyStatus = async (id: string, currentStatus: boolean, name: string) => {
    try {
      const newStatus = !currentStatus;
      await togglePharmacyDutyStatus(id, newStatus);
      setPharmacies(prev => prev.map(p => 
        p.id === id ? { ...p, isOnDuty: newStatus } : p
      ));
      toast.success(`Statut de "${name}" ${newStatus ? 'activé' : 'désactivé'}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Pharmacies</h1>
          <p className="text-gray-600">Gérez les pharmacies et leur statut de garde</p>
        </div>
        <Link href="/dashboard/pharmacies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une pharmacie
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
                  placeholder="Rechercher par nom ou adresse..."
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
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="on-duty">De garde</SelectItem>
                <SelectItem value="off-duty">Pas de garde</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredPharmacies.length} pharmacie(s) trouvée(s)
        </p>
      </div>

      {/* Pharmacies Grid */}
      {filteredPharmacies.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucune pharmacie trouvée</p>
            <Link href="/dashboard/pharmacies/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter la première pharmacie
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPharmacies.map((pharmacy) => (
            <Card key={pharmacy.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{pharmacy.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {pharmacy.city}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={pharmacy.isOnDuty ? "default" : "secondary"}
                    className={pharmacy.isOnDuty ? "bg-green-100 text-green-700" : ""}
                  >
                    {pharmacy.isOnDuty ? 'De garde' : 'Fermée'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">{pharmacy.address}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {pharmacy.phone}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleDutyStatus(pharmacy.id!, pharmacy.isOnDuty, pharmacy.name)}
                    className="flex-1"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {pharmacy.isOnDuty ? 'Retirer garde' : 'Mettre de garde'}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/pharmacies/${pharmacy.id}/edit`}>
                      <Edit className="h-4 w-4" />
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
                          Êtes-vous sûr de vouloir supprimer la pharmacie "{pharmacy.name}" ?
                          Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(pharmacy.id!, pharmacy.name)}
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