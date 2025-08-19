
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Menu, X, User, Bell, Settings } from 'lucide-react'
import { AppLogo } from '@/components/shared/app-logo'
import { EnhancedThemeToggle } from './enhanced-theme-toggle'
import { Badge } from '@/components/ui/badge'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-900/95 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <AppLogo width={32} height={32} className="h-8 w-8" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              FixMyEvent
            </span>
          </Link>

          {/* Navigation - Always Visible */}
          <nav className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
            <Link 
              href="/venues" 
              className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors hidden sm:block"
            >
              Venues
            </Link>
            <Link 
              href="/search" 
              className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors hidden sm:block"
            >
              Search
            </Link>
            <Link 
              href="/productivity" 
              className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors hidden sm:block"
            >
              Productivity
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors hidden sm:block"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors hidden sm:block"
            >
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search button - Always visible */}
            <Button variant="ghost" size="sm" className="flex" asChild>
              <Link href="/search">
                <Search className="h-4 w-4" />
              </Link>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="flex relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                3
              </Badge>
            </Button>

            {/* Enhanced Theme Toggle */}
            <EnhancedThemeToggle />

            {/* User menu - Always visible */}
            <Button variant="ghost" size="sm" className="flex">
              <User className="h-4 w-4" />
            </Button>

            {/* Mobile menu button - Only for additional mobile options */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Additional options for small screens */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <Link
                href="/venues"
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Venues
              </Link>
              <Link
                href="/search"
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                href="/productivity"
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Productivity
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/bookings"
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <Link
                  href="/favorites"
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Favorites
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
