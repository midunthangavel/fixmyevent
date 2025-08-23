import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  CalendarEvent, 
  CalendarIntegration, 
  AvailabilitySlot, 
  CalendarSettings,
  SyncResult 
} from '@/types/calendar';
import { Logger } from '@/lib/logger';

// Collection names
export const COLLECTIONS = {
  CALENDAR_EVENTS: 'calendar_events',
  CALENDAR_INTEGRATIONS: 'calendar_integrations',
  AVAILABILITY_SLOTS: 'availability_slots',
  CALENDAR_SETTINGS: 'calendar_settings',
} as const;

// Calendar service class
export class CalendarService {
  private eventsRef = collection(db, COLLECTIONS.CALENDAR_EVENTS);
  private integrationsRef = collection(db, COLLECTIONS.CALENDAR_INTEGRATIONS);
  private availabilityRef = collection(db, COLLECTIONS.AVAILABILITY_SLOTS);
  private settingsRef = collection(db, COLLECTIONS.CALENDAR_SETTINGS);

  // Create calendar event
  async createEvent(eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const event = {
        ...eventData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.eventsRef, {
        ...event,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // If this is a booking event, sync with external calendars
      if (eventData.bookingId) {
        const eventWithId = { ...event, id: docRef.id };
        await this.syncEventToExternalCalendars(eventData.userId, eventWithId);
      }

      return docRef.id;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  // Get calendar events for a user
  async getUserEvents(userId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    try {
      let q = query(
        this.eventsRef,
        where('userId', '==', userId),
        orderBy('startTime', 'asc')
      );

      if (startDate && endDate) {
        q = query(
          q,
          where('startTime', '>=', startDate),
          where('startTime', '<=', endDate)
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate() || new Date(),
        endTime: doc.data().endTime?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as CalendarEvent[];
    } catch (error) {
      console.error('Error getting user events:', error);
      return [];
    }
  }

  // Update calendar event
  async updateEvent(eventId: string, updateData: Partial<CalendarEvent>): Promise<void> {
    try {
      const docRef = doc(this.eventsRef, eventId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });

      // Sync changes to external calendars
      const event = await this.getEventById(eventId);
      if (event && event.bookingId) {
        await this.syncEventToExternalCalendars(event.userId, event);
      }
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  // Delete calendar event
  async deleteEvent(eventId: string): Promise<void> {
    try {
      const event = await this.getEventById(eventId);
      if (event) {
        // Remove from external calendars
        await this.removeEventFromExternalCalendars(event.userId, event);
      }

      const docRef = doc(this.eventsRef, eventId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  // Get event by ID
  async getEventById(eventId: string): Promise<CalendarEvent | null> {
    try {
      const docRef = doc(this.eventsRef, eventId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          startTime: data.startTime?.toDate() || new Date(),
          endTime: data.endTime?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as CalendarEvent;
      }
      return null;
    } catch (error) {
      console.error('Error getting event by ID:', error);
      return null;
    }
  }

  // Create calendar integration
  async createIntegration(integrationData: Omit<CalendarIntegration, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const integration = {
        ...integrationData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.integrationsRef, {
        ...integration,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating calendar integration:', error);
      throw error;
    }
  }

  // Get user's calendar integrations
  async getUserIntegrations(userId: string): Promise<CalendarIntegration[]> {
    try {
      const q = query(
        this.integrationsRef,
        where('userId', '==', userId),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as CalendarIntegration[];
    } catch (error) {
      console.error('Error getting user integrations:', error);
      return [];
    }
  }

  // Sync events with external calendars
  async syncWithExternalCalendars(userId: string): Promise<SyncResult> {
    try {
      const integrations = await this.getUserIntegrations(userId);
      const result: SyncResult = {
        success: true,
        eventsCreated: 0,
        eventsUpdated: 0,
        eventsDeleted: 0,
        conflicts: [],
        errors: [],
        lastSyncAt: new Date(),
      };

      for (const integration of integrations) {
        try {
          if (integration.provider === 'google') {
            await this.syncWithGoogleCalendar(integration, result);
          } else if (integration.provider === 'outlook') {
            await this.syncWithOutlookCalendar(integration, result);
          }
        } catch (error) {
          result.errors.push(`Failed to sync with ${integration.provider}: ${error}`);
        }
      }

      // Update last sync time
      for (const integration of integrations) {
        const docRef = doc(this.integrationsRef, integration.id);
        await updateDoc(docRef, {
          lastSyncAt: serverTimestamp(),
        });
      }

      return result;
    } catch (error) {
      console.error('Error syncing with external calendars:', error);
      return {
        success: false,
        eventsCreated: 0,
        eventsUpdated: 0,
        eventsDeleted: 0,
        conflicts: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        lastSyncAt: new Date(),
      };
    }
  }

  // Sync with Google Calendar
  private async syncWithGoogleCalendar(_integration: CalendarIntegration, result: SyncResult): Promise<void> {
    // In a real implementation, you would:
    // 1. Use Google Calendar API to fetch events
    // 2. Compare with local events
    // 3. Create/update/delete events as needed
    // 4. Handle conflicts

    // For demo purposes, simulate sync
    result.eventsCreated += Math.floor(Math.random() * 5);
    result.eventsUpdated += Math.floor(Math.random() * 3);
  }

  // Sync with Outlook Calendar
  private async syncWithOutlookCalendar(_integration: CalendarIntegration, result: SyncResult): Promise<void> {
    // In a real implementation, you would:
    // 1. Use Microsoft Graph API to fetch events
    // 2. Compare with local events
    // 3. Create/update/delete events as needed
    // 4. Handle conflicts

    // For demo purposes, simulate sync
    result.eventsCreated += Math.floor(Math.random() * 3);
    result.eventsUpdated += Math.floor(Math.random() * 2);
  }

  // Sync event to external calendars
  private async syncEventToExternalCalendars(userId: string, event: CalendarEvent): Promise<void> {
    try {
      const integrations = await this.getUserIntegrations(userId);
      
      for (const integration of integrations) {
        if (integration.settings.syncDirection === 'export' || integration.settings.syncDirection === 'bidirectional') {
          if (integration.provider === 'google') {
            await this.createGoogleCalendarEvent(integration, event);
          } else if (integration.provider === 'outlook') {
            await this.createOutlookCalendarEvent(integration, event);
          }
        }
      }
    } catch (error) {
      console.error('Error syncing event to external calendars:', error);
    }
  }

  // Remove event from external calendars
  private async removeEventFromExternalCalendars(userId: string, event: CalendarEvent): Promise<void> {
    try {
      const integrations = await this.getUserIntegrations(userId);
      
      for (const integration of integrations) {
        if (event.providerEventId) {
          if (integration.provider === 'google') {
            await this.deleteGoogleCalendarEvent(integration, event.providerEventId);
          } else if (integration.provider === 'outlook') {
            await this.deleteOutlookCalendarEvent(integration, event.providerEventId);
          }
        }
      }
    } catch (error) {
      console.error('Error removing event from external calendars:', error);
    }
  }

  // Create Google Calendar event
  private async createGoogleCalendarEvent(_integration: CalendarIntegration, event: CalendarEvent): Promise<void> {
    try {
      Logger.info(`Creating Google Calendar event: ${event.title}`);
      
      // In a real implementation, you would:
      // 1. Use Google Calendar API to create event
      // 2. Store the external event ID
      // 3. Handle any errors

      // For demo purposes, simulate creation
      // Implementation would go here
    } catch (error) {
      Logger.error(`Failed to create Google Calendar event: ${event.title}`, error, { event });
      throw error;
    }
  }

  // Create Outlook Calendar event
  private async createOutlookCalendarEvent(_integration: CalendarIntegration, event: CalendarEvent): Promise<void> {
    try {
      Logger.info(`Creating Outlook Calendar event: ${event.title}`);
      
      // In a real implementation, you would:
      // 1. Use Microsoft Graph API to create event
      // 2. Store the external event ID
      // 3. Handle any errors

      // For demo purposes, simulate creation
      // Implementation would go here
    } catch (error) {
      Logger.error(`Failed to create Outlook Calendar event: ${event.title}`, error, { event });
      throw error;
    }
  }

  // Delete Google Calendar event
  private async deleteGoogleCalendarEvent(_integration: CalendarIntegration, eventId: string): Promise<void> {
    try {
      Logger.info(`Deleting Google Calendar event: ${eventId}`);
      
      // In a real implementation, you would:
      // 1. Use Google Calendar API to delete event
      // 2. Handle any errors

      // For demo purposes, simulate deletion
      // Implementation would go here
    } catch (error) {
      Logger.error(`Failed to delete Google Calendar event: ${eventId}`, error, { eventId });
      throw error;
    }
  }

  // Delete Outlook Calendar event
  private async deleteOutlookCalendarEvent(_integration: CalendarIntegration, eventId: string): Promise<void> {
    try {
      Logger.info(`Deleting Outlook Calendar event: ${eventId}`);
      
      // In a real implementation, you would:
      // 1. Use Microsoft Graph API to delete event
      // 2. Handle any errors

      // For demo purposes, simulate deletion
      // Implementation would go here
    } catch (error) {
      Logger.error(`Failed to delete Outlook Calendar event: ${eventId}`, error, { eventId });
      throw error;
    }
  }

  // Create availability slot
  async createAvailabilitySlot(slotData: Omit<AvailabilitySlot, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const slot = {
        ...slotData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.availabilityRef, {
        ...slot,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating availability slot:', error);
      throw error;
    }
  }

  // Get availability slots for a user
  async getUserAvailabilitySlots(userId: string, startDate?: Date, endDate?: Date): Promise<AvailabilitySlot[]> {
    try {
      let q = query(
        this.availabilityRef,
        where('userId', '==', userId),
        orderBy('startTime', 'asc')
      );

      if (startDate && endDate) {
        q = query(
          q,
          where('startTime', '>=', startDate),
          where('startTime', '<=', endDate)
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate() || new Date(),
        endTime: doc.data().endTime?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as AvailabilitySlot[];
    } catch (error) {
      console.error('Error getting availability slots:', error);
      return [];
    }
  }

  // Get or create calendar settings
  async getOrCreateSettings(userId: string): Promise<CalendarSettings | null> {
    try {
      const q = query(this.settingsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        if (!docSnapshot) return null;
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as CalendarSettings;
      }

      // Create default settings
      const defaultSettings: Omit<CalendarSettings, 'id' | 'createdAt' | 'updatedAt'> = {
        userId,
        workingHours: {
          monday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
          tuesday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
          wednesday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
          thursday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
          friday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
          saturday: { isWorking: false, startTime: '10:00', endTime: '16:00' },
          sunday: { isWorking: false, startTime: '10:00', endTime: '16:00' },
        },
        timezone: 'UTC',
        defaultDuration: 60,
        bufferTime: 15,
        advanceBookingLimit: 365,
        sameDayBooking: false,
        autoConfirm: false,
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
      console.error('Error getting or creating calendar settings:', error);
      throw error;
    }
  }

  // Update calendar settings
  async updateSettings(userId: string, updateData: Partial<CalendarSettings>): Promise<void> {
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
      console.error('Error updating calendar settings:', error);
      throw error;
    }
  }

  // Real-time event updates
  subscribeToUserEvents(userId: string, callback: (events: CalendarEvent[]) => void) {
    const q = query(
      this.eventsRef,
      where('userId', '==', userId),
      orderBy('startTime', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const events = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate() || new Date(),
        endTime: doc.data().endTime?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as CalendarEvent[];
      
      callback(events);
    });
  }

  // Real-time availability updates
  subscribeToUserAvailability(userId: string, callback: (slots: AvailabilitySlot[]) => void) {
    const q = query(
      this.availabilityRef,
      where('userId', '==', userId),
      orderBy('startTime', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const slots = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate() || new Date(),
        endTime: doc.data().endTime?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as AvailabilitySlot[];
      
      callback(slots);
    });
  }
}

// Export singleton instance
export const calendarService = new CalendarService();
