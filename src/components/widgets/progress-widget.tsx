'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProgressWidgetProps {
  title: string;
  subtitle?: string;
  progress: number;
  maxProgress?: number;
  status?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
  className?: string;
}

export function ProgressWidget({ 
  title, 
  subtitle, 
  progress, 
  maxProgress = 100,
  status = 'info',
  icon,
  className 
}: ProgressWidgetProps) {
  const percentage = (progress / maxProgress) * 100;
  
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <Card className={cn(
      "card-modern hover-lift border-0",
      "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40",
      "backdrop-blur-sm shadow-lg hover:shadow-xl",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          <Badge className={getStatusColor()}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress} / {maxProgress}</span>
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={percentage} 
            className="h-3 bg-gray-200 dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>{percentage.toFixed(1)}%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className={cn("font-medium", getStatusColor().split(' ')[0])}>
              {percentage >= 100 ? 'Completed' : percentage >= 75 ? 'Almost Done' : percentage >= 50 ? 'In Progress' : 'Getting Started'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
