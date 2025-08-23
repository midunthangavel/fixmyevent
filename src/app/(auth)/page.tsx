'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { 
  Mail, 
  Chrome, 
  Facebook, 
  Apple, 
  UserPlus, 
  LogIn, 
  Shield,
  ArrowRight,
  Users,
  Calendar,
  Star
} from 'lucide-react';

export default function AuthLandingPage() {
  const router = useRouter();

  const authOptions = [
    {
      id: 'email',
      title: 'Email & Password',
      description: 'Sign in or create an account using your email address',
      icon: Mail,
      primary: true,
      href: '/login'
    },
    {
      id: 'google',
      title: 'Continue with Google',
      description: 'Quick and secure sign-in with your Google account',
      icon: Chrome,
      color: 'bg-red-600 hover:bg-red-700',
      href: '/social-auth'
    },
    {
      id: 'facebook',
      title: 'Continue with Facebook',
      description: 'Sign in using your Facebook account',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      href: '/social-auth'
    },
    {
      id: 'apple',
      title: 'Continue with Apple',
      description: 'Sign in securely with your Apple ID',
      icon: Apple,
      color: 'bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100',
      href: '/social-auth'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with multi-factor authentication'
    },
    {
      icon: Users,
      title: 'Role-Based Access',
      description: 'Different experiences for users and vendors'
    },
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Plan and manage events with powerful tools'
    },
    {
      icon: Star,
      title: 'AI-Powered Planning',
      description: 'Get intelligent suggestions for your events'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Welcome to FixMyEvent
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            The ultimate platform for event planning, venue booking, and service management. 
            Join thousands of users who trust us for their events.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Authentication Options */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Get Started</CardTitle>
                <CardDescription>
                  Choose your preferred way to access FixMyEvent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {authOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isPrimary = option.primary;
                  
                  return (
                    <Button
                      key={option.id}
                      onClick={() => router.push(option.href)}
                      className={`w-full ${option.color || ''} ${isPrimary ? 'bg-primary hover:bg-primary/90' : ''}`}
                      size="lg"
                      variant={isPrimary ? 'default' : 'outline'}
                    >
                      <IconComponent className="w-5 h-5 mr-3" />
                      {option.title}
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => router.push('/login')}>
                  <LogIn className="w-4 h-4 mr-2" />
                  I already have an account
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push('/signup')}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create a new account
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features and Information */}
          <div className="space-y-6">
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Why Choose FixMyEvent?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature) => {
                    const IconComponent = feature.icon;
                    return (
                      <div key={feature.title} className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{feature.title}</h4>
                          <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Demo Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Try Demo Mode</CardTitle>
                <CardDescription>
                  Experience FixMyEvent without creating an account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Demo Credentials</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Email:</span> demo@fixmyevent.com
                    </div>
                    <div>
                      <span className="font-medium">Password:</span> demo123
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/login')}
                >
                  Try Demo Mode
                </Button>
              </CardContent>
            </Card>

            {/* Help and Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Need Help?</CardTitle>
                <CardDescription>
                  We're here to help you get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/help">
                    <Shield className="w-4 h-4 mr-2" />
                    Security & Privacy
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Ready to start planning your next event?
          </p>
          <Button size="lg" onClick={() => router.push('/signup')}>
            Get Started Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
