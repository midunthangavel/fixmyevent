'use client';


import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, HelpCircle } from 'lucide-react';

interface AuthNavigationProps {
  showBackButton?: boolean;
  backTo?: string;
  showHomeButton?: boolean;
  showHelpButton?: boolean;
  className?: string;
}

export default function AuthNavigation({
  showBackButton = false,
  backTo,
  showHomeButton = true,
  showHelpButton = true,
  className = ''
}: AuthNavigationProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backTo) {
      router.push(backTo);
    } else {
      router.back();
    }
  };

  return (
    <nav className={`flex items-center justify-between p-4 ${className}`}>
      <div className="flex items-center space-x-2">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {showHomeButton && (
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        )}
        
        {showHelpButton && (
          <Button variant="ghost" size="sm" onClick={() => router.push('/help')}>
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </Button>
        )}
      </div>
    </nav>
  );
}
