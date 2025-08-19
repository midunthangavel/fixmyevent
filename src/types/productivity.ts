// Productivity Enhancement Types
// This file defines all the new types for productivity features

import type { BaseEntity } from './common';

// ===== AI AUTOMATION TYPES =====

export interface AIEventPlan {
  id: string;
  eventType: string;
  timeline: EventTimelineItem[];
  checklist: EventChecklistItem[];
  budgetRecommendations: BudgetRecommendation[];
  vendorSuggestions: VendorSuggestion[];
  riskAssessment: RiskAssessment;
  successProbability: number;
  estimatedROI: number;
}

export interface EventTimelineItem {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  dependencies: string[];
  assignee?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface EventChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'planning' | 'logistics' | 'marketing' | 'operations' | 'post_event';
  completed: boolean;
  dueDate?: Date;
  assignee?: string;
  estimatedCost?: number;
  actualCost?: number;
}

export interface BudgetRecommendation {
  category: string;
  currentBudget: number;
  recommendedBudget: number;
  savings: number;
  alternatives: BudgetAlternative[];
  reasoning: string;
}

export interface BudgetAlternative {
  name: string;
  cost: number;
  quality: 'low' | 'medium' | 'high';
  pros: string[];
  cons: string[];
  recommendation: boolean;
}

export interface VendorSuggestion {
  vendorId: string;
  name: string;
  category: string;
  rating: number;
  priceRange: { min: number; max: number };
  availability: boolean;
  matchScore: number;
  reasoning: string;
}

export interface RiskAssessment {
  risks: Risk[];
  mitigationStrategies: MitigationStrategy[];
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  mitigationStrategies: string[];
}

export interface MitigationStrategy {
  id: string;
  title: string;
  description: string;
  cost: number;
  effectiveness: number;
  implementationTime: string;
}

// ===== WORKFLOW & COLLABORATION TYPES =====

export interface TeamMember {
  id: string;
  userId: string;
  eventId: string;
  role: TeamRole;
  permissions: Permission[];
  assignedTasks: string[];
  joinDate: Date;
  isActive: boolean;
}

export type TeamRole = 'owner' | 'planner' | 'coordinator' | 'vendor' | 'viewer';

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  eventId: string;
  assigneeId?: string;
  assigneeName?: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  attachments: string[];
  comments: TaskComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  attachments?: string[];
}

export interface ApprovalWorkflow {
  id: string;
  eventId: string;
  type: 'vendor' | 'budget' | 'timeline' | 'custom';
  steps: ApprovalStep[];
  currentStep: number;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalStep {
  id: string;
  title: string;
  description: string;
  approverId: string;
  approverName: string;
  order: number;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  timestamp?: Date;
}

export interface EventTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  eventType: string;
  estimatedDuration: string;
  estimatedBudget: number;
  checklist: EventChecklistItem[];
  timeline: EventTimelineItem[];
  vendorCategories: string[];
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  usageCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// ===== INTEGRATION & CONNECTIVITY TYPES =====

export interface CalendarIntegration {
  id: string;
  userId: string;
  provider: 'google' | 'outlook' | 'apple' | 'ical';
  accessToken: string;
  refreshToken?: string;
  calendarId: string;
  isActive: boolean;
  lastSync: Date;
  syncFrequency: 'realtime' | 'hourly' | 'daily';
}

export interface CalendarEvent {
  id: string;
  calendarId: string;
  eventId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  attendees: string[];
  isAllDay: boolean;
  recurrence?: string;
  externalId: string;
  lastSync: Date;
}

export interface CRMContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  tags: string[];
  notes: string;
  lastContact: Date;
  source: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
}

export interface SocialMediaPost {
  id: string;
  eventId: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  content: string;
  mediaUrls: string[];
  scheduledDate: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    clicks: number;
  };
  publishedAt?: Date;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank_account' | 'paypal' | 'crypto' | 'local';
  provider: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface RecurringBilling {
  id: string;
  userId: string;
  eventId: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  nextBillingDate: Date;
  status: 'active' | 'paused' | 'cancelled' | 'completed';
  paymentMethodId: string;
  description: string;
}

// ===== USER EXPERIENCE TYPES =====

export interface UserPreference {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: NotificationPreference[];
  accessibility: AccessibilitySettings;
  mobileSettings: MobileSettings;
}

