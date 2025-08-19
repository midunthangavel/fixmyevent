
'use client';


import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { VenueCard } from "@/components/venue-card";

import { Plus } from "lucide-react";
import type { Listing } from "@/services/listings";

export const VenueSection = ({ title, venues, moreLink }: { title: string, venues: Listing[], moreLink?: string }) => {
    return (
        <section className="py-4 sm:py-6 lg:py-8">
            <div className="w-full">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-headline">
                        {title}
                    </h2>
                    {moreLink && (
                        <Button variant="link" asChild className="text-primary text-sm sm:text-base">
                            <Link href={moreLink}>
                                See all <Plus className="ml-1.5 h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    )}
                </div>
                <div className="-mx-2">
                     <Carousel opts={{
                        align: "start",
                        loop: false,
                        dragFree: true,
                     }}>
                        <CarouselContent>
                            {venues.map((venue) => (
                                <CarouselItem key={venue.slug} className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                    <div className="p-2">
                                        <VenueCard
                                            {...venue}
                                            isCard
                                            imageClassName="h-32 sm:h-40 lg:h-48"
                                            location={venue.location || 'Location not specified'}
                                            rating={venue.rating || 0}
                                            reviewCount={venue.reviewCount || 0}
                                            price={venue.price || 'Price not specified'}
                                            image={venue.image || ''}
                                            hint={venue.hint || ''}
                                            category={venue.category || 'Venue'}
                                            guestCapacity={venue.guestCapacity || 1}
                                            amenities={venue.amenities || {}}
                                            guestFavorite={venue.guestFavorite || false}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                     </Carousel>
                </div>
            </div>
        </section>
    );
}
