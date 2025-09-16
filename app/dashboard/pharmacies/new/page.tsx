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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import { addPharmacy } from '@/lib/firestore';
import { CITIES } from '@/types';
import { toast } from 'sonner';

const pharmacySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  address: z.string().min(1, 'L\'adresse est requise'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  city: z.string().min(1, 'La ville est requise'),
  isOnDuty: z.boolean(),
});

type PharmacyFormData = z.infer<typeof pharmacySchema>;

export default function NewPharmacyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PharmacyFormData>({
    resolver: zodResolver(pharmacySchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      city: '',
      isOnDuty: false,
    }
  });

  const watchedCity = watch('city');
  const watchedIsOnDuty = watch('isOnDuty');

  const onSubmit = async (data: PharmacyFormData) => {
    setLoading(true);
    try {
      await addPharmacy(data);
      toast.success('Pharmacie ajoutée avec succès !');
      router.push('/dashboard/pharmacies');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout de la pharmacie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/pharmacies">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle pharmacie</h1>
          <p className="text-gray-600">Ajoutez une nouvelle pharmacie au système</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de la pharmacie</CardTitle>
          <CardDescription>
            Remplissez tous les champs pour ajouter une nouvelle pharmacie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nom */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la pharmacie *</Label>
              <Input
                id="name"
                placeholder="Pharmacie Centrale"
                {...register('name')}
                error={errors.name?.message}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

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

            {/* Adresse */}
            <div className="space-y-2">
              <Label htmlFor="address">Adresse complète *</Label>
              <Input
                id="address"
                placeholder="123 Rue de la Paix, Quartier Centre"
                {...register('address')}
                error={errors.address?.message}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone *</Label>
              <Input
                id="phone"
                placeholder="+225 XX XX XX XX XX"
                {...register('phone')}
                error={errors.phone?.message}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Statut de garde */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="isOnDuty">Pharmacie de garde</Label>
                <p className="text-sm text-gray-500">
                  Activer si cette pharmacie est actuellement de garde
                </p>
              </div>
              <Switch
                id="isOnDuty"
                checked={watchedIsOnDuty}
                onCheckedChange={(checked) => setValue('isOnDuty', checked)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  'Ajout en cours...'
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Ajouter la pharmacie
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/pharmacies">Annuler</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}