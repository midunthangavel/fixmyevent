'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader, CreditCard, Clock, Users, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { bookingService } from '@/services/bookings';
import { bookingSchema, type BookingFormValues } from '@/types/booking';
import type { Listing } from '@/types/listing';

interface BookingFormProps {
  listing: Listing;
  onSuccess?: (bookingId: string) => void;
  onCancel?: () => void;
}

export function BookingForm({ listing, onSuccess, onCancel }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      userId: user?.uid || '',
      serviceId: listing.id || '',
      serviceName: listing.name,
      serviceImage: listing.image || '',
      serviceLocation: listing.location || '',
      serviceHint: listing.hint || '',
      category: listing.category,
      status: 'Pending',
      totalAmount: 0,
      advanceAmount: 0,
      remainingAmount: 0,
      notes: '',
      // Category-specific defaults
      guestCount: 1,
      startTime: '10:00',
      endTime: '18:00',
      mealType: 'Dinner',
      serviceStyle: 'Buffet',
      packageType: 'Standard',
      hoursOfCoverage: 4,
      vehicleType: 'Sedan',
      theme: 'Classic',
      serviceType: 'Consultation',
      quantity: 100,
      designType: 'Traditional',
      serviceLevel: 'Partial Planning',
      staffCount: 2,
      roles: ['Server', 'Host'],
    },
  });

  const category = form.watch('category');
  const totalAmount = form.watch('totalAmount');
  const advanceAmount = form.watch('advanceAmount');

  // Calculate remaining amount
  const remainingAmount = totalAmount - advanceAmount;

  const onSubmit = async (data: BookingFormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to make a booking.',
      });
      return;
    }

    if (!selectedDate) {
      toast({
        variant: 'destructive',
        title: 'Date Required',
        description: 'Please select a booking date.',
      });
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        ...data,
        bookingDate: selectedDate,
        remainingAmount,
      };

      const bookingId = await bookingService.createBooking(bookingData);
      
      toast({
        title: 'Booking Created',
        description: 'Your booking request has been submitted successfully.',
      });

      onSuccess?.(bookingId);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: error instanceof Error ? error.message : 'Failed to create booking. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCategorySpecificFields = () => {
    switch (category) {
      case 'Venue':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guestCount">Guest Count</Label>
                <Input
                  id="guestCount"
                  type="number"
                  min="1"
                  {...form.register('guestCount', { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...form.register('startTime')}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  {...form.register('endTime')}
                />
              </div>
              <div>
                <Label htmlFor="setupTime">Setup Time (Optional)</Label>
                <Input
                  id="setupTime"
                  type="time"
                  {...form.register('setupTime')}
                />
              </div>
            </div>
          </div>
        );

      case 'Catering':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guestCount">Guest Count</Label>
                <Input
                  id="guestCount"
                  type="number"
                  min="1"
                  {...form.register('guestCount', { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="mealType">Meal Type</Label>
                <Select onValueChange={(value) => form.setValue('mealType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Breakfast">Breakfast</SelectItem>
                    <SelectItem value="Lunch">Lunch</SelectItem>
                    <SelectItem value="Dinner">Dinner</SelectItem>
                    <SelectItem value="Snacks">Snacks</SelectItem>
                    <SelectItem value="Full Day">Full Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceStyle">Service Style</Label>
                <Select onValueChange={(value) => form.setValue('serviceStyle', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buffet">Buffet</SelectItem>
                    <SelectItem value="Plated">Plated</SelectItem>
                    <SelectItem value="Family Style">Family Style</SelectItem>
                    <SelectItem value="Food Stations">Food Stations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="staffCount">Staff Count (Optional)</Label>
                <Input
                  id="staffCount"
                  type="number"
                  min="1"
                  {...form.register('staffCount', { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>
        );

      case 'Photography':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="packageType">Package Type</Label>
                <Input
                  id="packageType"
                  placeholder="e.g., Basic, Premium, Deluxe"
                  {...form.register('packageType')}
                />
              </div>
              <div>
                <Label htmlFor="hoursOfCoverage">Hours of Coverage</Label>
                <Input
                  id="hoursOfCoverage"
                  type="number"
                  min="1"
                  {...form.register('hoursOfCoverage', { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  {...form.register('deliveryDate')}
                />
              </div>
              <div>
                <Label htmlFor="photoCount">Expected Photo Count (Optional)</Label>
                <Input
                  id="photoCount"
                  type="number"
                  min="1"
                  {...form.register('photoCount', { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="videoIncluded"
                  {...form.register('videoIncluded')}
                />
                <Label htmlFor="videoIncluded">Video Included</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="droneCoverage"
                  {...form.register('droneCoverage')}
                />
                <Label htmlFor="droneCoverage">Drone Coverage</Label>
              </div>
            </div>
          </div>
        );

      case 'Transport':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Input
                  id="vehicleType"
                  placeholder="e.g., Sedan, SUV, Limo, Bus"
                  {...form.register('vehicleType')}
                />
              </div>
              <div>
                <Label htmlFor="passengerCount">Passenger Count</Label>
                <Input
                  id="passengerCount"
                  type="number"
                  min="1"
                  {...form.register('passengerCount', { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupLocation">Pickup Location</Label>
                <Input
                  id="pickupLocation"
                  placeholder="Pickup address"
                  {...form.register('pickupLocation')}
                />
              </div>
              <div>
                <Label htmlFor="dropoffLocation">Dropoff Location</Label>
                <Input
                  id="dropoffLocation"
                  placeholder="Dropoff address"
                  {...form.register('dropoffLocation')}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="returnTrip"
                {...form.register('returnTrip')}
              />
              <Label htmlFor="returnTrip">Return Trip Required</Label>
            </div>
          </div>
        );

      case 'Decorations':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  placeholder="e.g., Rustic, Modern, Vintage"
                  {...form.register('theme')}
                />
              </div>
              <div>
                <Label htmlFor="colorScheme">Color Scheme (Optional)</Label>
                <Input
                  id="colorScheme"
                  placeholder="e.g., Blue and Gold, Pink and White"
                  {...form.register('colorScheme')}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="setupDate">Setup Date</Label>
                <Input
                  id="setupDate"
                  type="date"
                  {...form.register('setupDate')}
                />
              </div>
              <div>
                <Label htmlFor="teardownDate">Teardown Date (Optional)</Label>
                <Input
                  id="teardownDate"
                  type="date"
                  {...form.register('teardownDate')}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fullService"
                {...form.register('fullService')}
              />
              <Label htmlFor="fullService">Full Service (Setup + Teardown)</Label>
            </div>
          </div>
        );

      case 'Legal':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceType">Service Type</Label>
                <Input
                  id="serviceType"
                  placeholder="e.g., Marriage Registration, Document Review"
                  {...form.register('serviceType')}
                />
              </div>
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select onValueChange={(value) => form.setValue('urgency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="consultationDate">Consultation Date (Optional)</Label>
              <Input
                id="consultationDate"
                type="date"
                {...form.register('consultationDate')}
              />
            </div>
          </div>
        );

      case 'Music':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceType">Service Type</Label>
                <Select onValueChange={(value) => form.setValue('serviceType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Live Band">Live Band</SelectItem>
                    <SelectItem value="DJ">DJ</SelectItem>
                    <SelectItem value="Solo Artist">Solo Artist</SelectItem>
                    <SelectItem value="Karaoke">Karaoke</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...form.register('startTime')}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  {...form.register('endTime')}
                />
              </div>
              <div>
                <Label htmlFor="equipmentProvided">Equipment Provided</Label>
                <Select onValueChange={(value) => form.setValue('equipmentProvided', value === 'true')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Equipment provided?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'Invitations':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  {...form.register('quantity', { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="designType">Design Type</Label>
                <Input
                  id="designType"
                  placeholder="e.g., Traditional, Modern, Custom"
                  {...form.register('designType')}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paperType">Paper Type (Optional)</Label>
                <Input
                  id="paperType"
                  placeholder="e.g., Matte, Glossy, Textured"
                  {...form.register('paperType')}
                />
              </div>
              <div>
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  {...form.register('deliveryDate')}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="customDesign"
                {...form.register('customDesign')}
              />
              <Label htmlFor="customDesign">Custom Design Required</Label>
            </div>
          </div>
        );

      case 'Planner':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceLevel">Service Level</Label>
                <Select onValueChange={(value) => form.setValue('serviceLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Service">Full Service</SelectItem>
                    <SelectItem value="Partial Planning">Partial Planning</SelectItem>
                    <SelectItem value="Day-of Coordination">Day-of Coordination</SelectItem>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  {...form.register('eventDate')}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="planningStartDate">Planning Start Date (Optional)</Label>
                <Input
                  id="planningStartDate"
                  type="date"
                  {...form.register('planningStartDate')}
                />
              </div>
              <div>
                <Label htmlFor="meetingsIncluded">Meetings Included (Optional)</Label>
                <Input
                  id="meetingsIncluded"
                  type="number"
                  min="1"
                  {...form.register('meetingsIncluded', { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="vendorCoordination"
                {...form.register('vendorCoordination')}
              />
              <Label htmlFor="vendorCoordination">Vendor Coordination Required</Label>
            </div>
          </div>
        );

      case 'Event Staff':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="staffCount">Staff Count</Label>
                <Input
                  id="staffCount"
                  type="number"
                  min="1"
                  {...form.register('staffCount', { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...form.register('startTime')}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  {...form.register('endTime')}
                />
              </div>
              <div>
                <Label htmlFor="roles">Roles (Comma separated)</Label>
                <Input
                  id="roles"
                  placeholder="e.g., Server, Host, Bartender"
                  {...form.register('roles')}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uniformProvided"
                  {...form.register('uniformProvided')}
                />
                <Label htmlFor="uniformProvided">Uniform Provided</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trainingRequired"
                  {...form.register('trainingRequired')}
                />
                <Label htmlFor="trainingRequired">Training Required</Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Book {listing.name}
            </CardTitle>
            <CardDescription>
              Complete the form below to book this {listing.category.toLowerCase()} service.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date Selection */}
            <div>
              <Label>Booking Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Category-specific fields */}
            {renderCategorySpecificFields()}

            {/* Pricing Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="totalAmount">Total Amount ($)</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    {...form.register('totalAmount', { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="advanceAmount">Advance Amount ($)</Label>
                  <Input
                    id="advanceAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    max={totalAmount}
                    {...form.register('advanceAmount', { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label>Remaining Amount</Label>
                  <div className="p-2 bg-muted rounded-md">
                    ${remainingAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special requirements or additional information..."
                {...form.register('notes')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading || !selectedDate}>
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Creating Booking...
              </>
            ) : (
              'Create Booking'
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