export interface NotificationPreference {
  type: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
  colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface MobileSettings {
  offlineMode: boolean;
  pushNotifications: boolean;
  locationServices: boolean;
  cameraAccess: boolean;
  storageOptimization: boolean;
}

export interface OfflineData {
  id: string;
  userId: string;
  dataType: string;
  data: any;
  lastSync: Date;
  syncStatus: 'pending' | 'synced' | 'conflict' | 'error';
  conflictResolution?: 'local' | 'remote' | 'manual';
}

// ===== ANALYTICS & REPORTING TYPES =====

export interface EventMetrics {
  id: string;
  eventId: string;
  attendance: {
    expected: number;
    actual: number;
    percentage: number;
  };
  engagement: {
    websiteVisits: number;
    socialMediaReach: number;
    emailOpenRate: number;
    clickThroughRate: number;
  };
  financial: {
    budget: number;
    actual: number;
    variance: number;
    roi: number;
  };
  satisfaction: {
    averageRating: number;
    totalReviews: number;
    recommendationScore: number;
  };
  performance: {
    onTimeStart: boolean;
    onTimeEnd: boolean;
    issues: number;
    resolutionTime: number;
  };
  calculatedAt: Date;
}

export interface CustomerInsight {
  id: string;
  userId: string;
  eventId: string;
  preferences: {
    eventTypes: string[];
    venues: string[];
    vendors: string[];
    budgetRange: { min: number; max: number };
    preferredDates: string[];
    specialRequirements: string[];
  };
  behavior: {
    planningTime: number;
    decisionSpeed: number;
    communicationStyle: string;
    riskTolerance: string;
  };
  demographics: {
    age: string;
    location: string;
    income: string;
    interests: string[];
  };
  lastUpdated: Date;
}

export interface FinancialReport {
  id: string;
  eventId: string;
  period: 'event' | 'monthly' | 'quarterly' | 'yearly';
  revenue: {
    total: number;
    breakdown: Record<string, number>;
    growth: number;
  };
  expenses: {
    total: number;
    breakdown: Record<string, number>;
    variance: number;
  };
  profit: {
    gross: number;
    net: number;
    margin: number;
  };
  cashFlow: {
    opening: number;
    closing: number;
    netChange: number;
  };
  generatedAt: Date;
}

export interface CustomDashboard {
  id: string;
  userId: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'list' | 'progress';
  title: string;
  dataSource: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  widgets: DashboardWidget[];
}

// ===== BULK OPERATIONS TYPES =====

export interface BulkOperation {
  id: string;
  userId: string;
  type: 'import' | 'export' | 'update' | 'delete' | 'email';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalItems: number;
  processedItems: number;
  successCount: number;
  errorCount: number;
  errors: BulkOperationError[];
  startedAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
}

export interface BulkOperationError {
  row: number;
  field: string;
  value: string;
  error: string;
}

export interface BulkEmailOperation {
  id: string;
  bulkOperationId: string;
  template: string;
  subject: string;
  recipients: string[];
  variables: Record<string, any>;
  scheduledDate?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  sentCount: number;
  failedCount: number;
  openedCount: number;
  clickedCount: number;
}

// ===== SEARCH & FILTERING TYPES =====

export interface AdvancedSearch {
  id: string;
  userId: string;
  name: string;
  query: string;
  filters: AdvancedSearchFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  saved: boolean;
  createdAt: Date;
  lastUsed: Date;
}

export interface AdvancedSearchFilters {
  eventTypes: string[];
  dateRange: { start: Date; end: Date };
  location: {
    city?: string;
    state?: string;
    country?: string;
    radius?: number;
  };
  budget: { min: number; max: number };
  vendors: string[];
  ratings: { min: number; max: number };
  availability: boolean;
  tags: string[];
  customFields: Record<string, any>;
}

// ===== NOTIFICATION TYPES =====

export interface SmartNotification {
  id: string;
  userId: string;
  type: 'reminder' | 'alert' | 'update' | 'recommendation';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  context: Record<string, any>;
  actionRequired: boolean;
  actionUrl?: string;
  scheduledDate?: Date;
  sentAt?: Date;
  readAt?: Date;
  dismissedAt?: Date;
}

export interface NotificationRule {
  id: string;
  userId: string;
  name: string;
  description: string;
  trigger: NotificationTrigger;
  conditions: NotificationCondition[];
  actions: NotificationAction[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTrigger {
  type: 'event' | 'time' | 'condition' | 'manual';
  event?: string;
  time?: string;
  condition?: string;
}

export interface NotificationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface NotificationAction {
  type: 'email' | 'push' | 'sms' | 'webhook';
  config: Record<string, any>;
}
