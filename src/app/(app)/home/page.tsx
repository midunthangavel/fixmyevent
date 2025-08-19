
'use client';

import { VenueSection } from "@/components/home/venue-section";
import { getLimitedListings } from "@/services/listings";
import { useEffect, useState } from "react";
import type { Listing } from "@/services/listings";
import { Loader } from "lucide-react";

export default function HomePage() {
  const [popularVenues, setPopularVenues] = useState<Listing[]>([]);
  const [topPhotographers, setTopPhotographers] = useState<Listing[]>([]);
  const [invitationDesigners, setInvitationDesigners] = useState<Listing[]>([]);
  const [availableNextMonth, setAvailableNextMonth] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          popularVenuesData,
          topPhotographersData,
          invitationDesignersData,
          availableNextMonthData,
        ] = await Promise.all([
          getLimitedListings({ count: 4 }),
          getLimitedListings({ count: 4, category: 'Photography' }),
          getLimitedListings({ count: 4, category: 'Invitations' }),
          getLimitedListings({ count: 4 }), // Placeholder logic
        ]);
        setPopularVenues(popularVenuesData);
        setTopPhotographers(topPhotographersData);
        setInvitationDesigners(invitationDesignersData);
        setAvailableNextMonth(availableNextMonthData);
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-[50vh]">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <VenueSection title="Popular venues" venues={popularVenues} moreLink="/search" />
        <VenueSection title="Top Photographers" venues={topPhotographers} moreLink="/search?category=photography" />
        <VenueSection title="Invitation Designers" venues={invitationDesigners} moreLink="/search?category=invitations" />
        <VenueSection title="Available next month" venues={availableNextMonth} moreLink="/search" />
      </div>
    </div>
  );
}
