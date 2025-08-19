import { cn } from '@/lib/utils';

interface AppLogoProps {
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
}

export function AppLogo({ width = 160, height = 40, className, showText = true }: AppLogoProps) {
  return (
    <div className={cn("flex items-center", className)} style={{ width, height }}>
      {/* Logo Icon */}
      <div className="relative w-8 h-8 mr-3">
        {/* Background circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg" />
        
        {/* Event icon overlay */}
        <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-sm transform rotate-45" />
        </div>
        
        {/* Sparkle effect */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex items-center">
          <span className="text-xl font-bold text-red-500">Fixmy</span>
          <span className="text-xl font-bold text-yellow-500">event</span>
        </div>
      )}
    </div>
  );
}

// Alternative logo with just the icon
export function AppLogoIcon({ width = 40, height = 40, className }: AppLogoProps) {
  return (
    <div className={cn("flex items-center justify-center", className)} style={{ width, height }}>
      <div className="relative w-full h-full">
        {/* Background circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg" />
        
        {/* Event icon overlay */}
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-sm transform rotate-45" />
        </div>
        
        {/* Sparkle effect */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
