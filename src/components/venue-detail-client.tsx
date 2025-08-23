
'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, MapPin, Loader, MessageSquare } from 'lucide-react';
// Removed Firebase imports for demo mode
import { useAuth } from '@/context/auth-context';
import { addDays, format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useMemo } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { Listing } from '@/services/listings';

const galleryImages = [
    { src: "https://placehold.co/600x400.png", hint: "wedding reception" },
    { src: "https://placehold.co/600x400.png", hint: "event decorations" },
    { src: "https://placehold.co/600x400.png", hint: "corporate event" },
    { src: "https://placehold.co/600x400.png", hint: "party table" },
    { src: "https://placehold.co/600x400.png", hint: "outdoor venue" },
    { src: "https://placehold.co/600x400.png", hint: "banquet hall" }
];

// Mock booked dates
const bookedDates = [addDays(new Date(), 5), addDays(new Date(), 6), addDays(new Date(), 15), addDays(new Date(), 16)];
const pendingDates = [addDays(new Date(), 10), addDays(new Date(), 11)];

export function VenueDetailClient({ venue: initialVenue }: { venue: Listing }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const [venue] = useState(initialVenue);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guests, setGuests] = useState(50);
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  // Mock venue updates - no Firebase needed
  useEffect(() => {
    // Simulate venue data updates in demo mode
    const interval = setInterval(() => {
      // In demo mode, we don't need real-time updates
    }, 30000);
    
    return () => clearInterval(interval);
  }, [initialVenue.slug]);

  const averageRating = useMemo(() => {
    if (!venue.reviews || venue.reviews.length === 0) {
      return venue.rating ? venue.rating.toFixed(1) : '0.0';
    }
    const total = venue.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / venue.reviews.length).toFixed(1);
  }, [venue.reviews, venue.rating]);

  const handleRequestBooking = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "You must be logged in to book a venue.",
        });
        router.push('/login');
        return;
    }
    setLoading(true);
    try {
        // Mock booking creation for demo mode
        const mockBooking = {
            id: `booking-${Date.now()}`,
            userId: user.uid,
            userName: user.displayName || user.email,
            venueId: venue.slug,
            venueName: venue.name,
            venueImage: venue.image,
            venueLocation: venue.location,
            venueHint: venue.hint,
            bookingDate: date,
            guestCount: guests,
            status: 'Pending',
            createdAt: new Date()
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
            title: "Booking Request Sent!",
            description: `Your booking request for ${venue.name} has been submitted successfully. (Demo Mode)`,
        });
        
        // In demo mode, we could redirect to a bookings page or show confirmation
        console.log('Mock booking created:', mockBooking);
        
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Booking Failed",
            description: "There was an error submitting your booking request. Please try again.",
        });
    } finally {
        setLoading(false);
    }
  };

  const handleContactHost = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "You must be logged in to contact the host.",
        });
        router.push('/login');
        return;
    }
    
    setContactLoading(true);
    try {
        // Mock conversation creation for demo mode
        const conversationId = `convo-${Date.now()}`;
        // Mock conversation data
        // Mock conversation data for demo mode
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
            title: "Conversation Started!",
            description: "You can now chat with the venue host. (Demo Mode)",
        });
        
        // Redirect to chat with the new conversation
        router.push(`/chat?new=${conversationId}`);
        
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Contact Failed",
            description: "There was an error starting the conversation. Please try again.",
        });
    } finally {
        setContactLoading(false);
    }
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => 
      format(bookedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };





  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {galleryImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-full">
                  <Image
                    src={image.src}
                    alt={`${venue.name} - ${image.hint}`}
                    fill
                    className="object-cover"
                    data-ai-hint={image.hint}
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2" />
          <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2" />
        </Carousel>
        
        {/* Favorite Button */}
        {/* Removed Favorite Button */}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Venue Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{venue.name}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{venue.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{averageRating}</span>
                      <span className="text-sm">({venue.reviewCount || 0} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{venue.price}</div>
                  <div className="text-sm text-muted-foreground">per event</div>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground mb-6">{venue.description}</p>
              
              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(venue.amenities || {}).map(([amenity, available]) => (
                    available && (
                      <div key={amenity} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>{amenity.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            {venue.reviews && venue.reviews.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Reviews</h3>
                <div className="space-y-4">
                  {venue.reviews.map((review, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.authorName}</div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle>Book This Venue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="date">Event Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date() || isDateBooked(date)}
                    className="rounded-md border"
                    modifiers={{
                      booked: bookedDates,
                      pending: pendingDates
                    }}
                    modifiersStyles={{
                      booked: { backgroundColor: 'rgb(239 68 68)', color: 'white' },
                      pending: { backgroundColor: 'rgb(234 179 8)', color: 'white' }
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 0)}
                    min={1}
                    max={venue.guestCapacity || 1000}
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    Capacity: {venue.guestCapacity || 'Unlimited'} guests
                  </div>
                </div>
                
                <Button 
                  onClick={handleRequestBooking} 
                  disabled={loading || !date}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Request Booking'
                  )}
                </Button>
                
                <Separator />
                
                <Button 
                  variant="outline" 
                  onClick={handleContactHost}
                  disabled={contactLoading}
                  className="w-full"
                >
                  {contactLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Host
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Venue Details */}
            <Card>
              <CardHeader>
                <CardTitle>Venue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{venue.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{venue.guestCapacity || 'Unlimited'} guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium">{averageRating}/5</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
