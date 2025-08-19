import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Users, Filter, Search } from 'lucide-react'
import { getMockListings } from '@/services/mock-data'

export default async function VenuesPage() {
  const allVenues = await getMockListings()

  return (
    <div className="pb-24">
      {/* Page Header */}
      <section className="bg-white dark:bg-slate-900 py-8 border-b">
        <div className="px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Browse Venues
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Discover the perfect venue for your next event. From intimate gatherings to grand celebrations.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-slate-50 dark:bg-slate-800 py-6">
        <div className="px-4">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search venues..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2 flex-1">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Venues Grid */}
      <section className="py-8 bg-white dark:bg-slate-900">
        <div className="px-4">
          <div className="grid grid-cols-1 gap-6">
            {allVenues.map((venue) => (
              <Card key={venue.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-slate-900">
                      {venue.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {venue.name}
                  </CardTitle>
                  <CardDescription className="flex items-center text-slate-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {venue.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {venue.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{venue.rating}</span>
                      </div>
                      <span className="text-sm text-slate-500">({venue.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <Users className="h-4 w-4 mr-1" />
                      Up to {venue.guestCapacity}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {venue.price}
                    </span>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
