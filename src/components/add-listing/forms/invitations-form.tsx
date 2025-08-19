
'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUploader } from '../file-uploader';

const designServices = ['Custom Designs', 'Letterpress', 'Foil Stamping', 'Calligraphy', 'Handmade Paper', 'Digital Invitations'];

export function InvitationsForm() {
    const { control } = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Invitation Designer Name / Studio</FormLabel>
                        <FormControl><Input placeholder="e.g., Chic Invitations" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl><Input type="email" placeholder="e.g., invites@chic.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="website"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Portfolio Website (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., www.chic-invitations.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="pricing"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Starting Price Per Invitation ($)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="minOrder"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Minimum Order Quantity</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="designServices"
                render={() => (
                    <FormItem>
                        <FormLabel>Design Services Offered</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                            {designServices.map((item) => (
                                <FormField
                                    key={item}
                                    control={control}
                                    name={`designServices.${item}`}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <FormLabel className="font-normal">{item}</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>About Your Design Style</FormLabel>
                        <FormControl><Textarea placeholder="Describe your design aesthetic (e.g., modern, classic, rustic) and what makes your invitations special." rows={5} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="photos"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Showcase Your Designs</FormLabel>
                        <FormControl><FileUploader onFileSelect={(files) => field.onChange(files)} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
