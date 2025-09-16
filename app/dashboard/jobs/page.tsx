'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Search, MapPin, Building, Edit, Trash2, MessageCircle, Phone, Euro } from 'lucide-react';
import { getJobOffers, deleteJobOffer } from '@/lib/firestore';
import { JobOffer, CITIES, JOB_TYPES } from '@/types';
import { toast } from 'sonner';

export default function JobsPage() {
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [filteredJobOffers, setFilteredJobOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const fetchJobOffers = async () => {
    try {
      const data = await getJobOffers();
      setJobOffers(data);
      setFilteredJobOffers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des offres d\'emploi:', error);
      toast.error('Erreur lors du chargement des offres d\'emploi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobOffers();
  }, []);

  useEffect(() => {
    let filtered = jobOffers;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity !== 'all') {
      filtered = filtered.filter(job => job.city === selectedCity);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    setFilteredJobOffers(filtered);
  }, [jobOffers, searchTerm, selectedCity, selectedType]);

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteJobOffer(id);
      setJobOffers(prev => prev.filter(j => j.id !== id));
      toast.success(`Offre d'emploi "${title}" supprimée avec succès`);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const isRecent = (createdAt: Date) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    return createdAt >= sevenDaysAgo;
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
          <h1 className="text-3xl font-bold text-gray-900">Offres d'emploi</h1>
          <p className="text-gray-600">Gérez les offres d'emploi disponibles</p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une offre
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
                  placeholder="Rechercher par titre, entreprise ou description..."
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
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {JOB_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredJobOffers.length} offre(s) d'emploi trouvée(s)
        </p>
      </div>

      {/* Job Offers Grid */}
      {filteredJobOffers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucune offre d'emploi trouvée</p>
            <Link href="/dashboard/jobs/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter la première offre
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobOffers.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Building className="h-4 w-4" />
                      {job.company}
                    </CardDescription>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {job.city}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline">
                      {job.type}
                    </Badge>
                    {isRecent(new Date(job.createdAt)) && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Nouveau
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{job.description}</p>
                  
                  {job.requirements && job.requirements.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Exigences :</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            {req}
                          </li>
                        ))}
                        {job.requirements.length > 3 && (
                          <li className="text-xs text-gray-500">
                            +{job.requirements.length - 3} autres exigences
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    {job.isWhatsApp ? (
                      <MessageCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Phone className="h-4 w-4" />
                    )}
                    {job.contact}
                    {job.isWhatsApp && (
                      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                        WhatsApp
                      </Badge>
                    )}
                  </div>

                  {job.salary && (
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                      <Euro className="h-4 w-4" />
                      {job.salary}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/dashboard/jobs/${job.id}/edit`}>
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
                          Êtes-vous sûr de vouloir supprimer l'offre d'emploi "{job.title}" ?
                          Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(job.id!, job.title)}
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