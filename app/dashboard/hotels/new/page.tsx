'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Star, Plus, X } from 'lucide-react';
import { addHotel } from '@/lib/firestore';
import { CITIES, PRICE_RANGES, AMENITIES } from '@/types';
import { toast } from 'sonner';

const hotelSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  address: z.string().min(1, 'L\'adresse est requise'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  city: z.string().min(1, 'La ville est requise'),
  description: z.string().min(1, 'La description est requise'),
  rating: z.number().min(1).max(5),
  priceRange: z.string().min(1, 'La gamme de prix est requise'),
  amenities: z.array(z.string()),
});

type HotelFormData = z.infer<typeof hotelSchema>;

export default function NewHotelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      city: '',
      description: '',
      rating: 3,
      priceRange: '',
      amenities: [],
    }
  });

  const watchedCity = watch('city');
  const watchedPriceRange = watch('priceRange');
  const watchedRating = watch('rating');
  const watchedAmenities = watch('amenities');

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
  };

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    setImageUrls(newUrls);
  };

  const onSubmit = async (data: HotelFormData) => {
    setLoading(true);
    try {
      const validImageUrls = imageUrls.filter(url => url.trim() !== '');
      await addHotel({
        ...data,
        images: validImageUrls,
      });

      toast.success('Hôtel ajouté avec succès !');
      router.push('/dashboard/hotels');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout de l\'hôtel');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setValue('rating', i + 1)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/hotels">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouvel hôtel</h1>
          <p className="text-gray-600">Ajoutez un nouvel hôtel au système</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
            <CardDescription>
              Informations générales sur l'hôtel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'hôtel *</Label>
                <Input
                  id="name"
                  placeholder="Hôtel Ivoire Palace"
                  {...register('name')}
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
            </div>

            {/* Adresse */}
            <div className="space-y-2">
              <Label htmlFor="address">Adresse complète *</Label>
              <Input
                id="address"
                placeholder="123 Boulevard Principal, Quartier Résidentiel"
                {...register('address')}
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
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez les caractéristiques et services de l'hôtel..."
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Évaluation et prix */}
        <Card>
          <CardHeader>
            <CardTitle>Évaluation et tarification</CardTitle>
            <CardDescription>
              Note et gamme de prix de l'hôtel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rating */}
              <div className="space-y-2">
                <Label>Évaluation (étoiles) *</Label>
                <div className="space-y-2">
                  {renderStars(watchedRating)}
                  <p className="text-sm text-gray-500">{watchedRating} étoile(s)</p>
                </div>
              </div>

              {/* Gamme de prix */}
              <div className="space-y-2">
                <Label htmlFor="priceRange">Gamme de prix *</Label>
                <Select value={watchedPriceRange} onValueChange={(value) => setValue('priceRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une gamme" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_RANGES.map(range => (
                      <SelectItem key={range} value={range}>{range}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priceRange && (
                  <p className="text-sm text-red-600">{errors.priceRange.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services et équipements */}
        <Card>
          <CardHeader>
            <CardTitle>Services et équipements</CardTitle>
            <CardDescription>
              Sélectionnez les services disponibles dans l'hôtel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {AMENITIES.map(amenity => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Controller
                    name="amenities"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={amenity}
                        checked={field.value.includes(amenity)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, amenity]);
                          } else {
                            field.onChange(field.value.filter(a => a !== amenity));
                          }
                        }}
                      />
                    )}
                  />
                  <Label htmlFor={amenity} className="text-sm font-normal">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>
              Ajoutez des images de l'hôtel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  className="flex-1"
                />
                {imageUrls.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImageUrl(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addImageUrl}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une image
            </Button>
            <p className="text-xs text-gray-500">
              Ajoutez des liens vers des images hébergées en ligne (ex: Imgur, Google Drive, etc.)
            </p>
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
                    Ajouter l'hôtel
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/hotels">Annuler</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}