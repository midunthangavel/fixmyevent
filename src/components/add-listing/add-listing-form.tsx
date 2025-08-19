
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { listingSchema, Category, ListingFormValues } from '@/types/listing';
import { useAuth } from '@/context/auth-context';
// Removed Firebase imports for demo mode
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Lazy load forms to improve initial page load
import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
import { Separator } from '../ui/separator';
const LoadingComponent = () => <div className='flex justify-center items-center py-10'><Loader className='animate-spin' /></div>;

// Simplified dynamic imports without promise chains
const VenueForm = dynamic(() => import('./forms/venue-form'), { 
  loading: LoadingComponent,
  ssr: false 
});
const CateringForm = dynamic(() => import('./forms/catering-form'), { 
  loading: LoadingComponent,
  ssr: false 
});
const PhotographyForm = dynamic(() => import('./forms/photography-form'), { 
  loading: LoadingComponent,
  ssr: false 
});
const MusicForm = dynamic(() => import('./forms/music-form'), { 
  loading: LoadingComponent,
  ssr: false 
});
const DecorationsForm = dynamic(() => import('./forms/decorations-form'), { 
  loading: LoadingComponent,
  ssr: false 
});
const TransportForm = dynamic(() => import('./forms/transport-form'), { 
  loading: LoadingComponent,
  ssr: false 
});
const InvitationsForm = dynamic(() => import('./forms/invitations-form'), { 
  loading: LoadingComponent,
  ssr: false 
});
const LegalForm = dynamic(() => import('./forms/legal-form'), { 
  loading: LoadingComponent,
  ssr: false 
});
const PlannerForm = dynamic(() => import('./forms/planner-form'), { 
  loading: LoadingComponent,
  ssr: false 
});

// Define proper types for form components
interface FormComponentProps {
  category: Category;
  onCategoryChange?: (category: Category) => void;
}

const categories: { value: Category; label: string }[] = [
    { value: 'Venue', label: 'Venues / Halls' },
    { value: 'Decorations', label: 'Decorations' },
    { value: 'Catering', label: 'Catering' },
    { value: 'Photography', label: 'Photography' },
    { value: 'Transport', label: 'Transport' },
    { value: 'Legal', label: 'Legal Matters' },
    { value: 'Music', label: 'Music / DJ' },
    { value: 'Invitations', label: 'Invitations' },
    { value: 'Planner', label: 'Event Planners' },
    { value: 'Event Staff', label: 'Event Staff' },
];

const categoryFormMap: Record<Category, React.ComponentType<FormComponentProps>> = {
    Venue: VenueForm,
    Catering: CateringForm,
    Photography: PhotographyForm,
    Transport: TransportForm,
    Decorations: DecorationsForm,
    Legal: LegalForm,
    Music: MusicForm,
    Invitations: InvitationsForm,
    Planner: PlannerForm,
    'Event Staff': CateringForm, // Placeholder, can be its own form
};

export function AddListingForm() {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(listingSchema),
        defaultValues: {
            category: undefined,
            name: '',
            email: user?.email || '',
            phone: '',
            address: '',
            description: '',
            // Set sensible defaults for new fields from your schema
            slug: '',
            location: '',
            image: '',
            hint: '',
            rating: 0,
            reviewCount: 0,
            price: '',
            priceValue: 0,
            guestFavorite: false,
            ownerId: user?.uid,
        },
    });

    const handleCategoryChange = (value: string) => {
        const category = value as Category;
        setSelectedCategory(category);
        form.setValue('category', category);
        form.reset({
            category,
            name: '',
            email: user?.email || '',
            phone: '',
            address: '',
            description: '',
        });
    };

    async function onSubmit(values: ListingFormValues) {
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Authentication Required',
                description: 'You must be logged in to create a listing.',
            });
            return router.push('/login');
        }

        try {
            // Note: In a real app, you would handle file uploads to Firebase Storage here
            // and get back the download URLs before saving to Firestore.
            // For now, we'll strip out the `photos` field before saving.
            const { photos, ...listingData } = values;

            // Generate a slug from the name if it's not already set
            const slug = values.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

            // Validate required fields
            if (!values.name.trim()) {
                throw new Error('Name is required');
            }

            // Mock listing creation for demo mode
            const mockListing = {
                ...listingData,
                id: `listing-${Date.now()}`,
                slug,
                ownerId: user.uid,
                createdAt: new Date(),
                updatedAt: new Date(),
                image: 'https://placehold.co/600x400.png',
                hint: values.category.toLowerCase(),
                rating: 0,
                reviewCount: 0,
                reviews: [],
                location: values.address || 'Location not specified',
            };
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Use logger instead of console.log
            console.log('Mock listing created:', mockListing);

            toast({
                title: 'Listing Created!',
                description: 'Your service has been successfully listed on the platform.',
            });
            // Redirect to the new My Listings page
            router.push('/dashboard');

        } catch (error) {
            console.error('Error creating listing:', error);
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: 'There was an error creating your listing. Please try again.',
            });
        }
    }

    const SelectedForm = selectedCategory ? categoryFormMap[selectedCategory] : null;

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Select Your Service Category</CardTitle>
                        <CardDescription>Choose the type of service you are offering to see the relevant fields.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Service Category</FormLabel>
                                <Select onValueChange={handleCategoryChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </CardContent>
                </Card>

                {SelectedForm && (
                   <Card>
                        <CardHeader>
                            <CardTitle>Service Details</CardTitle>
                            <CardDescription>Please provide the specific details for your {selectedCategory?.toLowerCase()} service.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SelectedForm category={selectedCategory} />
                        </CardContent>
                    </Card>
                )}

                {selectedCategory && (
                     <div className="flex justify-end">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                             {form.formState.isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Listing
                        </Button>
                    </div>
                )}
            </form>
        </FormProvider>
    );
}
