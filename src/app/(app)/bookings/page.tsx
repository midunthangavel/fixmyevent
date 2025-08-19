
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, Loader, MapPin, Star, Edit } from "lucide-react";
import Image from "next/image";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { collection, query, where, getDocs, Timestamp, doc, updateDoc, arrayUnion, serverTimestamp, addDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { bookingService } from "@/services/bookings";
import type { Booking } from "@/types/booking";

// Using the new comprehensive Booking type from types/booking.ts

interface ReviewData {
  rating: number;
  comment: string;
  authorName: string;
  avatar: string;
  createdAt: any; // Firestore timestamp
}

function ReviewDialog({ booking, onReviewSubmit }: { booking: Booking, onReviewSubmit: (bookingId: string, review: ReviewData) => void }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [open, setOpen] = useState(false);
    const { user, profile } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (rating === 0 || !comment || !user) {
            toast({
                variant: 'destructive',
                title: 'Incomplete Review',
                description: 'Please provide a rating and a comment.',
            });
            return;
        }

        const reviewData = {
            rating,
            comment,
            authorName: user.displayName || "Anonymous",
            avatar: user.photoURL || `https://avatar.vercel.sh/${user.uid}.png`,
            createdAt: serverTimestamp(),
        }

        try {
            // Update booking with review
            const bookingRef = doc(db, "bookings", booking.id);
            await updateDoc(bookingRef, { review: reviewData });
            
            // Add review to venue's collection of reviews
            const venueRef = doc(db, "listings", booking.venueId);
             try {
                const venueSnap = await getDoc(venueRef);
                if (venueSnap.exists()) {
                    const venueData = venueSnap.data();
                    await updateDoc(venueRef, {
                        reviews: arrayUnion(reviewData)
                    });

                    // Add a notification for the listing owner only if they exist
                    if (venueData.ownerId) {
                         await addDoc(collection(db, 'notifications'), {
                            userId: venueData.ownerId,
                            type: 'New Review',
                            message: `You received a new ${rating}-star review for ${booking.venueName}.`,
                            timestamp: serverTimestamp(),
                            read: false,
                            iconName: 'Review Received'
                        });
                    }
                }
            } catch (e) {
                console.warn("Could not update venue with new review.", e)
            }
            
            // Gamification: Add "First Reviewer" badge if it's the user's first review
            if (profile && (!profile.badges || !profile.badges.includes('First Reviewer'))) {
                const userProfileRef = doc(db, 'users', user.uid);
                await updateDoc(userProfileRef, {
                    badges: arrayUnion('First Reviewer')
                });
                toast({
                    title: 'Badge Unlocked!',
                    description: 'You earned the "First Reviewer" badge!',
                });
            }


            onReviewSubmit(booking.id, reviewData);
            toast({
                title: 'Review Submitted',
                description: 'Thank you for your feedback!',
            });
            setOpen(false);

        } catch (error) {
            console.error("Error submitting review:", error);
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: 'There was an error submitting your review.',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {booking.review ? (
                    <Button size="sm" variant="outline" disabled>
                        <CheckCircle className="w-4 h-4 mr-2" /> Reviewed
                    </Button>
                ) : (
                    <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" /> Leave a Review
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Leave a review for {booking.venueName}</DialogTitle>
                    <DialogDescription>
                        Share your experience to help others make better decisions.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label>Your Rating</Label>
                        <div className="flex items-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 cursor-pointer ${rating >= star ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="comment">Your Comment</Label>
                        <Textarea
                            id="comment"
                            placeholder="Tell us about your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="mt-2"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Submit Review</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function BookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

      const handleReviewUpdate = (bookingId: string, review: ReviewData) => {
    setPastBookings(currentBookings => 
        currentBookings.map(b => 
            b.id === bookingId ? { ...b, review } : b
        )
    );
  };
  
  const handleContactProvider = async (service: {slug: string, name: string, image: string}) => {
    if (!user) {
        return;
    }
    const providerId = `provider_${service.slug}`;
    const conversationId = [user.uid, providerId].sort().join('_');
    const conversationRef = doc(db, 'conversations', conversationId);
    const conversationSnap = await getDoc(conversationRef);
    
    if (!conversationSnap.exists()) {
        await setDoc(conversationRef, {
            participants: {
                [user.uid]: { name: user.displayName || user.email, avatar: user.photoURL || `https://avatar.vercel.sh/${user.uid}.png` },
                [providerId]: { name: service.name, avatar: service.image },
            },
            messages: [],
            createdAt: serverTimestamp(),
        });
    }
    router.push(`/chat?new=${conversationId}`);
  };

  useEffect(() => {
    async function fetchBookings() {
      if (!user) {
        setLoading(false);
        return;
      };

      try {
        // Use the new booking service
        const bookings = await bookingService.getUserBookings(user.uid);

        const now = new Date();
        const upcoming = bookings.filter(b => b.bookingDate && b.bookingDate.toDate() >= now);
        const past = bookings.filter(b => b.bookingDate && b.bookingDate.toDate() < now);
        
        setUpcomingBookings(upcoming.sort((a, b) => a.bookingDate.toDate().getTime() - b.bookingDate.toDate().getTime()));
        setPastBookings(past.sort((a, b) => b.bookingDate.toDate().getTime() - a.bookingDate.toDate().getTime()));

      } catch (error) {
        console.error("Error fetching bookings: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-[50vh]">
            <Loader className="h-6 w-6 animate-spin" />
        </div>
    )
  }

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card>
        <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1">
                 <Link href={`/venues/${booking.serviceId}`}>
                    <Image src={booking.serviceImage} alt={booking.serviceName} width={400} height={200} className="object-cover h-full w-full rounded-t-lg md:rounded-l-lg md:rounded-t-none" data-ai-hint={booking.serviceHint} />
                </Link>
            </div>
            <div className="md:col-span-2">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                             <Link href={`/venues/${booking.serviceId}`}><CardTitle>{booking.serviceName}</CardTitle></Link>
                            <CardDescription>Booking ID: {booking.id}</CardDescription>
                        </div>
                        <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}>{booking.status}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {booking.bookingDate?.toDate().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) || 'Date not set'}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {booking.serviceLocation}
                    </div>
                    <div className="flex gap-2 pt-1">
                        <Button size="sm" asChild><Link href={`/venues/${booking.serviceId}`}>View Details</Link></Button>
                        <Button size="sm" variant="outline" onClick={() => handleContactProvider({slug: booking.serviceId, name: booking.serviceName, image: booking.serviceImage})}>Contact Provider</Button>
                    </div>
                </CardContent>
            </div>
        </div>
    </Card>
  )

  const PastBookingCard = ({ booking }: { booking: Booking }) => (
     <Card className="opacity-80 hover:opacity-100 transition-opacity">
        <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1">
                <Link href={`/venues/${booking.serviceId}`}>
                    <Image src={booking.serviceImage} alt={booking.serviceName} width={400} height={200} className="object-cover h-full w-full rounded-t-lg md:rounded-l-lg md:rounded-t-none" data-ai-hint={booking.serviceHint} />
                </Link>
            </div>
            <div className="md:col-span-2">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                           <Link href={`/venues/${booking.serviceId}`}><CardTitle>{booking.serviceName}</CardTitle></Link>
                            <CardDescription>Booking ID: {booking.id}</CardDescription>
                        </div>
                        <Badge variant="secondary">Completed</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {booking.bookingDate?.toDate().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) || 'Date not set'}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {booking.serviceLocation}
                    </div>
                    <div className="flex gap-2 pt-1">
                        <ReviewDialog booking={booking} onReviewSubmit={handleReviewUpdate} />
                        <Button size="sm" variant="outline">View Receipt</Button>
                    </div>
                </CardContent>
            </div>
        </div>
    </Card>
  )

  const EmptyState = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
     <div className="border-dashed border rounded-lg">
        <div className="p-8 text-center">
            <div className="mx-auto w-fit bg-secondary p-3 rounded-full mb-3">
            <Icon className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-muted-foreground text-sm">
            {description}
            </p>
        </div>
    </div>
  )

  return (
    <PageWrapper
        icon={Calendar}
        title="My Bookings"
        description="Manage your upcoming and past bookings for your functions."
    >
      <Tabs defaultValue="upcoming" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="space-y-4 mt-4">
            {upcomingBookings.length > 0 ? (
                upcomingBookings.map(booking => (
                   <BookingCard key={booking.id} booking={booking} />
                ))
            ) : (
                <EmptyState 
                    icon={Calendar}
                    title="No Upcoming Bookings"
                    description="You have no upcoming bookings. Why not explore some venues?"
                />
            )}
            </div>
        </TabsContent>
        <TabsContent value="past">
            <div className="space-y-4 mt-4">
            {pastBookings.length > 0 ? (
                pastBookings.map(booking => (
                   <PastBookingCard key={booking.id} booking={booking} />
                ))
            ) : (
               <EmptyState 
                    icon={CheckCircle}
                    title="No Past Bookings"
                    description="You have no past bookings."
                />
            )}
            </div>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}

export default BookingsPage;
