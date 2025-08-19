
'use client';

import { useState } from 'react';
import { DateRange, DayPicker, SelectRangeEventHandler } from 'react-day-picker';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AvailabilityCalendarProps {
    onUpdate: (availability: { available: Date[], booked: Date[], pending: Date[] }) => void;
}

export function AvailabilityCalendar({ onUpdate }: AvailabilityCalendarProps) {
    const [bookedDates, setBookedDates] = useState<Date[]>([]);
    const [pendingDates, setPendingDates] = useState<Date[]>([]);
    const [availableDates, setAvailableDates] = useState<Date[]>([]);
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

    const handleSetStatus = (status: 'available' | 'booked' | 'pending') => {
        if (!selectedRange || !selectedRange.from) return;

        let datesInRange: Date[] = [];
        const start = selectedRange.from;
        const end = selectedRange.to || start;

        let currentDate = new Date(start);
        while (currentDate <= end) {
            datesInRange.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const updateState = (setter: React.Dispatch<React.SetStateAction<Date[]>>, newDates: Date[]) => {
            setter(prev => [...prev.filter(d => !datesInRange.some(nd => nd.getTime() === d.getTime())), ...newDates]);
        };
        const removeState = (setter: React.Dispatch<React.SetStateAction<Date[]>>) => {
             setter(prev => prev.filter(d => !datesInRange.some(nd => nd.getTime() === d.getTime())));
        }

        // Clear dates from other statuses before setting the new one
        removeState(setAvailableDates);
        removeState(setBookedDates);
        removeState(setPendingDates);

        switch (status) {
            case 'available':
                setAvailableDates(prev => [...prev, ...datesInRange]);
                break;
            case 'booked':
                setBookedDates(prev => [...prev, ...datesInRange]);
                break;
            case 'pending':
                 setPendingDates(prev => [...prev, ...datesInRange]);
                break;
        }

        // Lift state up
        onUpdate({
            available: availableDates,
            booked: bookedDates,
            pending: pendingDates,
        });
        
        setSelectedRange(undefined);
    };
    
    return (
        <Card className="p-4 border-dashed">
            <div className="md:grid md:grid-cols-2 md:gap-6">
                <div>
                <DayPicker
                    mode="range"
                    selected={selectedRange}
                    onSelect={setSelectedRange as SelectRangeEventHandler}
                    modifiers={{
                        booked: bookedDates,
                        pending: pendingDates,
                        available: availableDates,
                    }}
                    modifiersStyles={{
                        booked: {
                            color: 'hsl(var(--destructive-foreground))',
                            backgroundColor: 'hsl(var(--destructive))',
                            opacity: 0.8,
                        },
                        pending: {
                            backgroundColor: 'hsl(var(--primary) / 0.2)',
                        },
                         available: {
                            backgroundColor: 'hsl(var(--muted))',
                         }
                    }}
                    disabled={{ before: new Date() }}
                />
                </div>
                 <div className="mt-4 md:mt-0 space-y-3">
                    <div>
                        <h4 className="font-medium text-sm mb-2">Instructions</h4>
                        <ol className="list-decimal list-inside text-xs text-muted-foreground space-y-1">
                            <li>Select a single date or a range of dates on the calendar.</li>
                            <li>Click one of the status buttons below to mark the selected dates.</li>
                            <li>Repeat to build your availability.</li>
                        </ol>
                    </div>
                     <div>
                        <h4 className="font-medium text-sm mb-2">Set Status for Selected Dates</h4>
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleSetStatus('available')} disabled={!selectedRange}>Mark as Available</Button>
                            <Button size="sm" variant="outline" onClick={() => handleSetStatus('pending')} disabled={!selectedRange}>Mark as Pending</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleSetStatus('booked')} disabled={!selectedRange}>Mark as Booked</Button>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-medium text-sm mb-2">Legend</h4>
                        <div className="flex flex-wrap gap-2 text-xs">
                             <Badge variant="secondary">Selected</Badge>
                             <Badge className="bg-destructive text-destructive-foreground">Booked</Badge>
                             <Badge className="bg-primary/20 text-primary-foreground">Pending</Badge>
                             <Badge className="bg-muted text-muted-foreground">Available</Badge>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
