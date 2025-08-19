
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageWrapper } from '@/components/shared/page-wrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, User, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phoneNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
    const { user } = useAuth();
    const { toast } = useToast();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: user?.displayName || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || '',
        },
    });
    
    const onSubmit = async (data: ProfileFormValues) => {
        if (!auth.currentUser) return;
        try {
            await updateProfile(auth.currentUser, {
                displayName: data.displayName,
            });
            // Note: Updating email and phone number requires more complex verification flows.
            // This is a simplified example focusing on the display name.
            toast({
                title: 'Profile Updated',
                description: 'Your profile has been successfully updated.',
            });
        } catch (error: unknown) {
             const errorMessage = error instanceof Error ? error.message : 'Failed to update profile.';
             toast({
                variant: 'destructive',
                title: 'Error',
                description: errorMessage,
            });
        }
    };

  return (
    <PageWrapper
        icon={User}
        title="Edit Profile"
        description="Update your personal information."
    >
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Make sure your details are up to date.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="displayName">Full Name</Label>
                    <div className='relative'>
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="displayName" {...form.register('displayName')} className="pl-9" />
                    </div>
                    {form.formState.errors.displayName && <p className="text-sm text-destructive">{form.formState.errors.displayName.message}</p>}
                </div>
                 <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <div className='relative'>
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" {...form.register('email')} disabled className="pl-9" />
                    </div>
                     <p className='text-xs text-muted-foreground'>Email cannot be changed.</p>
                </div>
                 <div className="space-y-1.5">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className='relative'>
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="phoneNumber" {...form.register('phoneNumber')} className="pl-9" placeholder='Add your phone number' />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader className="animate-spin mr-2" /> : null}
                    Save Changes
                </Button>
            </CardFooter>
        </form>
      </Card>
    </PageWrapper>
  );
}
