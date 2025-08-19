'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsWidgetProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export function StatsWidget({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  className 
}: StatsWidgetProps) {
  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className={cn(
      "card-modern hover-lift group border-0",
      "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40",
      "backdrop-blur-sm shadow-lg hover:shadow-xl",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && (
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              {icon}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          
          {change !== undefined && (
            <div className="flex items-center space-x-2">
              {getChangeIcon()}
              <span className={cn("text-sm font-medium", getChangeColor())}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs px-2 py-1",
                  changeType === 'increase' && "bg-green-100 text-green-800 border-green-200",
                  changeType === 'decrease' && "bg-red-100 text-red-800 border-red-200",
                  changeType === 'neutral' && "bg-gray-100 text-gray-800 border-gray-200"
                )}
              >
                {changeType === 'increase' ? 'Up' : changeType === 'decrease' ? 'Down' : 'Stable'}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
