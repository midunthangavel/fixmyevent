
'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUploader } from '../file-uploader';
import { AvailabilityCalendar } from '../availability-calendar';

const planningServices = ['Full Planning', 'Partial Planning', 'Day-of Coordination', 'A La Carte Services', 'Design & Styling'];
const eventTypes = ['Weddings', 'Corporate Events', 'Private Parties', 'Non-Profit Galas', 'Cultural Events'];

export function PlannerForm() {
    const { control } = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Event Planner Name / Company Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Flawless Events Co." {...field} /></FormControl>
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
                        <FormControl><Input type="email" placeholder="e.g., contact@flawless.com" {...field} /></FormControl>
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
                        <FormControl><Input placeholder="e.g., www.flawless-events.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="pricing"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Pricing Model</FormLabel>
                        <FormControl><Input placeholder="e.g., Percentage of total budget, Flat fee" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="planningServices"
                render={() => (
                    <FormItem>
                        <FormLabel>Planning Services Offered</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {planningServices.map((item) => (
                                <FormField
                                    key={item}
                                    control={control}
                                    name={`planningServices.${item}`}
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
                name="eventTypes"
                render={() => (
                    <FormItem>
                        <FormLabel>Event Types Specialized In</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {eventTypes.map((item) => (
                                <FormField
                                    key={item}
                                    control={control}
                                    name={`eventTypes.${item}`}
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
                        <FormLabel>About Your Service</FormLabel>
                        <FormControl><Textarea placeholder="Describe your planning philosophy, your experience, and what clients can expect when working with you." rows={5} {...field} /></FormControl>
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
                        <FormLabel>Showcase Your Past Events</FormLabel>
                        <FormControl><FileUploader onFileSelect={(files) => field.onChange(files)} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
