

'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, HelpCircle } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-4 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold">FixMyEvent</span>
        </Link>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center space-x-4 mb-2">
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-foreground transition-colors">
            Contact Us
          </Link>
        </div>
        <p>&copy; 2024 FixMyEvent. All rights reserved.</p>
      </footer>
    </div>
  );
}
