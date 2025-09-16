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
import { ArrowLeft, Save, Plus, X, Bell } from 'lucide-react';
import { addJobOffer } from '@/lib/firestore';
import { CITIES, JOB_TYPES } from '@/types';
import { toast } from 'sonner';

const jobOfferSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  company: z.string().min(1, 'L\'entreprise est requise'),
  description: z.string().min(1, 'La description est requise'),
  requirements: z.array(z.string()),
  salary: z.string().optional(),
  type: z.string().min(1, 'Le type de contrat est requis'),
  city: z.string().min(1, 'La ville est requise'),
  contact: z.string().min(1, 'Le contact est requis'),
  isWhatsApp: z.boolean(),
});

type JobOfferFormData = z.infer<typeof jobOfferSchema>;

export default function NewJobOfferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<JobOfferFormData>({
    resolver: zodResolver(jobOfferSchema),
    defaultValues: {
      title: '',
      company: '',
      description: '',
      requirements: [],
      salary: '',
      type: '',
      city: '',
      contact: '',
      isWhatsApp: false,
    }
  });

  const watchedCity = watch('city');
  const watchedType = watch('type');
  const watchedIsWhatsApp = watch('isWhatsApp');

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    const newRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(newRequirements);
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const onSubmit = async (data: JobOfferFormData) => {
    setLoading(true);
    try {
      const validRequirements = requirements.filter(req => req.trim() !== '');
      await addJobOffer({
        ...data,
        requirements: validRequirements,
        salary: data.salary || undefined,
      });
      
      toast.success('Offre d\'emploi ajoutée avec succès !', {
        description: 'Une notification sera envoyée aux utilisateurs de l\'app mobile'
      });
      
      // Afficher une notification spéciale pour indiquer que l'offre déclenchera une notif
      toast.info('🔔 Notification programmée', {
        description: 'Les utilisateurs recevront une notification pour cette nouvelle offre d\'emploi'
      });
      
      router.push('/dashboard/jobs');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout de l\'offre d\'emploi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/jobs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle offre d'emploi</h1>
          <p className="text-gray-600">Ajoutez une nouvelle offre d'emploi (déclenchera une notification mobile)</p>
        </div>
      </div>

      {/* Notification Alert */}
      <Card className="border-green-200 bg-green-50 mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-green-800">
            <Bell className="h-5 w-5" />
            <p className="font-medium">
              Cette offre d'emploi déclenchera automatiquement une notification push vers l'application mobile
            </p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'offre</CardTitle>
            <CardDescription>
              Détails généraux de l'offre d'emploi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="title">Titre du poste *</Label>
                <Input
                  id="title"
                  placeholder="Développeur Web Full Stack"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Entreprise */}
              <div className="space-y-2">
                <Label htmlFor="company">Entreprise *</Label>
                <Input
                  id="company"
                  placeholder="TechCorp SARL"
                  {...register('company')}
                />
                {errors.company && (
                  <p className="text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type de contrat */}
              <div className="space-y-2">
                <Label htmlFor="type">Type de contrat *</Label>
                <Select value={watchedType} onValueChange={(value) => setValue('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type.message}</p>
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

              {/* Salaire */}
              <div className="space-y-2">
                <Label htmlFor="salary">Salaire - Optionnel</Label>
                <Input
                  id="salary"
                  placeholder="200.000 - 300.000 FCFA"
                  {...register('salary')}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description du poste *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez le poste, les missions, l'environnement de travail..."
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exigences */}
        <Card>
          <CardHeader>
            <CardTitle>Exigences et qualifications</CardTitle>
            <CardDescription>
              Listez les compétences et qualifications requises
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Ex: Maîtrise de React et Node.js"
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    className="flex-1"
                  />
                  {requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addRequirement}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une exigence
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
            <CardDescription>
              Comment les candidats peuvent postuler
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact *</Label>
              <Input
                id="contact"
                placeholder="+225 XX XX XX XX XX ou email@entreprise.com"
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
                    Ajouter l'offre d'emploi
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/jobs">Annuler</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}