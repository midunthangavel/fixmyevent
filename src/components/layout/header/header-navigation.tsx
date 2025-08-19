
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,

  Sparkles,
  Wallet,
  LayoutGrid,
  Store,
  BarChart3
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

const userCategories = [
  {
    name: "Home",
    icon: <Home className="w-6 h-6" />,
    href: "/home",
  },
   {
    name: "Services",
    icon: <LayoutGrid className="w-6 h-6" />,
    href: "/services",
  },
  {
    name: "AI Planner",
    icon: <Sparkles className="w-6 h-6" />,
    href: "/planner",
  },
  {
    name: "Budget",
    icon: <Wallet className="w-6 h-6" />,
    href: "/budget",
  },
];

const vendorCategories = [
  {
    name: "Dashboard",
    icon: <Store className="w-6 h-6" />,
    href: "/vendor-dashboard",
  },
  {
    name: "Add Listing",
    icon: <LayoutGrid className="w-6 h-6" />,
    href: "/add-listing",
  },
  {
    name: "Bookings",
    icon: <LayoutGrid className="w-6 h-6" />,
    href: "/bookings",
  },
  {
    name: "Analytics",
    icon: <BarChart3 className="w-6 h-6" />,
    href: "#",
  },
];

export function HeaderNavigation() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const { profile } = useAuth();
    
    useEffect(() => setMounted(true), []);

    if (!mounted) {
      return (
         <nav className="flex justify-center items-center gap-6 sm:gap-8 lg:gap-10 text-sm h-12" />
      )
    }

    // Determine which categories to show based on user role
    const categories = profile?.role === 'vendor' ? vendorCategories : userCategories;

    return (
        <nav className="flex justify-center items-center gap-6 sm:gap-8 lg:gap-10 text-sm">
            {categories.map((category) => {
                const isActive = pathname === category.href;
                return (
                    <Link
                    href={category.href}
                    key={category.name}
                    className={cn(
                      "relative flex flex-col items-center gap-1 transition-colors hover:text-foreground/80",
                       isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                >
                    {category.icon}
                    <span className="text-xs font-medium flex items-center gap-1">
                        {category.name}
                    </span>
                    {isActive && (
                    <div className="absolute -bottom-2 h-[2px] w-6 bg-foreground rounded-full" />
                    )}
                </Link>
                )
            })}
        </nav>
    )
}
