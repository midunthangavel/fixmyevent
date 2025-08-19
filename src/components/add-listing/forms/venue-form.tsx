
'use client';

import { TextField, EmailField, PhoneField, NumberField, TextareaField, CheckboxGroupField } from '@/components/ui/form-fields';
import { FormSection, FormRow, FormDivider } from '@/components/ui/form-layout';
import { VENUE_AMENITIES } from '@/constants/form-options';
import { FileUploader } from '../file-uploader';
import { AvailabilityCalendar } from '../availability-calendar';

export function VenueForm() {
    return (
        <div className="space-y-6">
            <FormSection 
                title="Basic Information" 
                description="Tell us about your venue and how clients can reach you."
            >
                <FormRow>
                    <TextField
                        name="name"
                        label="Venue Name"
                        placeholder="e.g., The Grand Palace"
                        required
                    />
                    <EmailField
                        name="email"
                        label="Booking Email"
                        placeholder="e.g., events@thegrandpalace.com"
                        required
                    />
                </FormRow>
                
                <FormRow>
                    <PhoneField
                        name="phone"
                        label="Contact Phone"
                        placeholder="e.g., (123) 456-7890"
                        required
                    />
                    <NumberField
                        name="guestCapacity"
                        label="Guest Capacity"
                        placeholder="e.g., 300"
                        min={1}
                        required
                    />
                </FormRow>
                
                <TextField
                    name="address"
                    label="Venue Address"
                    placeholder="e.g., 123 Celebration Ave, New York, NY"
                    required
                />
                
                <TextField
                    name="pricing"
                    label="Rental Fee / Pricing Structure"
                    placeholder="e.g., $10,000 for 8 hours"
                    required
                />
            </FormSection>

            <FormDivider />

            <FormSection 
                title="Venue Details" 
                description="Describe what makes your venue special and what amenities you offer."
            >
                <TextareaField
                    name="description"
                    label="Venue Description"
                    placeholder="Describe your venue, its unique features, and what makes it special for events."
                    rows={4}
                    required
                />
                
                <CheckboxGroupField
                    name="amenities"
                    label="Amenities"
                    options={[...VENUE_AMENITIES]}
                    columns={3}
                />
                
                <TextareaField
                    name="specialRequirements"
                    label="Special Requirements or Restrictions"
                    placeholder="Any specific requirements, restrictions, or important information for potential clients."
                    rows={3}
                />
            </FormSection>

            <FormDivider />

            <FormSection 
                title="Media & Availability" 
                description="Add photos of your venue and set your availability calendar."
            >
                <FileUploader onFileSelect={() => {}} />
                <AvailabilityCalendar onUpdate={() => {}} />
            </FormSection>
        </div>
    );
}
