'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Store, Users, Building2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function RoleSelectionPage() {
  const [_selectedRole, setSelectedRole] = useState<'user' | 'vendor' | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { updateUserRole } = useAuth();

  const handleRoleSelection = async (role: 'user' | 'vendor') => {
    setSelectedRole(role);
    setLoading(true);

    try {
      // Update user role in context and database
      if (updateUserRole) {
        await updateUserRole(role);
      }

      // Redirect based on role
      if (role === 'user') {
        router.push('/home');
      } else {
        router.push('/vendor-dashboard');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to FixMyEvent!</CardTitle>
          <CardDescription className="text-lg">
            How would you like to use our platform?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Option */}
          <div className="border-2 rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer"
               onClick={() => handleRoleSelection('user')}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  I'm looking for services
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Find and book the perfect venues, photographers, caterers, and more for your events.
                </p>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Browse venues and services</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Book appointments and services</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Use AI planning tools</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Option */}
          <div className="border-2 rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer"
               onClick={() => handleRoleSelection('vendor')}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Store className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                  I provide business services
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  List your services, manage bookings, and grow your business with FixMyEvent.
                </p>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Create service listings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Manage bookings and clients</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Track business analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-14 text-lg"
              onClick={() => handleRoleSelection('user')}
              disabled={loading}
            >
              <Search className="w-5 h-5 mr-2" />
              Continue as User
            </Button>
            <Button
              size="lg"
              className="flex-1 h-14 text-lg"
              onClick={() => handleRoleSelection('vendor')}
              disabled={loading}
            >
              <Store className="w-5 h-5 mr-2" />
              Continue as Vendor
            </Button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Need to change your role later?</p>
                <p>You can always update your preferences in your profile settings.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
