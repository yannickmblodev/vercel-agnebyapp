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
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import { addAnnouncement } from '@/lib/firestore';
import { CITIES, ANNOUNCEMENT_CATEGORIES } from '@/types';
import { toast } from 'sonner';

const announcementSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  category: z.string().min(1, 'La catégorie est requise'),
  contact: z.string().min(1, 'Le contact est requis'),
  isWhatsApp: z.boolean(),
  city: z.string().min(1, 'La ville est requise'),
  price: z.number().min(0, 'Le prix doit être positif').optional(),
  image: z.string().optional(),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      contact: '',
      isWhatsApp: false,
      city: '',
      price: undefined,
      image: '',
    }
  });

  const watchedCity = watch('city');
  const watchedCategory = watch('category');
  const watchedIsWhatsApp = watch('isWhatsApp');

  const onSubmit = async (data: AnnouncementFormData) => {
    setLoading(true);
    try {
      await addAnnouncement({
        ...data,
        price: data.price || undefined,
      });
      toast.success('Annonce ajoutée avec succès !');
      router.push('/dashboard/announcements');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout de l\'annonce');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/announcements">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle annonce</h1>
          <p className="text-gray-600">Ajoutez une nouvelle annonce d'artisan</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'annonce</CardTitle>
            <CardDescription>
              Détails du service proposé par l'artisan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce *</Label>
                <Input
                  id="title"
                  placeholder="Électricien professionnel"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
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
                    {ANNOUNCEMENT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
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

              {/* Prix */}
              <div className="space-y-2">
                <Label htmlFor="price">Prix (FCFA) - Optionnel</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="15000"
                  {...register('price', { valueAsNumber: true })}
                />
                <p className="text-xs text-gray-500">Laissez vide si le prix est à négocier</p>
                {errors.price && (
                  <p className="text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description du service *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez les services proposés, votre expérience, vos spécialités..."
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Lien de l'image - Optionnel</Label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                {...register('image')}
              />
              <p className="text-xs text-gray-500">
                Lien vers une image de vos réalisations
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
            <CardDescription>
              Comment les clients peuvent vous contacter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact *</Label>
              <Input
                id="contact"
                placeholder="+225 XX XX XX XX XX"
                {...register('contact')}
              />
              {errors.contact && (
                <p className="text-sm text-red-600">{errors.contact.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="isWhatsApp">WhatsApp disponible</Label>
                <p className="text-sm text-gray-500">
                  Activer si ce contact est disponible sur WhatsApp
                </p>
              </div>
              <Switch
                id="isWhatsApp"
                checked={watchedIsWhatsApp}
                onCheckedChange={(checked) => setValue('isWhatsApp', checked)}
              />
            </div>
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
                    Ajouter l'annonce
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/announcements">Annuler</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}