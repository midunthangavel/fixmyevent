'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingWidgetProps {
  title: string;
  subtitle?: string;
  rating: number;
  totalRatings: number;
  onRate?: (rating: number) => void;
  showFeedback?: boolean;
  className?: string;
}

export function RatingWidget({ 
  title, 
  subtitle, 
  rating, 
  totalRatings,
  onRate,
  showFeedback = true,
  className 
}: RatingWidgetProps) {
  const handleRate = (newRating: number) => {
    if (onRate) {
      onRate(newRating);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type={interactive ? 'button' : 'button'}
        onClick={interactive ? () => handleRate(index + 1) : undefined}
        disabled={!interactive}
        className={cn(
          "transition-colors duration-200",
          interactive && "hover:scale-110 cursor-pointer",
          !interactive && "cursor-default"
        )}
      >
        <Star 
          className={cn(
            "w-5 h-5",
            index < rating 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-gray-300 dark:text-gray-600"
          )} 
        />
      </button>
    ));
  };

  return (
    <Card className={cn(
      "card-modern hover-lift border-0",
      "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40",
      "backdrop-blur-sm shadow-lg hover:shadow-xl",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="text-center">
          <CardTitle className="text-lg font-semibold mb-2">{title}</CardTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Rating Display */}
        <div className="text-center space-y-3">
          <div className="flex justify-center space-x-1">
            {renderStars(rating)}
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">{rating.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">
              Based on {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        </div>

        {/* Interactive Rating */}
        {showFeedback && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                How do you like using our services today?
              </p>
              <div className="flex justify-center space-x-1">
                {renderStars(0, true)}
              </div>
            </div>

            {/* Quick Feedback Buttons */}
            <div className="flex justify-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Great!</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ThumbsDown className="w-4 h-4" />
                <span>Not Good</span>
              </Button>
            </div>

            {/* Feedback Input */}
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 mx-auto"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Leave a Review</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
