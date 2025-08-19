
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from '@/lib/firebase';
// import { doc, setDoc } from 'firebase/firestore';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'Passwords do not match' });
      return;
    }

    if (formData.password.length < 6) {
      toast({ variant: 'destructive', title: 'Error', description: 'Password must be at least 6 characters long' });
      return;
    }

    setLoading(true);

    try {
      // Commented out Firebase auth for development
      /*
      const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      const userProfile = {
        uid: result.user.uid,
        email: formData.email,
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        role: 'user',
        avatar: '',
        bio: '',
        preferences: {
          notifications: true,
          emailUpdates: true,
          marketing: false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', result.user.uid), userProfile);
      */
      
      // Mock signup for development
      toast({ title: 'Success', description: 'Account created successfully (Demo Mode)' });
      router.push('/role-selection');
      
    } catch (error: unknown) {
      let description = 'An unexpected error occurred. Please try again.';
      
      // Commented out Firebase error handling for development
      /*
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'auth/email-already-in-use') {
          description = 'An account with this email already exists.';
        } else if (error.code === 'auth/weak-password') {
          description = 'Password is too weak. Please choose a stronger password.';
        } else if (error.code === 'auth/invalid-email') {
          description = 'Please enter a valid email address.';
        }
      }
      if (error instanceof Error && error.message) {
        description = error.message;
      }
      */
      
      toast({ variant: 'destructive', title: 'Signup Failed', description });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Sign up to start planning your perfect event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                placeholder="Enter your full name"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
