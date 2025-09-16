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
import { ArrowLeft, Save, Bell } from 'lucide-react';
import { addEvent } from '@/lib/firestore';
import { CITIES } from '@/types';
import { toast } from 'sonner';

const eventSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  date: z.string().min(1, 'La date est requise'),
  time: z.string().min(1, 'L\'heure est requise'),
  location: z.string().min(1, 'Le lieu est requis'),
  city: z.string().min(1, 'La ville est requise'),
  image: z.string().optional(),
  contact: z.string().min(1, 'Le contact est requis'),
  price: z.number().min(0, 'Le prix doit être positif').optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      city: '',
      image: '',
      contact: '',
      price: undefined,
    }
  });

  const watchedCity = watch('city');

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);
    try {
      await addEvent({
        ...data,
        date: new Date(data.date),
        price: data.price || undefined,
      });
      
      toast.success('Événement ajouté avec succès !', {
        description: 'Une notification sera envoyée aux utilisateurs de l\'app mobile'
      });
      
      // Afficher une notification spéciale pour indiquer que l'événement déclenchera une notif
      toast.info('🔔 Notification programmée', {
        description: 'Les utilisateurs recevront une notification pour ce nouvel événement'
      });
      
      router.push('/dashboard/events');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout de l\'événement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/events">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouvel événement</h1>
          <p className="text-gray-600">Ajoutez un nouvel événement (déclenchera une notification mobile)</p>
        </div>
      </div>

      {/* Notification Alert */}
      <Card className="border-blue-200 bg-blue-50 mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-blue-800">
            <Bell className="h-5 w-5" />
            <p className="font-medium">
              Cet événement déclenchera automatiquement une notification push vers l'application mobile
            </p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'événement</CardTitle>
            <CardDescription>
              Détails généraux de l'événement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'événement *</Label>
                <Input
                  id="title"
                  placeholder="Festival de musique d'Agboville"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
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
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez l'événement en détail..."
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                />
                {errors.date && (
                  <p className="text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              {/* Heure */}
              <div className="space-y-2">
                <Label htmlFor="time">Heure *</Label>
                <Input
                  id="time"
                  type="time"
                  {...register('time')}
                />
                {errors.time && (
                  <p className="text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lieu */}
              <div className="space-y-2">
                <Label htmlFor="location">Lieu *</Label>
                <Input
                  id="location"
                  placeholder="Stade municipal d'Agboville"
                  {...register('location')}
                />
                {errors.location && (
                  <p className="text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              {/* Prix */}
              <div className="space-y-2">
                <Label htmlFor="price">Prix (FCFA) - Optionnel</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="5000"
                  {...register('price', { valueAsNumber: true })}
                />
                <p className="text-xs text-gray-500">Laissez vide si l'événement est gratuit</p>
                {errors.price && (
                  <p className="text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact et image */}
        <Card>
          <CardHeader>
            <CardTitle>Contact et image</CardTitle>
            <CardDescription>
              Informations de contact et image de l'événement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact */}
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

              {/* Image */}
              <div className="space-y-2">
                <Label htmlFor="image">Lien de l'image - Optionnel</Label>
                <Input
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  {...register('image')}
                />
                <p className="text-xs text-gray-500">
                  Lien vers une image hébergée en ligne
                </p>
              </div>
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
                    Ajouter l'événement
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/events">Annuler</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}