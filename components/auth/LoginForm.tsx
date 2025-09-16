'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();
  const router = useRouter();

  // Vérifier si Firebase est configuré
  const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your-api-key-here';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isFirebaseConfigured) {
      setError('Firebase n\'est pas configuré. Veuillez configurer vos variables d\'environnement.');
      setLoading(false);
      return;
    }

    try {
      await signIn(email, password);
      toast.success('Connexion réussie !');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      if (error.code === 'auth/user-not-found') {
        setError('Aucun utilisateur trouvé avec cet email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Mot de passe incorrect.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Adresse email invalide.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Trop de tentatives de connexion. Veuillez réessayer plus tard.');
      } else {
        setError('Erreur de connexion. Veuillez vérifier vos identifiants.');
      }
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            BackOffice Agneby Tiassa
          </CardTitle>
          <CardDescription>
            Connectez-vous pour accéder au tableau de bord
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isFirebaseConfigured && (
            <Alert className="mb-4">
              <AlertDescription>
                <strong>Configuration requise:</strong> Veuillez configurer Firebase en créant un fichier .env.local avec vos clés. 
                Consultez le README.md pour les instructions.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading || !isFirebaseConfigured}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading || !isFirebaseConfigured}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading || !isFirebaseConfigured}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                isFirebaseConfigured ? 'Se connecter' : 'Configuration requise'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}