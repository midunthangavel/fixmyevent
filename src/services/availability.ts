import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  DailyAvailability, 
  WeeklySchedule, 
  RecurringAvailability, 
  BlockedTime,
  AvailabilityConflict,
  AvailabilitySettings,
  TimeSlot
} from '@/types/availability';

// Collection names
export const COLLECTIONS = {
  DAILY_AVAILABILITY: 'daily_availability',
  WEEKLY_SCHEDULES: 'weekly_schedules',
  RECURRING_AVAILABILITY: 'recurring_availability',
  BLOCKED_TIMES: 'blocked_times',
  AVAILABILITY_CONFLICTS: 'availability_conflicts',
  AVAILABILITY_UPDATES: 'availability_updates',
  AVAILABILITY_SETTINGS: 'availability_settings',
} as const;

// Availability service class
export class AvailabilityService {
  private dailyAvailabilityRef = collection(db, COLLECTIONS.DAILY_AVAILABILITY);
  private weeklySchedulesRef = collection(db, COLLECTIONS.WEEKLY_SCHEDULES);
  private recurringAvailabilityRef = collection(db, COLLECTIONS.RECURRING_AVAILABILITY);
  private blockedTimesRef = collection(db, COLLECTIONS.BLOCKED_TIMES);
  private conflictsRef = collection(db, COLLECTIONS.AVAILABILITY_CONFLICTS);

  private settingsRef = collection(db, COLLECTIONS.AVAILABILITY_SETTINGS);

