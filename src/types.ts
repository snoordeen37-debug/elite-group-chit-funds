export interface ChitCatalogRow {
  sNo: number;
  plan50k: string;
  plan100k: string;
  plan200k: string;
  plan300k: string;
  plan400k: string;
  plan500k: string;
}

export interface ChitContributionOption {
  sNo: number;
  chitValue: string;
  monthly: string;
  weekly: string;
  daily: string;
  numericValue: number;
}

export interface ShortTerm10MonthPlan {
  sNo: number;
  id: string;
  totalPlan: string;
  numericValue: number;
  monthly: string;
  weekly: string;
  daily: string;
  cycleDays: string;
  duration: string;
  tagline: string;
  features: string[];
}

export interface ShortTerm10MonthTierRow {
  sNo: number;
  plan10k: string;
  plan20k: string;
  plan30k: string;
  plan50k: string;
  plan100k: string;
  plan200k: string;
}

export interface ChitPlanSummary {
  id: string;
  value: string;
  numericValue: number;
  monthlyContribution: string;
  weeklyContribution: string;
  dailyContribution: string;
  duration: string;
  minTakeHome: string;
  maxTakeHome: string;
  tagline: string;
  features: string[];
}

export interface EnquiryFormData {
  fullName: string;
  mobileNumber: string;
  emailAddress?: string;
  interestedPlan: string;
  preferredChitValue: string;
  preferredContactMethod?: 'Phone' | 'WhatsApp';
  message?: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Closed';

export interface WhatsAppNotificationLog {
  recipient: string;
  recipientName: string;
  status: 'sent' | 'delivered' | 'simulated' | 'failed' | 'direct_link';
  timestamp: string;
  messagePreview: string;
  messageId?: string;
  error?: string;
}

export type WhatsAppProvider = 'none' | 'callmebot' | 'ultramsg' | 'meta' | 'webhook';

export interface WhatsAppSettings {
  provider: WhatsAppProvider;
  callmebotApiKey1?: string;
  callmebotApiKey2?: string;
  ultramsgInstanceId?: string;
  ultramsgToken?: string;
  metaToken?: string;
  metaPhoneId?: string;
  webhookUrl?: string;
  autoOpenClient?: boolean;
}

export interface EnquiryRecord {
  id: string;
  fullName: string;
  mobileNumber: string;
  emailAddress?: string;
  interestedPlan: string;
  preferredChitValue: string;
  preferredContactMethod?: 'Phone' | 'WhatsApp';
  message?: string;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  whatsappNotifications: WhatsAppNotificationLog[];
  source?: string;
}

export interface EnquiryStats {
  total: number;
  newCount: number;
  contactedCount: number;
  followUpCount: number;
  convertedCount: number;
  closedCount: number;
  todayCount: number;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface WhyChooseItem {
  title: string;
  description: string;
  iconName: string;
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  description: string;
  detail: string;
}
