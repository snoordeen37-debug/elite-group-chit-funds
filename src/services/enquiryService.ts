import {
  EnquiryFormData,
  EnquiryRecord,
  EnquiryStatus,
  EnquiryStats,
  WhatsAppSettings,
  WhatsAppNotificationLog,
} from '../types';

const LOCAL_STORAGE_KEY = 'eg_chit_enquiries_local';

export interface DirectWhatsAppUrls {
  line1: string;
  line2: string;
  messageText: string;
}

export function formatWhatsAppEnquiryText(data: {
  fullName: string;
  mobileNumber: string;
  interestedPlan: string;
  preferredChitValue: string;
  message?: string;
  dateStr?: string;
}): string {
  const dateFormatted = data.dateStr || new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    `🔔 NEW CHIT FUND ENQUIRY\n\n` +
    `Customer Name: ${data.fullName.trim()}\n` +
    `Mobile Number: ${data.mobileNumber.trim()}\n` +
    `Interested Plan: ${data.interestedPlan.trim()}\n` +
    `Chit Value: ${data.preferredChitValue.trim()}\n` +
    `Message: ${(data.message && data.message.trim()) ? data.message.trim() : 'Enquiry submitted via website'}\n` +
    `Date & Time: ${dateFormatted}`
  );
}

export function getDirectWhatsAppUrls(data: {
  fullName: string;
  mobileNumber: string;
  interestedPlan: string;
  preferredChitValue: string;
  message?: string;
  dateStr?: string;
}): DirectWhatsAppUrls {
  const text = formatWhatsAppEnquiryText(data);
  const encoded = encodeURIComponent(text);
  return {
    line1: `https://api.whatsapp.com/send?phone=917338736352&text=${encoded}`,
    line2: `https://api.whatsapp.com/send?phone=919345836032&text=${encoded}`,
    messageText: text,
  };
}

/**
 * Submits an enquiry to the backend API which dispatches dual WhatsApp notifications
 * and saves to the database. Also prepares direct WhatsApp URLs as fail-safe.
 */
export async function submitEnquiry(data: EnquiryFormData): Promise<{
  success: boolean;
  message: string;
  enquiry?: EnquiryRecord;
  whatsappDispatch?: {
    number1: { number: string; name?: string; status: string; error?: string };
    number2: { number: string; name?: string; status: string; error?: string };
    provider?: string;
    autoOpenClient?: boolean;
  };
  directWhatsAppUrls?: DirectWhatsAppUrls;
  error?: string;
}> {
  const fallbackUrls = getDirectWhatsAppUrls(data);

  try {
    const response = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok && result.success) {
      saveToLocalCache(result.enquiry);
      return {
        ...result,
        directWhatsAppUrls: result.directWhatsAppUrls || fallbackUrls,
      };
    } else {
      throw new Error(result.error || 'Failed to submit enquiry.');
    }
  } catch (err: any) {
    console.warn('API error, falling back to client-side storage & direct links:', err);

    // Fallback: create offline record
    const now = new Date();
    const fallbackRecord: EnquiryRecord = {
      id: `enq-local-${Date.now()}`,
      fullName: data.fullName,
      mobileNumber: data.mobileNumber,
      emailAddress: data.emailAddress,
      interestedPlan: data.interestedPlan || data.preferredChitValue,
      preferredChitValue: data.preferredChitValue || data.interestedPlan,
      preferredContactMethod: data.preferredContactMethod || 'Phone',
      message: data.message || '',
      status: 'New',
      adminNotes: 'Submitted in offline/direct mode',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      whatsappNotifications: [
        {
          recipient: '+91 7338736352',
          recipientName: 'Primary Business Line',
          status: 'direct_link',
          timestamp: now.toISOString(),
          messagePreview: fallbackUrls.messageText,
        },
        {
          recipient: '+91 9345836032',
          recipientName: 'Secondary Business Line',
          status: 'direct_link',
          timestamp: now.toISOString(),
          messagePreview: fallbackUrls.messageText,
        },
      ],
      source: 'Website Form (Direct)',
    };

    saveToLocalCache(fallbackRecord);

    return {
      success: true,
      message: 'Thank you for your enquiry! Our team will contact you shortly.',
      enquiry: fallbackRecord,
      whatsappDispatch: {
        number1: { number: '+91 7338736352', name: 'Primary Business Line', status: 'direct_link' },
        number2: { number: '+91 9345836032', name: 'Secondary Business Line', status: 'direct_link' },
        provider: 'none',
      },
      directWhatsAppUrls: fallbackUrls,
    };
  }
}

/**
 * Fetches WhatsApp Gateway Settings from backend
 */
