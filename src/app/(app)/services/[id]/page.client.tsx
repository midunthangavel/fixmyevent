'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  Clock, 
  DollarSign,
  Heart,
  Share2,
  MessageSquare
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { BookingForm } from '@/components/bookings/booking-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Listing } from '@/types/listing';

interface ServiceDetailClientProps {
  listing: Listing;
}

export function ServiceDetailClient({ listing }: ServiceDetailClientProps) {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleBookingSuccess = (_bookingId: string) => {
    setShowBookingForm(false);
    toast({
      title: 'Booking Successful!',
      description: 'Your booking has been created. Check your bookings page for updates.',
    });
  };

  const handleFavorite = () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'Please log in to add services to favorites.',
      });
      return;
    }
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      description: isFavorite ? 'Service removed from your favorites.' : 'Service added to your favorites.',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.name,
          text: `Check out this amazing ${listing.category.toLowerCase()} service: ${listing.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'Service link has been copied to clipboard.',
      });
    }
  };

  const renderCategorySpecificInfo = () => {
    switch (listing.category) {
      case 'Venue':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Capacity:</span>
              <span className="font-medium">{listing.guestCapacity || 'N/A'} guests</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Setup Time:</span>
              <span className="font-medium">2 hours</span>
            </div>
          </div>
        );

      case 'Catering':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Serves:</span>
              <span className="font-medium">{listing.guestCapacity || 'N/A'} guests</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Per Person:</span>
              <span className="font-medium">${listing.priceValue || 'N/A'}</span>
            </div>
          </div>
        );

      case 'Photography':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Coverage:</span>
              <span className="font-medium">4-8 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Starting:</span>
              <span className="font-medium">${listing.priceValue || 'N/A'}</span>
            </div>
          </div>
        );

      case 'Transport':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Capacity:</span>
              <span className="font-medium">4-8 passengers</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Service:</span>
              <span className="font-medium">24/7</span>
            </div>
          </div>
        );

      case 'Decorations':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Setup:</span>
              <span className="font-medium">2-4 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Starting:</span>
              <span className="font-medium">${listing.priceValue || 'N/A'}</span>
            </div>
          </div>
        );

      case 'Legal':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Response:</span>
              <span className="font-medium">24-48 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Consultation:</span>
              <span className="font-medium">${listing.priceValue || 'N/A'}</span>
            </div>
          </div>
        );

      case 'Music':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Performance:</span>
              <span className="font-medium">2-4 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Starting:</span>
              <span className="font-medium">${listing.priceValue || 'N/A'}</span>
            </div>
          </div>
        );

      case 'Invitations':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Min Order:</span>
              <span className="font-medium">100 pieces</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Delivery:</span>
              <span className="font-medium">5-7 days</span>
            </div>
          </div>
        );

      case 'Planner':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Planning:</span>
              <span className="font-medium">3-6 months</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Starting:</span>
              <span className="font-medium">${listing.priceValue || 'N/A'}</span>
            </div>
          </div>
        );

      case 'Event Staff':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Available:</span>
              <span className="font-medium">10+ staff</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Shifts:</span>
              <span className="font-medium">4-8 hours</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 w-full">
        <Image
          src={listing.image || '/images/placeholder.jpg'}
          alt={listing.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <Badge variant="secondary" className="mb-2">
              {listing.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{listing.name}</h1>
            <div className="flex items-center gap-4 text-lg">
              <div className="flex items-center gap-1">
                <MapPin className="w-5 h-5" />
                <span>{listing.location || 'Location not specified'}</span>
              </div>
              {listing.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>{listing.rating} ({listing.reviewCount || 0} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
                <DialogTrigger asChild>
                  <Button size="lg" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Book {listing.name}</DialogTitle>
                  </DialogHeader>
                  <BookingForm 
                    listing={listing} 
                    onSuccess={handleBookingSuccess}
                    onCancel={() => setShowBookingForm(false)}
                  />
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="lg" onClick={handleFavorite}>
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'Favorited' : 'Favorite'}
              </Button>

              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button variant="outline" size="lg">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>

            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle>About This Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {listing.description}
                </p>
                
                <Separator />
                
                {/* Category-specific information */}
                {renderCategorySpecificInfo()}
              </CardContent>
            </Card>

            {/* Tabs for additional information */}
            <Card>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Service Category</h4>
                      <p className="text-muted-foreground">{listing.category}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Price Range</h4>
                      <p className="text-muted-foreground">{listing.price || 'Contact for pricing'}</p>
                    </div>
                    {listing.guestCapacity && (
                      <div>
                        <h4 className="font-semibold mb-2">Capacity</h4>
                        <p className="text-muted-foreground">{listing.guestCapacity} guests</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold mb-2">Location</h4>
                      <p className="text-muted-foreground">{listing.location || 'Contact for details'}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-4">
                  {listing.reviews && listing.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {listing.reviews.map((review, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              by {review.authorName}
                            </span>
                          </div>
                          <p className="text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No reviews yet. Be the first to review this service!</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="location" className="space-y-4">
                  <div className="text-center py-8">
                    <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h4 className="font-semibold mb-2">Service Location</h4>
                    <p className="text-muted-foreground mb-4">
                      {listing.location || 'Location details not available'}
                    </p>
                    <Button variant="outline">
                      <MapPin className="w-4 h-4 mr-2" />
                      View on Map
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Quick Info & Booking */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="secondary">{listing.category}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold">{listing.price || 'Contact for pricing'}</span>
                </div>
                
                {listing.guestCapacity && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-semibold">{listing.guestCapacity} guests</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{listing.rating || 'N/A'}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setShowBookingForm(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book This Service
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Provider
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {listing.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{listing.email}</span>
                  </div>
                )}
                
                {listing.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{listing.phone}</span>
                  </div>
                )}
                
                {listing.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{listing.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
