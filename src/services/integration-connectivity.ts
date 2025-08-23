// Integration & Connectivity Service
// This service manages external integrations and connectivity features

import { 
  CalendarIntegration, 
  CalendarEvent, 
  CRMContact, 
  SocialMediaPost, 
  PaymentMethod, 
  RecurringBilling 
} from '@/types/productivity';

export interface CalendarSyncRequest {
  userId: string;
  provider: 'google' | 'outlook' | 'apple' | 'ical';
  accessToken: string;
  refreshToken?: string;
  calendarId: string;
  syncFrequency: 'realtime' | 'hourly' | 'daily';
}

export interface CRMSyncRequest {
  userId: string;
  provider: 'hubspot' | 'salesforce' | 'pipedrive' | 'zoho';
  apiKey: string;
  syncContacts: boolean;
  syncCompanies: boolean;
  syncDeals: boolean;
}

export interface SocialMediaPostRequest {
  eventId: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  content: string;
  mediaUrls: string[];
  scheduledDate: Date;
  tags?: string[];
}

export interface PaymentMethodRequest {
  userId: string;
  type: 'card' | 'bank_account' | 'paypal' | 'crypto' | 'local';
  provider: string;
  details: Record<string, any>;
  isDefault?: boolean;
}

export interface RecurringBillingRequest {
  userId: string;
  eventId: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  paymentMethodId: string;
  description: string;
}

export class IntegrationConnectivityService {
  private calendarIntegrations: Map<string, CalendarIntegration> = new Map();
  private calendarEvents: Map<string, CalendarEvent> = new Map();
  private crmContacts: Map<string, CRMContact> = new Map();
  private socialMediaPosts: Map<string, SocialMediaPost> = new Map();
  private paymentMethods: Map<string, PaymentMethod> = new Map();
  private recurringBillings: Map<string, RecurringBilling> = new Map();

  // ===== CALENDAR INTEGRATION =====

  async setupCalendarIntegration(request: CalendarSyncRequest): Promise<CalendarIntegration> {
    try {
      const integration: CalendarIntegration = {
        id: `calendar_${Date.now()}_${Math.random()}`,
        userId: request.userId,
        provider: request.provider,
        accessToken: request.accessToken,
        refreshToken: request.refreshToken,
        calendarId: request.calendarId,
        isActive: true,
        lastSync: new Date(),
        syncFrequency: request.syncFrequency
      };

      this.calendarIntegrations.set(integration.id, integration);
      
      // Start initial sync
      await this.syncCalendarEvents(integration.id);
      
      return integration;
    } catch (error) {
      console.error('Error setting up calendar integration:', error);
      throw new Error('Failed to setup calendar integration');
    }
  }

  async getCalendarIntegration(integrationId: string): Promise<CalendarIntegration | null> {
    try {
      return this.calendarIntegrations.get(integrationId) || null;
    } catch (error) {
      console.error('Error getting calendar integration:', error);
      return null;
    }
  }

  async getCalendarIntegrationsByUser(userId: string): Promise<CalendarIntegration[]> {
    try {
      return Array.from(this.calendarIntegrations.values())
        .filter(integration => integration.userId === userId && integration.isActive);
    } catch (error) {
      console.error('Error getting calendar integrations by user:', error);
      return [];
    }
  }

  async syncCalendarEvents(integrationId: string): Promise<CalendarEvent[]> {
    try {
      const integration = this.calendarIntegrations.get(integrationId);
      if (!integration) throw new Error('Calendar integration not found');

      // Simulate calendar sync based on provider
      const events = await this.fetchCalendarEventsFromProvider(integration);
      
      // Store synced events
      for (const event of events) {
        this.calendarEvents.set(event.id, event);
      }

      // Update last sync time
      integration.lastSync = new Date();
      this.calendarIntegrations.set(integrationId, integration);

      return events;
    } catch (error) {
      console.error('Error syncing calendar events:', error);
      return [];
    }
  }