export async function getWhatsAppSettings(): Promise<WhatsAppSettings> {
  try {
    const res = await fetch('/api/settings/whatsapp');
    if (res.ok) {
      const data = await res.json();
      if (data.settings) return data.settings;
    }
  } catch (e) {
    console.warn('Error fetching settings:', e);
  }
  return {
    provider: 'none',
    callmebotApiKey1: '',
    callmebotApiKey2: '',
    ultramsgInstanceId: '',
    ultramsgToken: '',
    metaToken: '',
    metaPhoneId: '',
    webhookUrl: '',
    autoOpenClient: true,
  };
}

/**
 * Updates WhatsApp Gateway Settings in backend
 */
export async function saveWhatsAppSettings(settings: Partial<WhatsAppSettings>): Promise<{
  success: boolean;
  message?: string;
  settings?: WhatsAppSettings;
  error?: string;
}> {
  try {
    const res = await fetch('/api/settings/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return await res.json();
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * Dispatches a live test notification to both business numbers
 */
export async function testWhatsAppNotification(params?: {
  settings?: WhatsAppSettings;
  customMessage?: string;
}): Promise<{
  success: boolean;
  message: string;
  logs?: WhatsAppNotificationLog[];
  provider?: string;
  directUrls?: { line1: string; line2: string };
  error?: string;
}> {
  try {
    const res = await fetch('/api/whatsapp/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {}),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      message: 'Failed to test WhatsApp dispatch',
      error: err.message,
    };
  }
}

/**
 * Fetches enquiries for Admin Dashboard
 */
export async function getEnquiries(params?: {
  status?: string;
  search?: string;
}): Promise<{ success: boolean; enquiries: EnquiryRecord[]; count: number }> {
  try {
    const url = new URL('/api/enquiries', window.location.origin);
    if (params?.status && params.status !== 'All') url.searchParams.set('status', params.status);
    if (params?.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString());
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch from API, loading from local cache:', err);
  }

  // Fallback to local storage
  const localList = getLocalCache();
  let filtered = [...localList];
  if (params?.status && params.status !== 'All') {
    filtered = filtered.filter(e => e.status === params.status);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      e =>
        e.fullName.toLowerCase().includes(q) ||
        e.mobileNumber.toLowerCase().includes(q) ||
        e.interestedPlan.toLowerCase().includes(q)
    );
  }

  return { success: true, count: filtered.length, enquiries: filtered };
}

/**
 * Updates status or admin notes for an enquiry
 */
export async function updateEnquiry(
  id: string,
  updates: { status?: EnquiryStatus; adminNotes?: string }
): Promise<{ success: boolean; enquiry?: EnquiryRecord }> {
  try {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      updateLocalCache(id, updates);
      return data;
    }
  } catch (err) {
    console.warn('API patch failed, updating local cache:', err);
  }

  updateLocalCache(id, updates);
  return { success: true };
}

/**
 * Deletes an enquiry
 */
export async function deleteEnquiry(id: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    if (res.ok) {
      deleteFromLocalCache(id);
      return { success: true };
    }
  } catch (err) {
    console.warn('API delete failed, updating local cache:', err);
  }

  deleteFromLocalCache(id);
  return { success: true };
}

/**
 * Fetches dashboard stats
 */
export async function getEnquiryStats(): Promise<EnquiryStats> {
  try {
    const res = await fetch('/api/stats');
    if (res.ok) {
      const data = await res.json();
      if (data.stats) return data.stats;
    }
  } catch (err) {
    console.warn('API stats failed, calculating from cache');
  }

  const list = getLocalCache();
  const today = new Date().toISOString().split('T')[0];
  return {
    total: list.length,
    newCount: list.filter(e => e.status === 'New').length,
    contactedCount: list.filter(e => e.status === 'Contacted').length,
    followUpCount: list.filter(e => e.status === 'Follow-up').length,
    convertedCount: list.filter(e => e.status === 'Converted').length,
    closedCount: list.filter(e => e.status === 'Closed').length,
    todayCount: list.filter(e => e.createdAt.startsWith(today)).length,
  };
}

// Local Cache Helpers
function getLocalCache(): EnquiryRecord[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveToLocalCache(record: EnquiryRecord): void {
  try {
    const list = getLocalCache();
    const existingIdx = list.findIndex(e => e.id === record.id);
    if (existingIdx >= 0) {
      list[existingIdx] = record;
    } else {
      list.unshift(record);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

function updateLocalCache(id: string, updates: Partial<EnquiryRecord>): void {
  try {
    const list = getLocalCache();
    const idx = list.findIndex(e => e.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.error(e);
  }
}

function deleteFromLocalCache(id: string): void {
  try {
    const list = getLocalCache().filter(e => e.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}