  // Create daily availability
  async createDailyAvailability(availabilityData: Omit<DailyAvailability, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const availability = {
        ...availabilityData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.dailyAvailabilityRef, {
        ...availability,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating daily availability:', error);
      throw error;
    }
  }

  // Get daily availability for a user and date range
  async getDailyAvailability(userId: string, startDate: Date, endDate: Date): Promise<DailyAvailability[]> {
    try {
      const q = query(
        this.dailyAvailabilityRef,
        where('userId', '==', userId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as DailyAvailability[];
    } catch (error) {
      console.error('Error getting daily availability:', error);
      return [];
    }
  }

  // Update daily availability
  async updateDailyAvailability(availabilityId: string, updateData: Partial<DailyAvailability>): Promise<void> {
    try {
      const docRef = doc(this.dailyAvailabilityRef, availabilityId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating daily availability:', error);
      throw error;
    }
  }

  // Create weekly schedule
  async createWeeklySchedule(scheduleData: Omit<WeeklySchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const schedule = {
        ...scheduleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.weeklySchedulesRef, {
        ...schedule,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating weekly schedule:', error);
      throw error;
    }
  }

  // Get weekly schedule for a user
  async getWeeklySchedule(userId: string, weekStartDate: Date): Promise<WeeklySchedule | null> {
    try {
      const q = query(
        this.weeklySchedulesRef,
        where('userId', '==', userId),
        where('weekStartDate', '==', weekStartDate)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        if (!doc) return null;
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          weekStartDate: data.weekStartDate?.toDate() || new Date(),
          weekEndDate: data.weekEndDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as WeeklySchedule;
      }
      return null;
    } catch (error) {
      console.error('Error getting weekly schedule:', error);
      return null;
    }
  }

  // Create recurring availability
  async createRecurringAvailability(availabilityData: Omit<RecurringAvailability, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const availability = {
        ...availabilityData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.recurringAvailabilityRef, {
        ...availability,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating recurring availability:', error);
      throw error;
    }
  }

  // Get recurring availability for a user
  async getRecurringAvailability(userId: string): Promise<RecurringAvailability[]> {
    try {
      const q = query(
        this.recurringAvailabilityRef,
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        pattern: {
          ...doc.data().pattern,
          startDate: doc.data().pattern.startDate?.toDate() || new Date(),
          endDate: doc.data().pattern.endDate?.toDate() || new Date(),
        },
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as RecurringAvailability[];
    } catch (error) {
      console.error('Error getting recurring availability:', error);
      return [];
    }
  }

  // Create blocked time
  async createBlockedTime(blockedTimeData: Omit<BlockedTime, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const blockedTime = {
        ...blockedTimeData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.blockedTimesRef, {
        ...blockedTime,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating blocked time:', error);
      throw error;
    }
  }

  // Get blocked times for a user
  async getBlockedTimes(userId: string, startDate?: Date, endDate?: Date): Promise<BlockedTime[]> {
    try {
      let q = query(
        this.blockedTimesRef,
        where('userId', '==', userId),
        orderBy('startDateTime', 'asc')
      );

      if (startDate && endDate) {
        q = query(
          q,
          where('startDateTime', '>=', startDate),
          where('startDateTime', '<=', endDate)
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDateTime: doc.data().startDateTime?.toDate() || new Date(),
        endDateTime: doc.data().endDateTime?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as BlockedTime[];
    } catch (error) {
      console.error('Error getting blocked times:', error);
      return [];
    }
  }

  // Check availability for a specific time slot
  async checkAvailability(userId: string, startTime: Date, endTime: Date): Promise<{
    isAvailable: boolean;
    conflicts: any[];
    suggestedSlots: Date[];
  }> {
    try {
      const conflicts: any[] = [];
      let isAvailable = true;

      // Check daily availability
      const dailyAvailability = await this.getDailyAvailability(
        userId, 
        new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate()),
        new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate())
      );

      if (dailyAvailability.length > 0) {
        const dayAvailability = dailyAvailability[0];
        if (dayAvailability) {
          // Check if it's a working day
          if (!dayAvailability.isWorkingDay) {
            isAvailable = false;
            conflicts.push({
              type: 'non_working_day',
              reason: 'Not a working day',
              severity: 'high'
            });
          }

          // Check time slots
          for (const slot of dayAvailability.timeSlots || []) {
            if (!slot.startTime || !slot.endTime) continue;
            
            const startTimeParts = slot.startTime.split(':');
            const endTimeParts = slot.endTime.split(':');
            
            if (startTimeParts.length >= 2 && endTimeParts.length >= 2) {
              const startHour = parseInt(startTimeParts[0]!);
              const startMinute = parseInt(startTimeParts[1]!);
              const endHour = parseInt(endTimeParts[0]!);
              const endMinute = parseInt(endTimeParts[1]!);
              
              if (!isNaN(startHour) && !isNaN(startMinute) && !isNaN(endHour) && !isNaN(endMinute)) {
                const slotStart = new Date(startTime);
                const slotEnd = new Date(startTime);
                slotStart.setHours(startHour, startMinute);
                slotEnd.setHours(endHour, endMinute);
                
                if (startTime < slotEnd && endTime > slotStart) {
                  isAvailable = false;
                  conflicts.push({
                    type: 'slot_unavailable',
                    reason: 'Time slot is not available or fully booked',
                    severity: 'medium',
                    slot
                  });
                }
              }
            }
          }
        }
      }

      // Check blocked times
      const blockedTimes = await this.getBlockedTimes(userId, startTime, endTime);
      for (const blocked of blockedTimes) {
        if (startTime < blocked.endDateTime && endTime > blocked.startDateTime) {
          isAvailable = false;
          conflicts.push({
            type: 'blocked_time',
            reason: blocked.reason || 'Time is blocked',
            severity: 'high',
            blockedTime: blocked
          });
        }
      }

      // Generate suggested slots if not available
      const suggestedSlots: Date[] = [];
      if (!isAvailable) {
        suggestedSlots.push(
          new Date(startTime.getTime() + 60 * 60 * 1000), // 1 hour later
          new Date(startTime.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
          new Date(startTime.getTime() + 24 * 60 * 60 * 1000) // Next day
        );
      }

      return {
        isAvailable,
        conflicts,
        suggestedSlots
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      return {
        isAvailable: false,
        conflicts: [],
        suggestedSlots: []
      };
    }
  }

  // Book time slot
  async bookTimeSlot(userId: string, startTime: Date, endTime: Date, bookingId: string): Promise<boolean> {
    try {
      const availability = await this.checkAvailability(userId, startTime, endTime);
      
      if (!availability.isAvailable) {
        throw new Error('Time slot is not available');
      }

      // Create or update daily availability
      const date = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
      const existingAvailability = await this.getDailyAvailability(userId, date, date);
      
      if (existingAvailability.length > 0) {
        // Update existing availability
        const dayAvailability = existingAvailability[0];
        const timeSlot: TimeSlot = {
          id: crypto.randomUUID(),
          startTime: startTime.toTimeString().slice(0, 5),
          endTime: endTime.toTimeString().slice(0, 5),
          duration: (endTime.getTime() - startTime.getTime()) / (1000 * 60),
          isAvailable: false,
          maxBookings: 1,
          currentBookings: 1,
          notes: `Booked by ${bookingId}`
        };

        if (dayAvailability) {
          dayAvailability.timeSlots.push(timeSlot);
          dayAvailability.totalBookings += 1;

          await this.updateDailyAvailability(dayAvailability.id, dayAvailability);
        }
      } else {
        // Create new daily availability
        const newAvailability: Omit<DailyAvailability, 'id' | 'createdAt' | 'updatedAt'> = {
          userId,
          date,
          isWorkingDay: true,
          workingHours: {
            start: '09:00',
            end: '17:00'
          },
          timeSlots: [{
            id: crypto.randomUUID(),
            startTime: startTime.toTimeString().slice(0, 5),
            endTime: endTime.toTimeString().slice(0, 5),
            duration: (endTime.getTime() - startTime.getTime()) / (1000 * 60),
            isAvailable: false,
            maxBookings: 1,
            currentBookings: 1,
            notes: `Booked by ${bookingId}`
          }],
          exceptions: [],
          totalBookings: 1,
          maxBookings: undefined
        };

        await this.createDailyAvailability(newAvailability);
      }

      return true;
    } catch (error) {
      console.error('Error booking time slot:', error);
      return false;
    }
  }

  // Release time slot
  async releaseTimeSlot(userId: string, startTime: Date, endTime: Date, bookingId: string): Promise<boolean> {
    try {
      const date = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
      const existingAvailability = await this.getDailyAvailability(userId, date, date);
      
      if (existingAvailability.length > 0) {
        const dayAvailability = existingAvailability[0];
        
        // Find and update the time slot
        if (dayAvailability) {
          const timeSlotIndex = dayAvailability.timeSlots.findIndex(slot => 
            slot.startTime === startTime.toTimeString().slice(0, 5) &&
            slot.endTime === endTime.toTimeString().slice(0, 5) &&
            slot.notes?.includes(bookingId)
          );

          if (timeSlotIndex !== -1) {
            const timeSlot = dayAvailability.timeSlots[timeSlotIndex];
            if (timeSlot) {
              timeSlot.isAvailable = true;
              timeSlot.currentBookings = Math.max(0, timeSlot.currentBookings - 1);
              timeSlot.notes = timeSlot.currentBookings === 0 ? undefined : timeSlot.notes;
            }
            
            dayAvailability.totalBookings = Math.max(0, dayAvailability.totalBookings - 1);

            await this.updateDailyAvailability(dayAvailability.id, dayAvailability);
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Error releasing time slot:', error);
      return false;
    }
  }

  // Create availability conflict
  async createAvailabilityConflict(conflictData: Omit<AvailabilityConflict, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const conflict = {
        ...conflictData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.conflictsRef, {
        ...conflict,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating availability conflict:', error);
      throw error;
    }
  }

  // Get availability conflicts for a user
  async getAvailabilityConflicts(userId: string): Promise<AvailabilityConflict[]> {
    try {
      const q = query(
        this.conflictsRef,
        where('userId', '==', userId),
        where('status', '==', 'open'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as AvailabilityConflict[];
    } catch (error) {
      console.error('Error getting availability conflicts:', error);
      return [];
    }
  }

  // Resolve availability conflict
  async resolveAvailabilityConflict(conflictId: string, _resolution: string, notes?: string): Promise<void> {
    try {
      const docRef = doc(this.conflictsRef, conflictId);
      await updateDoc(docRef, {
        status: 'resolved',
        resolvedAt: serverTimestamp(),
        resolutionNotes: notes,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error resolving availability conflict:', error);
      throw error;
    }
  }

  // Get or create availability settings
  async getOrCreateSettings(userId: string): Promise<AvailabilitySettings | null> {
    try {
      const q = query(this.settingsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        if (!doc) return null;
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as AvailabilitySettings;
      }

      // Create default settings
      const defaultSettings: Omit<AvailabilitySettings, 'id' | 'createdAt' | 'updatedAt'> = {
        userId,
        general: {
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          workingDays: [1, 2, 3, 4, 5],
          workingHours: {
            start: '09:00',
            end: '17:00',
          },
        },
        booking: {
          advanceBookingLimit: 365,
          sameDayBooking: false,
          lastMinuteBooking: false,
          lastMinuteThreshold: 24,
          maxBookingsPerSlot: 1,
          bufferTime: 15,
          autoConfirm: false,
          requireApproval: true,
        },
        notifications: {
          email: true,
          push: true,
          sms: false,
          reminderTime: 24,
        },
        privacy: {
          showAvailability: true,
          showEventDetails: false,
          allowBookingRequests: true,
          requireContactInfo: true,
        },
      };

      const docRef = await addDoc(this.settingsRef, {
        ...defaultSettings,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        id: docRef.id,
        ...defaultSettings,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error getting or creating availability settings:', error);
      throw error;
    }
  }

  // Update availability settings
  async updateSettings(userId: string, updateData: Partial<AvailabilitySettings>): Promise<void> {
    try {
      const q = query(this.settingsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        if (!docSnapshot) return;
        const docRef = doc(this.settingsRef, docSnapshot.id);
        await updateDoc(docRef, {
          ...updateData,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error updating availability settings:', error);
      throw error;
    }
  }

  // Real-time availability updates
  subscribeToUserAvailability(userId: string, callback: (availability: DailyAvailability[]) => void) {
    const q = query(
      this.dailyAvailabilityRef,
      where('userId', '==', userId),
      orderBy('date', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const availability = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as DailyAvailability[];
      
      callback(availability);
    });
  }

  // Real-time conflict updates
  subscribeToUserConflicts(userId: string, callback: (conflicts: AvailabilityConflict[]) => void) {
    const q = query(
      this.conflictsRef,
      where('userId', '==', userId),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const conflicts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as AvailabilityConflict[];
      
      callback(conflicts);
    });
  }
}

// Export singleton instance
export const availabilityService = new AvailabilityService();
