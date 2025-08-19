
'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUploader } from '../file-uploader';
import { AvailabilityCalendar } from '../availability-calendar';

const photoStyles = ['Photojournalistic', 'Traditional/Posed', 'Fine Art', 'Candid', 'Dramatic'];
const servicesOffered = ['Videography', 'Drone Photography', 'Photo Booth', 'Second Shooter', 'Engagement Shoot'];

export function PhotographyForm() {
    const { control } = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Photography Business Name / Photographer Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Timeless Moments Photo" {...field} /></FormControl>
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
                        <FormControl><Input type="email" placeholder="e.g., contact@timeless.com" {...field} /></FormControl>
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
                        <FormControl><Input placeholder="e.g., www.timeless-photo.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="pricing"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Starting Price for Packages ($)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 4500" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="photoStyles"
                render={() => (
                    <FormItem>
                        <FormLabel>Primary Photography Style(s)</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {photoStyles.map((item) => (
                                <FormField
                                    key={item}
                                    control={control}
                                    name={`photoStyles.${item}`}
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
                name="servicesOffered"
                render={() => (
                    <FormItem>
                        <FormLabel>Additional Services Offered</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {servicesOffered.map((item) => (
                                <FormField
                                    key={item}
                                    control={control}
                                    name={`servicesOffered.${item}`}
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
                        <FormLabel>Bio & Approach</FormLabel>
                        <FormControl><Textarea placeholder="Tell us about your photography philosophy, your experience, and what it's like to work with you." rows={5} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="availability"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Set Your Availability</FormLabel>
                        <FormControl><AvailabilityCalendar onUpdate={field.onChange} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="photos"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Showcase Your Best Photos</FormLabel>
                        <FormControl><FileUploader onFileSelect={(files) => field.onChange(files)} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
