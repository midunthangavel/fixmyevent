'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { bookingService } from '@/services/bookings';
import type { Listing } from '@/services/listings';

const bookingFormSchema = z.object({
  totalAmount: z.number().min(0),
  advanceAmount: z.number().min(0),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  listing: Listing;
  onSuccess?: (bookingId: string) => void;
  onCancel?: () => void;
}

export function BookingForm({ listing, onSuccess, onCancel }: BookingFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      totalAmount: 0,
      advanceAmount: 0,
      notes: '',
    },
  });


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
        status: 'Pending' as const,
        category: listing.category as any,
        userId: user.uid,
        serviceId: listing.id || '',
        serviceName: listing.name,
        serviceImage: listing.image || '',
        serviceLocation: listing.location || '',
        serviceHint: listing.hint || '',
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
