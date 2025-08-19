
'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUploader } from '../file-uploader';
import { AvailabilityCalendar } from '../availability-calendar';

const musicGenres = ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Country', 'International'];
const equipmentProvided = ['Sound System', 'Microphones', 'Lighting', 'DJ Booth'];

export function MusicForm() {
    const { control } = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>DJ Name / Band Name</FormLabel>
                        <FormControl><Input placeholder="e.g., DJ Sparkle or The Groove Collective" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Booking Email</FormLabel>
                        <FormControl><Input type="email" placeholder="e.g., bookings@djsparkle.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl><Input type="tel" placeholder="e.g., (123) 456-7890" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="pricing"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Pricing (e.g., per hour, per event)</FormLabel>
                        <FormControl><Input placeholder="e.g., $200/hour, packages from $1000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="canEmcee"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0 pt-2">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <FormLabel className="font-normal">Can act as Master of Ceremonies (MC)</FormLabel>
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="musicGenres"
                render={() => (
                    <FormItem>
                        <FormLabel>Music Genres Specialized In</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {musicGenres.map((item) => (
                                <FormField
                                    key={item}
                                    control={control}
                                    name={`musicGenres.${item}`}
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
                name="equipmentProvided"
                render={() => (
                    <FormItem>
                        <FormLabel>Equipment Provided</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                            {equipmentProvided.map((item) => (
                                <FormField
                                    key={item}
                                    control={control}
                                    name={`equipmentProvided.${item}`}
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
                        <FormLabel>Bio & Style Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe your style, experience, and what makes your performance unique." rows={5} {...field} /></FormControl>
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
                        <FormLabel>Photos / Videos of Performances</FormLabel>
                        <FormControl><FileUploader onFileSelect={(files) => field.onChange(files)} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
