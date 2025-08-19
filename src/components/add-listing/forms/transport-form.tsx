
'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUploader } from '../file-uploader';
import { AvailabilityCalendar } from '../availability-calendar';

const vehicleTypes = ['Sedan', 'SUV', 'Limousine', 'Party Bus', 'Vintage Car', 'Coach Bus'];
const amenities = ['Air Conditioning', 'Sound System', 'Champagne Service', 'Red Carpet'];

export function TransportForm() {
    const { control } = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Transport Service Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Prestige Bridal Cars" {...field} /></FormControl>
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
                        <FormControl><Input type="email" placeholder="e.g., bookings@prestige.com" {...field} /></FormControl>
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
                name="address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Service Area</FormLabel>
                        <FormControl><Input placeholder="e.g., New York Metropolitan Area" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="pricing"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Pricing Model (e.g., per hour, per day)</FormLabel>
                        <FormControl><Input placeholder="e.g., Starts from $500" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="vehicleTypes"
                render={() => (
                    <FormItem>
                        <FormLabel>Types of Vehicles Offered</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {vehicleTypes.map((item) => (
                                <FormField
                                    key={item}
                                    control={control}
                                    name={`vehicleTypes.${item}`}
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
                name="amenities"
                render={() => (
                    <FormItem>
                        <FormLabel>Vehicle Amenities</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                            {amenities.map((item) => (
                                <FormField
                                    key={item}
                                    control={control}
                                    name={`amenities.${item}`}
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
                        <FormLabel>Service Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe your fleet, the quality of your service, and any special packages you offer." rows={5} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="availability"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Set Vehicle Availability</FormLabel>
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
                        <FormLabel>Photos of Your Vehicles</FormLabel>
                        <FormControl><FileUploader onFileSelect={(files) => field.onChange(files)} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
