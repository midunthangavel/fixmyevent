'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Chrome, 
  Facebook, 
  Apple, 
  Mail, 
  ArrowLeft,
  Loader2
} from 'lucide-react';

export default function SocialAuthPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSocialAuth = async (provider: string) => {
    setLoading(provider);
    
    try {
      // TODO: Implement actual social authentication
      // await authService.signInWithProvider(provider);
      
      // Mock implementation for development
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({ 
        title: 'Authentication Successful', 
        description: `Signed in with ${provider} (Demo Mode)` 
      });
      
      // Redirect to role selection or home
      router.push('/role-selection');
      
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Authentication Failed', 
        description: `Failed to sign in with ${provider}` 
      });
    } finally {
      setLoading(null);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: Chrome,
      color: 'bg-red-600 hover:bg-red-700',
      description: 'Sign in with your Google account'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Sign in with your Facebook account'
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: Apple,
      color: 'bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100',
      description: 'Sign in with your Apple ID'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            onClick={handleBackToLogin}
            className="absolute left-4 top-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <CardTitle className="text-2xl">Choose Sign In Method</CardTitle>
          <CardDescription>
            Select your preferred way to sign in to FixMyEvent
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Social Authentication Options */}
          <div className="space-y-3">
            {socialProviders.map((provider) => {
              const IconComponent = provider.icon;
              const isLoading = loading === provider.id;
              
              return (
                <Button
                  key={provider.id}
                  onClick={() => handleSocialAuth(provider.id)}
                  disabled={isLoading}
                  className={`w-full ${provider.color} text-white`}
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  ) : (
                    <IconComponent className="w-5 h-5 mr-3" />
                  )}
                  {isLoading ? 'Signing in...' : `Continue with ${provider.name}`}
                </Button>
              );
            })}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Email Authentication Option */}
          <Button 
            variant="outline" 
            onClick={() => router.push('/login')}
            className="w-full"
            size="lg"
          >
            <Mail className="w-5 h-5 mr-3" />
            Sign in with Email
          </Button>

          {/* Sign Up Option */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </div>

          {/* Additional Information */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">Why use social authentication?</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Faster sign-in process</li>
              <li>• No need to remember another password</li>
              <li>• Enhanced security with two-factor authentication</li>
              <li>• Easy account recovery</li>
            </ul>
          </div>

          {/* Privacy Notice */}
          <div className="text-xs text-muted-foreground text-center">
            <p>
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
