'use client';

import { PageWrapper } from "@/components/shared/page-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Plus, 
  Calendar, 
 
  TrendingUp, 
  Star, 
  MessageSquare,
  Settings,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function VendorDashboardPage() {
  const { profile } = useAuth();

  // Mock data - in real app, fetch from API
  const stats = {
    totalListings: 3,
    activeBookings: 12,
    totalRevenue: 2840,
    averageRating: 4.8,
    totalReviews: 24,
    pendingMessages: 5
  };

  const recentBookings = [
    { id: '1', clientName: 'Sarah Johnson', service: 'Wedding Photography', date: '2024-02-15', status: 'confirmed' },
    { id: '2', clientName: 'Mike Chen', service: 'Corporate Event', date: '2024-02-20', status: 'pending' },
    { id: '3', clientName: 'Emma Davis', service: 'Birthday Party', date: '2024-02-25', status: 'confirmed' }
  ];

  const quickActions = [
    { title: 'Add New Listing', description: 'Create a new service listing', icon: Plus, href: '/add-listing', variant: 'default' as const },
    { title: 'View Bookings', description: 'Manage your appointments', icon: Calendar, href: '/bookings', variant: 'outline' as const },
    { title: 'Analytics', description: 'View business insights', icon: BarChart3, href: '#', variant: 'outline' as const },
    { title: 'Settings', description: 'Manage your business profile', icon: Settings, href: '/profile', variant: 'outline' as const }
  ];

  return (
    <PageWrapper
      icon={Store}
      title="Vendor Dashboard"
      description="Manage your business, track performance, and grow your client base."
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="w-5 h-5" />
              <span>Welcome back, {profile?.profile?.firstName || 'Vendor'}!</span>
            </CardTitle>
            <CardDescription>
              Here's what's happening with your business today.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Store className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalListings}</p>
                  <p className="text-sm text-muted-foreground">Active Listings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.activeBookings}</p>
                  <p className="text-sm text-muted-foreground">Active Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">${stats.totalRevenue}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.averageRating}</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <action.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Bookings</span>
              <Link href="/bookings">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>
              Your latest appointments and requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{booking.clientName}</h4>
                    <p className="text-sm text-muted-foreground">{booking.service}</p>
                    <p className="text-xs text-muted-foreground">{booking.date}</p>
                  </div>
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">New booking request from Emma Davis</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">5-star review received from Sarah Johnson</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Payment received for Corporate Event booking</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
