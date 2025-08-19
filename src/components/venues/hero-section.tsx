'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Filter,
  Sparkles,
  Star,
  Award
} from 'lucide-react';

export function VenuesHeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [guestCount, setGuestCount] = useState<string>('');

  const categories = [
    { id: 'all', name: 'All Categories', icon: Sparkles },
    { id: 'Venue', name: 'Venues', icon: MapPin },
    { id: 'Catering', name: 'Catering', icon: Users },
    { id: 'Photography', name: 'Photography', icon: Star },
    { id: 'Music', name: 'Music', icon: Award },
    { id: 'Decorations', name: 'Decorations', icon: Calendar }
  ];

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Search:', { searchQuery, selectedCategory, guestCount });
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <Badge className="badge-modern badge-success mb-6 animate-scale-in">
            <Sparkles className="w-4 h-4 mr-2" />
            Premium Event Services
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-slide-up">
            Find Your Perfect
            <br />
            <span className="text-foreground">Event Partner</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up">
            Discover handpicked venues, trusted vendors, and exceptional services 
            to make your event truly unforgettable.
          </p>
        </div>

        {/* Search and Filter Card */}
        <Card className="card-premium border-0 shadow-2xl max-w-4xl mx-auto animate-fade-in">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              {/* Search Input */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search venues, services, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 input-modern"
                />
              </div>

              {/* Category Select */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 input-modern appearance-none cursor-pointer"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
              </div>

              {/* Guest Count */}
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="number"
                  placeholder="Guests"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="pl-10 pr-4 py-3 input-modern"
                />
              </div>
            </div>

            {/* Search Button */}
            <Button 
              onClick={handleSearch}
              className="w-full btn-primary text-lg py-3 hover-glow"
            >
              <Search className="w-5 h-5 mr-2" />
              Find Perfect Match
            </Button>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Premium Venues</div>
          </div>
          <div className="animate-fade-in">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Service Categories</div>
          </div>
          <div className="animate-fade-in">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
            <div className="text-muted-foreground">Happy Clients</div>
          </div>
          <div className="animate-fade-in">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">Satisfaction Rate</div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Popular <span className="gradient-text">Categories</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(1).map((category) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id} 
                  className="card-modern hover-lift text-center cursor-pointer group"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors duration-200">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
