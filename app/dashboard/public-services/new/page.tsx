'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { addPublicService } from '@/lib/firestore';
import { CITIES, PUBLIC_SERVICE_CATEGORIES } from '@/types';
import { toast } from 'sonner';

const publicServiceSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  address: z.string().min(1, 'L\'adresse est requise'),
  city: z.string().min(1, 'La ville est requise'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  latitude: z.number(),
  longitude: z.number(),
  category: z.string().min(1, 'La catégorie est requise'),
  openingHours: z.string().optional(),
});

type PublicServiceFormData = z.infer<typeof publicServiceSchema>;

export default function NewPublicServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PublicServiceFormData>({
    resolver: zodResolver(publicServiceSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      city: '',
      phone: '',
      email: '',
      latitude: 0,
      longitude: 0,
      category: '',
      openingHours: '',
    }
  });

  const watchedCity = watch('city');
  const watchedCategory = watch('category');

  const onSubmit = async (data: PublicServiceFormData) => {
    setLoading(true);
    try {
      await addPublicService({
        ...data,
        email: data.email || undefined,
        openingHours: data.openingHours || undefined,
      });
      toast.success('Service public ajouté avec succès !');
      router.push('/dashboard/public-services');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout du service public');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/public-services">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouveau service public</h1>
          <p className="text-gray-600">Ajoutez un nouveau service public</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du service</CardTitle>
            <CardDescription>
              Détails généraux du service public
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom du service *</Label>
                <Input
                  id="name"
                  placeholder="Mairie d'Agboville"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Catégorie */}
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={watchedCategory} onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {PUBLIC_SERVICE_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez les services proposés par cette institution..."
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ville */}
              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Select value={watchedCity} onValueChange={(value) => setValue('city', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              {/* Horaires */}
              <div className="space-y-2">
                <Label htmlFor="openingHours">Horaires d'ouverture</Label>
                <Input
                  id="openingHours"
                  placeholder="Lun-Ven: 8h-16h"
                  {...register('openingHours')}
                />
              </div>
            </div>

            {/* Adresse */}
            <div className="space-y-2">
              <Label htmlFor="address">Adresse complète *</Label>
              <Input
                id="address"
                placeholder="Avenue de la République, Centre-ville"
                {...register('address')}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
            <CardDescription>
              Comment contacter ce service public
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  placeholder="+225 XX XX XX XX XX"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@mairie-agboville.ci"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localisation */}
        <Card>
          <CardHeader>
            <CardTitle>Localisation GPS</CardTitle>
            <CardDescription>
              Coordonnées GPS pour la géolocalisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Latitude */}
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="5.9280"
                  {...register('latitude', { valueAsNumber: true })}
                />
                {errors.latitude && (
                  <p className="text-sm text-red-600">{errors.latitude.message}</p>
                )}
              </div>

              {/* Longitude */}
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="-4.2138"
                  {...register('longitude', { valueAsNumber: true })}
                />
                {errors.longitude && (
                  <p className="text-sm text-red-600">{errors.longitude.message}</p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Vous pouvez obtenir les coordonnées GPS sur Google Maps en cliquant droit sur l'emplacement
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  'Ajout en cours...'
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Ajouter le service
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/public-services">Annuler</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}