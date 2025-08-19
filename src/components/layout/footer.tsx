
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  User,
  Home,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

export function Footer() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const navItems = [
    {
      name: 'Home',
      href: '/home',
      icon: Home,
    },
    {
      name: 'Explore',
      href: '/search',
      icon: LayoutGrid,
    },
    {
      name: 'Favorites',
      href: '/favorites',
      icon: Heart,
    },
    {
      name: 'AI Planner',
      href: '/planner',
      icon: Sparkles,
    },
    {
      name: 'Account',
      href: '/profile',
      icon: User,
    },
  ];

  return (
    <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-40 h-20 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg rounded-t-xl max-w-md w-full">
      <div className="grid h-full grid-cols-5 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors h-full w-full rounded-lg hover:bg-accent/50',
                isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary'
              )}
            >
              <item.icon className={cn("h-4 w-4")} />
              <span className="truncate text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