  async createCalendarEvent(integrationId: string, eventData: Omit<CalendarEvent, 'id' | 'calendarId' | 'externalId' | 'lastSync'>): Promise<CalendarEvent | null> {
    try {
      const integration = this.calendarIntegrations.get(integrationId);
      if (!integration) return null;

      const event: CalendarEvent = {
        id: `event_${Date.now()}_${Math.random()}`,
        calendarId: integration.calendarId,
        eventId: eventData.eventId,
        title: eventData.title,
        description: eventData.description,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        location: eventData.location,
        attendees: eventData.attendees,
        isAllDay: eventData.isAllDay,
        recurrence: eventData.recurrence,
        externalId: `ext_${Date.now()}_${Math.random()}`,
        lastSync: new Date()
      };

      // Create event in external calendar
      await this.createEventInExternalCalendar(integration, event);
      
      // Store locally
      this.calendarEvents.set(event.id, event);
      
      return event;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return null;
    }
  }

  async updateCalendarEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    try {
      const event = this.calendarEvents.get(eventId);
      if (!event) return null;

      const updatedEvent = { ...event, ...updates, lastSync: new Date() };
      
      // Update in external calendar
      const integration = this.calendarIntegrations.get(event.calendarId);
      if (integration) {
        await this.updateEventInExternalCalendar(integration, updatedEvent);
      }
      
      // Update locally
      this.calendarEvents.set(eventId, updatedEvent);
      return updatedEvent;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      return null;
    }
  }

  async deleteCalendarEvent(eventId: string): Promise<boolean> {
    try {
      const event = this.calendarEvents.get(eventId);
      if (!event) return false;

      // Delete from external calendar
      const integration = this.calendarIntegrations.get(event.calendarId);
      if (integration) {
        await this.deleteEventFromExternalCalendar(integration, event);
      }

      // Delete locally
      this.calendarEvents.delete(eventId);
      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return false;
    }
  }

  // ===== CRM INTEGRATION =====

  async setupCRMIntegration(request: CRMSyncRequest): Promise<boolean> {
    try {
      // Simulate CRM setup
      console.log(`Setting up ${request.provider} CRM integration for user ${request.userId}`);
      
      // Start initial sync if requested
      if (request.syncContacts) {
        await this.syncCRMContacts(request.userId, request.provider, request.apiKey);
      }
      
      return true;
    } catch (error) {
      console.error('Error setting up CRM integration:', error);
      return false;
    }
  }

  async syncCRMContacts(_userId: string, provider: string, _apiKey: string): Promise<CRMContact[]> {
    try {
      // Simulate fetching contacts from CRM
      const contacts: CRMContact[] = [
        {
          id: `contact_${Date.now()}_1`,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1-555-0123',
          company: 'Event Corp',
          position: 'Event Manager',
          tags: ['event-planner', 'corporate'],
          notes: 'Interested in corporate event planning services',
          lastContact: new Date(),
          source: provider,
          status: 'prospect'
        },
        {
          id: `contact_${Date.now()}_2`,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+1-555-0456',
          company: 'Wedding Dreams',
          position: 'Owner',
          tags: ['wedding', 'small-business'],
          notes: 'Specializes in intimate wedding planning',
          lastContact: new Date(),
          source: provider,
          status: 'customer'
        }
      ];

      // Store contacts locally
      for (const contact of contacts) {
        this.crmContacts.set(contact.id, contact);
      }

      return contacts;
    } catch (error) {
      console.error('Error syncing CRM contacts:', error);
      return [];
    }
  }

  async getCRMContacts(_userId: string, filter?: {
    status?: string;
    tags?: string[];
    company?: string;
  }): Promise<CRMContact[]> {
    try {
      let contacts = Array.from(this.crmContacts.values());

      if (filter?.status) {
        contacts = contacts.filter(contact => contact.status === filter.status);
      }

      if (filter?.tags && filter.tags.length > 0) {
        contacts = contacts.filter(contact => 
          filter.tags!.some(tag => contact.tags.includes(tag))
        );
      }

      if (filter?.company) {
        contacts = contacts.filter(contact => 
          contact.company?.toLowerCase().includes(filter.company!.toLowerCase())
        );
      }

      return contacts.sort((a, b) => b.lastContact.getTime() - a.lastContact.getTime());
    } catch (error) {
      console.error('Error getting CRM contacts:', error);
      return [];
    }
  }

  // ===== SOCIAL MEDIA INTEGRATION =====

  async createSocialMediaPost(request: SocialMediaPostRequest): Promise<SocialMediaPost | null> {
    try {
      const post: SocialMediaPost = {
        id: `post_${Date.now()}_${Math.random()}`,
        eventId: request.eventId,
        platform: request.platform,
        content: request.content,
        mediaUrls: request.mediaUrls,
        scheduledDate: request.scheduledDate,
        status: 'draft',
        engagement: {
          likes: 0,
          shares: 0,
          comments: 0,
          clicks: 0
        }
      };

      this.socialMediaPosts.set(post.id, post);
      return post;
    } catch (error) {
      console.error('Error creating social media post:', error);
      return null;
    }
    }

  async scheduleSocialMediaPost(postId: string, scheduledDate: Date): Promise<SocialMediaPost | null> {
    try {
      const post = this.socialMediaPosts.get(postId);
      if (!post) return null;

      post.scheduledDate = scheduledDate;
      post.status = 'scheduled';
      
      this.socialMediaPosts.set(postId, post);
      return post;
    } catch (error) {
      console.error('Error scheduling social media post:', error);
      return null;
    }
  }

  async publishSocialMediaPost(postId: string): Promise<SocialMediaPost | null> {
    try {
      const post = this.socialMediaPosts.get(postId);
      if (!post) return null;

      // Simulate publishing to social media platform
      post.status = 'published';
      post.publishedAt = new Date();
      
      this.socialMediaPosts.set(postId, post);
      return post;
    } catch (error) {
      console.error('Error publishing social media post:', error);
      return null;
    }
  }

  async getSocialMediaPosts(eventId: string, platform?: string): Promise<SocialMediaPost[]> {
    try {
      let posts = Array.from(this.socialMediaPosts.values())
        .filter(post => post.eventId === eventId);

      if (platform) {
        posts = posts.filter(post => post.platform === platform);
      }

      return posts.sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
    } catch (error) {
      console.error('Error getting social media posts:', error);
      return [];
    }
  }

  async updateSocialMediaEngagement(postId: string, engagement: Partial<SocialMediaPost['engagement']>): Promise<SocialMediaPost | null> {
    try {
      const post = this.socialMediaPosts.get(postId);
      if (!post) return null;

      post.engagement = { ...post.engagement, ...engagement };
      this.socialMediaPosts.set(postId, post);
      
      return post;
    } catch (error) {
      console.error('Error updating social media engagement:', error);
      return null;
    }
  }

  // ===== PAYMENT METHOD EXPANSION =====

  async addPaymentMethod(request: PaymentMethodRequest): Promise<PaymentMethod | null> {
    try {
      const paymentMethod: PaymentMethod = {
        id: `payment_${Date.now()}_${Math.random()}`,
        userId: request.userId,
        type: request.type,
        provider: request.provider,
        lastFour: this.extractLastFour(request.details),
        expiryDate: this.extractExpiryDate(request.details),
        isDefault: request.isDefault || false,
        isActive: true,
        createdAt: new Date()
      };

      // If this is the first payment method, make it default
      if (this.getUserPaymentMethods(request.userId).length === 0) {
        paymentMethod.isDefault = true;
      }

      // If this is set as default, unset others
      if (paymentMethod.isDefault) {
        await this.unsetDefaultPaymentMethods(request.userId);
      }

      this.paymentMethods.set(paymentMethod.id, paymentMethod);
      return paymentMethod;
    } catch (error) {
      console.error('Error adding payment method:', error);
      return null;
    }
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      return Array.from(this.paymentMethods.values())
        .filter(method => method.userId === userId && method.isActive)
        .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
    } catch (error) {
      console.error('Error getting payment methods:', error);
      return [];
    }
  }

  async setDefaultPaymentMethod(userId: string, methodId: string): Promise<boolean> {
    try {
      const method = this.paymentMethods.get(methodId);
      if (!method || method.userId !== userId) return false;

      // Unset current default
      await this.unsetDefaultPaymentMethods(userId);

      // Set new default
      method.isDefault = true;
      this.paymentMethods.set(methodId, method);
      
      return true;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      return false;
    }
  }

  async removePaymentMethod(userId: string, methodId: string): Promise<boolean> {
    try {
      const method = this.paymentMethods.get(methodId);
      if (!method || method.userId !== userId) return false;

      // Don't allow removal of default method if it's the only one
      const userMethods = this.getUserPaymentMethods(userId);
      if (method.isDefault && userMethods.length === 1) {
        throw new Error('Cannot remove the only payment method');
      }

      method.isActive = false;
      this.paymentMethods.set(methodId, method);

      // If this was the default, set another as default
      if (method.isDefault) {
        const remainingMethods = userMethods.filter(m => m.id !== methodId && m.isActive);
        if (remainingMethods.length > 0) {
          const firstMethod = remainingMethods[0];
          if (firstMethod && firstMethod.id) {
            await this.setDefaultPaymentMethod(userId, firstMethod.id);
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error removing payment method:', error);
      return false;
    }
  }

  // ===== RECURRING BILLING =====

  async setupRecurringBilling(request: RecurringBillingRequest): Promise<RecurringBilling | null> {
    try {
      const billing: RecurringBilling = {
        id: `billing_${Date.now()}_${Math.random()}`,
        userId: request.userId,
        eventId: request.eventId,
        amount: request.amount,
        frequency: request.frequency,
        startDate: request.startDate,
        endDate: request.endDate,
        nextBillingDate: this.calculateNextBillingDate(request.startDate, request.frequency),
        status: 'active',
        paymentMethodId: request.paymentMethodId,
        description: request.description
      };

      this.recurringBillings.set(billing.id, billing);
      return billing;
    } catch (error) {
      console.error('Error setting up recurring billing:', error);
      return null;
    }
  }

  async getRecurringBillings(userId: string, status?: string): Promise<RecurringBilling[]> {
    try {
      let billings = Array.from(this.recurringBillings.values())
        .filter(billing => billing.userId === userId);

      if (status) {
        billings = billings.filter(billing => billing.status === status);
      }

      return billings.sort((a, b) => a.nextBillingDate.getTime() - b.nextBillingDate.getTime());
    } catch (error) {
      console.error('Error getting recurring billings:', error);
      return [];
    }
  }

  async pauseRecurringBilling(billingId: string): Promise<RecurringBilling | null> {
    try {
      const billing = this.recurringBillings.get(billingId);
      if (!billing) return null;

      billing.status = 'paused';
      this.recurringBillings.set(billingId, billing);
      
      return billing;
    } catch (error) {
      console.error('Error pausing recurring billing:', error);
      return null;
    }
  }

  async resumeRecurringBilling(billingId: string): Promise<RecurringBilling | null> {
    try {
      const billing = this.recurringBillings.get(billingId);
      if (!billing) return null;

      billing.status = 'active';
      billing.nextBillingDate = this.calculateNextBillingDate(new Date(), billing.frequency);
      this.recurringBillings.set(billingId, billing);
      
      return billing;
    } catch (error) {
      console.error('Error resuming recurring billing:', error);
      return null;
    }
  }

  async cancelRecurringBilling(billingId: string): Promise<RecurringBilling | null> {
    try {
      const billing = this.recurringBillings.get(billingId);
      if (!billing) return null;

      billing.status = 'cancelled';
      this.recurringBillings.set(billingId, billing);
      
      return billing;
    } catch (error) {
      console.error('Error cancelling recurring billing:', error);
      return null;
    }
  }

  // ===== HELPER METHODS =====

  private async fetchCalendarEventsFromProvider(integration: CalendarIntegration): Promise<CalendarEvent[]> {
    // Simulate fetching events from external calendar
    // In production, this would make actual API calls
    return [
      {
        id: `ext_event_${Date.now()}_1`,
        calendarId: integration.calendarId,
        eventId: `event_${Date.now()}_1`,
        title: 'Team Meeting',
        description: 'Weekly team sync meeting',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
        location: 'Conference Room A',
        attendees: ['user1@example.com', 'user2@example.com'],
        isAllDay: false,
        recurrence: 'weekly',
        externalId: `ext_${Date.now()}_1`,
        lastSync: new Date()
      }
    ];
  }

  private async createEventInExternalCalendar(integration: CalendarIntegration, event: CalendarEvent): Promise<void> {
    // Simulate creating event in external calendar
    console.log(`Creating event in ${integration.provider} calendar: ${event.title}`);
  }

  private async updateEventInExternalCalendar(integration: CalendarIntegration, event: CalendarEvent): Promise<void> {
    // Simulate updating event in external calendar
    console.log(`Updating event in ${integration.provider} calendar: ${event.title}`);
  }

  private async deleteEventFromExternalCalendar(integration: CalendarIntegration, event: CalendarEvent): Promise<void> {
    // Simulate deleting event from external calendar
    console.log(`Deleting event from ${integration.provider} calendar: ${event.title}`);
  }

  private getUserPaymentMethods(userId: string): PaymentMethod[] {
    return Array.from(this.paymentMethods.values())
      .filter(method => method.userId === userId && method.isActive);
  }

  private async unsetDefaultPaymentMethods(userId: string): Promise<void> {
    const userMethods = this.getUserPaymentMethods(userId);
    for (const method of userMethods) {
      if (method.isDefault) {
        method.isDefault = false;
        this.paymentMethods.set(method.id, method);
      }
    }
  }

  private extractLastFour(details: Record<string, any>): string | undefined {
    if (details.cardNumber) {
      return details.cardNumber.slice(-4);
    }
    if (details.accountNumber) {
      return details.accountNumber.slice(-4);
    }
    return undefined;
  }

  private extractExpiryDate(details: Record<string, any>): string | undefined {
    if (details.expiryMonth && details.expiryYear) {
      return `${details.expiryMonth}/${details.expiryYear}`;
    }
    return undefined;
  }

  private calculateNextBillingDate(startDate: Date, frequency: string): Date {
    const nextDate = new Date(startDate);
    
    switch (frequency) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
    
    return nextDate;
  }

  // ===== UTILITY METHODS =====

  async getIntegrationStatus(userId: string): Promise<{
    calendar: { active: number; total: number };
    crm: { active: number; total: number };
    social: { active: number; total: number };
    payments: { active: number; total: number };
  }> {
    try {
      const calendarIntegrations = await this.getCalendarIntegrationsByUser(userId);
      const paymentMethods = await this.getPaymentMethods(userId);

      return {
        calendar: {
          active: calendarIntegrations.filter(i => i.isActive).length,
          total: calendarIntegrations.length
        },
        payments: {
          active: paymentMethods.filter(m => m.isActive).length,
          total: paymentMethods.length
        },
        crm: {
          active: 0,
          total: 0
        },
        social: {
          active: 0,
          total: 0
        }
      };
    } catch (error) {
      console.error('Error getting integration status:', error);
      return {
        calendar: { active: 0, total: 0 },
        crm: { active: 0, total: 0 },
        social: { active: 0, total: 0 },
        payments: { active: 0, total: 0 }
      };
    }
  }

  async testIntegration(_integrationId: string, type: 'calendar' | 'crm' | 'social' | 'payment'): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      // Simulate integration test
      const isSuccess = Math.random() > 0.1; // 90% success rate
      
      if (isSuccess) {
        return {
          success: true,
          message: `${type} integration test successful`,
          details: { responseTime: Math.random() * 1000 + 100 }
        };
      } else {
        return {
          success: false,
          message: `${type} integration test failed`,
          details: { error: 'Connection timeout' }
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Integration test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// Export service instance
export const integrationConnectivityService = new IntegrationConnectivityService();
