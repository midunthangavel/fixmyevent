'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Wifi, 
  Download, 
  Zap, 
  Shield, 
  Clock,
  X,
  Info
} from 'lucide-react';

interface PWAFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const pwaFeatures: PWAFeature[] = [
  {
    icon: <Smartphone className="w-5 h-5" />,
    title: 'Installable',
    description: 'Add to your home screen like a native app'
  },
  {
    icon: <Wifi className="w-5 h-5" />,
    title: 'Offline Support',
    description: 'Access key features even without internet'
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Fast Loading',
    description: 'Optimized performance with smart caching'
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Secure',
    description: 'HTTPS encrypted and safe to use'
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Background Sync',
    description: 'Updates happen automatically in the background'
  }
];

export function PWAInfo() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40">
      <Card className="shadow-lg border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-sm">PWA Features</CardTitle>
                <CardDescription className="text-xs">
                  Progressive Web App capabilities
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {!isExpanded ? (
            <div className="space-y-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                FixMyEvent is a Progressive Web App (PWA) that provides a native app-like experience.
              </p>
              
              <div className="flex flex-wrap gap-1">
                {pwaFeatures.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature.icon}
                    <span className="ml-1">{feature.title}</span>
                  </Badge>
                ))}
              </div>
              
              <Button
                onClick={() => setIsExpanded(true)}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                Learn More
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                {pwaFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        {feature.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  To install: Look for the "Add to Home Screen" option in your browser menu.
                </p>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsExpanded(false)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    Show Less
                  </Button>
                  
                  <Button
                    onClick={() => setIsVisible(false)}
                    size="sm"
                    className="flex-1 text-xs bg-blue-600 hover:bg-blue-700"
                  >
                    Got It
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
