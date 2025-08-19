
'use client';

import {
  ChevronRight,
  User,
  Gift,
  ShieldCheck,
  Globe,
  Bell,
  Languages,
  HelpCircle,
  FileText,
  LogOut,
  Store,
  Wallet,
  Building,
  Building2,
  Info,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const myAccountItems = [
  { icon: Wallet, text: 'FixmyEvent Wallet', href: '#' },
  { icon: Gift, text: 'My Rewards', href: '#' },
];

const vendorItems = [
  { icon: Store, text: 'Add a Listing', href: '/add-listing' },
];

const settingsItems = [
  { icon: User, text: 'Edit Profile', href: '/profile/edit' },
  { icon: ShieldCheck, text: 'Security', href: '#' },
  { icon: Bell, text: 'Notification Settings', href: '#' },
  { icon: Globe, text: 'Select Country', href: '#' },
  { icon: Languages, text: 'Select Language', href: '#' },
];

const helpAndSupportItems = [
    { icon: HelpCircle, text: 'Help & Support', href: '#' },
    { icon: FileText, text: 'Terms & Conditions', href: '#' },
]

const venueItems = [
  { icon: Building2, text: 'Browse Venues', href: '/venues' },
];

const aboutItems = [
  { icon: Info, text: 'About FixMyEvent', href: '/about' },
];

const contactItems = [
  { icon: Mail, text: 'Contact Us', href: '/contact' },
];


const LanguageSwitcher = () => (
  <div className="p-3 bg-background">
    <h3 className="text-xs font-semibold mb-2 text-muted-foreground">
      Try FixmyEvent in your language
    </h3>
    <div className="flex gap-2 overflow-x-auto pb-1">
      {['English', 'Español', 'Français', 'Deutsch', 'Hindi'].map(
        (lang, index) => (
          <Button
            key={lang}
            size="sm"
            variant={index === 0 ? 'default' : 'outline'}
            className="rounded-full text-xs px-3 py-1 h-8"
          >
            {lang}
          </Button>
        )
      )}
    </div>
  </div>
);

const Section = ({
  title,
  items,
}: {
  title: string;
  items: { icon: React.ElementType; text: string; href: string }[];
}) => (
  <div className="bg-background">
    <div className="p-3">
      <h3 className="text-sm sm:text-base font-semibold mb-2">{title}</h3>
      <div className="flex flex-col bg-card border rounded-lg">
        {items.map((item, index) => (
          <Link href={item.href} key={item.text}>
           <div className="flex items-center p-3">
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-3 text-primary" />
              <span className="flex-grow text-xs sm:text-sm">{item.text}</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            </div>
            {index < items.length - 1 && <Separator />}
          </Link>
        ))}
      </div>
    </div>
  </div>
 );

const BecomeVendorSection = ({ onBecomeVendor }: { onBecomeVendor: () => void }) => (
    <div className="bg-background p-3">
        <div className="bg-card border rounded-lg p-3 sm:p-4 flex flex-col items-center text-center">
            <Building className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-primary" />
            <h3 className="font-semibold text-sm sm:text-base mb-1">Become a Vendor</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 text-center">
                List your services on our platform and reach thousands of customers.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" className="text-xs px-4 py-2 h-8">Get Started</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to become a vendor?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will give you access to the vendor dashboard where you can manage your listings and bookings.
                    This action cannot be undone through the UI.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onBecomeVendor}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
    </div>
);

export default function AccountPage() {
  const { user, signOut, profile, becomeVendor } = useAuth();
  const router = useRouter();

  const memberSince = user?.metadata?.creationTime 
    ? format(new Date(user.metadata.creationTime), 'MMM yyyy') 
    : 'a while ago';

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="bg-muted/40 pb-24">
      {user ? (
        <div className="relative h-24 sm:h-32 text-white">
          <Image 
              src="https://placehold.co/600x400.png"
              alt="Profile background"
              layout='fill'
              objectFit='cover'
              data-ai-hint="mountain landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
          <div className="relative z-10 h-full flex flex-col justify-end p-3 sm:p-4">
              <h2 className="text-lg sm:text-xl font-bold">{user.displayName || 'User'}</h2>
              <p className="text-xs sm:text-sm">{user.email}</p>
              <p className='text-xs mt-1'>Member since {memberSince}</p>
          </div>
        </div>
      ) : (
           <div className="relative h-24 sm:h-32 text-white">
              <Image 
                  src="https://placehold.co/600x400.png"
                  alt="Profile background"
                  layout='fill'
                  objectFit='cover'
                  data-ai-hint="mountain landscape"
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
              <div className="relative z-10 h-full flex flex-col justify-end p-3 sm:p-4">
                  <h2 className="text-lg sm:text-xl font-bold">Guest User</h2>
                  <p className="text-xs sm:text-sm">guest@example.com</p>
                  <p className='text-xs mt-1'>Not logged in</p>
              </div>
          </div>
      )}
      
      <LanguageSwitcher />
      
      {profile?.role === 'user_vendor' && <Section title="My Business" items={vendorItems} />}
      
      <Section title="My Account" items={myAccountItems} />
      
      <Section title="Settings" items={settingsItems} />
      <Section title="Help & Support" items={helpAndSupportItems} />
      <Section title="Venues" items={venueItems} />
      <Section title="Company" items={aboutItems} />
      <Section title="Support" items={contactItems} />

      <div className="p-3 mt-2">
        <Button
          variant="outline"
          className="w-full bg-card h-10 sm:h-11"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
      
      {/* Become a Vendor section - always at the bottom for non-vendors */}
      {profile?.role === 'user' && <BecomeVendorSection onBecomeVendor={becomeVendor} />}
    </div>
  );
}
