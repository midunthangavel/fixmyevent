
'use client';

import { TextField, EmailField, PhoneField, NumberField, TextareaField, CheckboxGroupField, RadioGroupField, CurrencyField } from '@/components/ui/form-fields';
import { FormSection, FormRow, FormDivider } from '@/components/ui/form-layout';
import { CUISINE_TYPES, DIETARY_OPTIONS, CATERING_SERVICE_TYPES } from '@/constants/form-options';
import { FileUploader } from '../file-uploader';

export function CateringForm() {
    return (
        <div className="space-y-6">
            <FormSection 
                title="Basic Information" 
                description="Tell us about your catering service and how clients can reach you."
            >
                <FormRow>
                    <TextField
                        name="name"
                        label="Catering Service Name"
                        placeholder="e.g., Gourmet Delights Catering"
                        required
                    />
                    <EmailField
                        name="email"
                        label="Contact Email"
                        placeholder="e.g., contact@gourmet.com"
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
                        label="Maximum Guest Capacity"
                        placeholder="e.g., 500"
                        min={1}
                        required
                    />
                </FormRow>
                
                <TextareaField
                    name="address"
                    label="Location / Address"
                    placeholder="Provide your primary service address or area."
                    required
                />
            </FormSection>

            <FormDivider />

            <FormSection 
                title="Pricing & Service Details" 
                description="Set your pricing structure and service options."
            >
                <FormRow>
                    <CurrencyField
                        name="costPerPerson"
                        label="Average Cost Per Person ($)"
                        placeholder="e.g., 85"
                        min={0}
                        required
                    />
                    <CurrencyField
                        name="advanceAmount"
                        label="Advance / Deposit Amount Required ($)"
                        placeholder="e.g., 1000"
                        min={0}
                        required
                    />
                </FormRow>
                
                <FormRow>
                    <NumberField
                        name="staffCount"
                        label="Number of Serving Staff Provided"
                        placeholder="e.g., 10"
                        min={0}
                        required
                    />
                    <div className="flex items-center justify-center">
                        <RadioGroupField
                            name="serviceType"
                            label="Service Type"
                            options={CATERING_SERVICE_TYPES}
                            required
                        />
                    </div>
                </FormRow>
            </FormSection>

            <FormDivider />

            <FormSection 
                title="Cuisine & Dietary Options" 
                description="What types of cuisine do you offer and what dietary restrictions can you accommodate?"
            >
                <CheckboxGroupField
                    name="cuisineTypes"
                    label="Cuisine Types Offered"
                    options={CUISINE_TYPES}
                    columns={2}
                />
                
                <CheckboxGroupField
                    name="dietaryOptions"
                    label="Dietary Accommodations"
                    options={DIETARY_OPTIONS}
                    columns={2}
                />
            </FormSection>

            <FormDivider />

            <FormSection 
                title="Service Description" 
                description="Tell clients about your services and what makes you unique."
            >
                <TextareaField
                    name="description"
                    label="Service Description"
                    placeholder="Describe your catering services, specialties, and what makes your service unique."
                    rows={4}
                    required
                />
                
                <TextareaField
                    name="menuOptions"
                    label="Sample Menu Options"
                    placeholder="Provide examples of your menu items, packages, or customizable options."
                    rows={3}
                />
                
                <TextareaField
                    name="specialRequirements"
                    label="Special Requirements or Restrictions"
                    placeholder="Any specific requirements, minimum orders, or important information for potential clients."
                    rows={3}
                />
            </FormSection>

            <FormDivider />

            <FormSection 
                title="Media" 
                description="Showcase your work with photos of your food and events."
            >
                <FileUploader />
            </FormSection>
        </div>
    );
}
