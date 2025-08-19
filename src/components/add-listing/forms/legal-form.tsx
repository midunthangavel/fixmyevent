
'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUploader } from '../file-uploader';

const legalServices = ['Marriage Officiant', 'Prenuptial Agreements', 'Contract Review', 'Immigration Assistance'];

export function LegalForm() {
    const { control } = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name of Legal Professional or Firm</FormLabel>
                        <FormControl><Input placeholder="e.g., Jane Smith, Esq. or Smith Legal Services" {...field} /></FormControl>
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
                        <FormControl><Input type="email" placeholder="e.g., jane.smith@legalservices.com" {...field} /></FormControl>
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
                        <FormLabel>Office Address</FormLabel>
                        <FormControl><Input placeholder="e.g., 123 Law St, Suite 400, New York, NY" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="barNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bar Number (if applicable)</FormLabel>
                        <FormControl><Input placeholder="Provide your state bar number" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="pricing"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Pricing Structure</FormLabel>
                        <FormControl><Input placeholder="e.g., Flat fee for services, Hourly rate" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="legalServices"
                render={() => (
                    <FormItem>
                        <FormLabel>Services Offered</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                            {legalServices.map((item) => (
                                <FormField
                                    key={item}
                                    control={control}
                                    name={`legalServices.${item}`}
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
                        <FormLabel>Professional Bio & Service Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe your legal expertise, experience with events, and what clients can expect." rows={5} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="photos"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Profile Photo</FormLabel>
                        <FormControl><FileUploader onFileSelect={(files) => field.onChange(files)} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
