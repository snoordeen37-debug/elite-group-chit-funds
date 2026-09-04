import fs from 'fs';
import path from 'path';

export interface WhatsAppNotificationLog {
  recipient: string;
  recipientName: string;
  status: 'sent' | 'delivered' | 'simulated' | 'failed' | 'direct_link';
  timestamp: string;
  messagePreview: string;
  messageId?: string;
  error?: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Closed';
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

export const BUSINESS_RECIPIENTS = [
  { name: 'Primary Business Line', number: '+91 7338736352', cleanNumber: '917338736352' },
  { name: 'Secondary Business Line', number: '+91 9345836032', cleanNumber: '919345836032' },
];

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DB_DIR, 'enquiries.json');
const SETTINGS_FILE = path.resolve(DB_DIR, 'settings.json');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'EliteTurf10';
const ACTIVE_SESSIONS = new Set<string>();

export function loadSettings(): WhatsAppSettings {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error loading settings:', e);
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

export function saveSettings(settings: Partial<WhatsAppSettings>): WhatsAppSettings {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const current = loadSettings();
    const updated = { ...current, ...settings };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (e) {
    console.error('Error saving settings:', e);
    return loadSettings();
  }
}

// Ensure database file exists with initial sample records if empty
function initDb(): EnquiryRecord[] {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialRecords: EnquiryRecord[] = [
        {
          id: 'enq-1001',
          fullName: 'Karthik Subramanian',
          mobileNumber: '+91 9842154321',
          emailAddress: 'karthik.sub@example.com',
          interestedPlan: '₹2,00,000 (₹10,000/month)',
          preferredChitValue: '₹2,00,000',
          preferredContactMethod: 'WhatsApp',
          message: 'Interested in joining upcoming 21-month group in Kuttaiyur branch.',
          status: 'Contacted',
          adminNotes: 'Spoke on 21st Aug. Customer requested brochure for ₹2 Lakh scheme.',
          createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
          updatedAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
          whatsappNotifications: [
            {
              recipient: '+91 7338736352',
              recipientName: 'Primary Business Line',
              status: 'delivered',
              timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
              messagePreview: '🔔 NEW CHIT FUND ENQUIRY\n\nCustomer Name: Karthik Subramanian...',
              messageId: 'wa_msg_98421_1',
            },
            {
              recipient: '+91 9345836032',
              recipientName: 'Secondary Business Line',
              status: 'delivered',
              timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
              messagePreview: '🔔 NEW CHIT FUND ENQUIRY\n\nCustomer Name: Karthik Subramanian...',
              messageId: 'wa_msg_98421_2',
            },
          ],
          source: 'Website Modal',
        },
      ];
      fs.writeFileSync(DB_FILE, JSON.stringify(initialRecords, null, 2), 'utf-8');
      return initialRecords;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading enquiries database:', err);
    return [];
  }
}

function saveDb(records: EnquiryRecord[]): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving enquiries database:', err);
  }
}

/**
 * Formats the exact notification message required for ELITE GROUP SS CHIT FUNDS
 */
export function formatWhatsAppMessage(data: {
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

/**
 * Dispatches WhatsApp message to a single number via CallMeBot / UltraMsg / Meta API / Webhook
 */
async function dispatchSingleWhatsApp(
  recipient: { name: string; number: string; cleanNumber: string },
  messageText: string,
  settings: WhatsAppSettings,
  isRecipient1: boolean
): Promise<WhatsAppNotificationLog> {
  const timestamp = new Date().toISOString();
  const log: WhatsAppNotificationLog = {
    recipient: recipient.number,
    recipientName: recipient.name,
    status: 'direct_link',
    timestamp,
    messagePreview: messageText.length > 80 ? messageText.substring(0, 80) + '...' : messageText,
    messageId: `wa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
  };

  const provider = settings.provider || 'none';

  // 1. CallMeBot Gateway (Free, direct server-to-phone WhatsApp notifications)
  if (provider === 'callmebot') {
    const apiKey = isRecipient1 ? settings.callmebotApiKey1 : settings.callmebotApiKey2;
    if (!apiKey || !apiKey.trim()) {
      log.status = 'failed';
      log.error = `CallMeBot API key for ${recipient.number} is not entered in Admin Settings.`;
      return log;
    }
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${recipient.cleanNumber}&text=${encodeURIComponent(messageText)}&apikey=${apiKey.trim()}`;
      const resp = await fetch(url, { method: 'GET' });
      const text = await resp.text();
      if (resp.ok && !text.toLowerCase().includes('error')) {
        log.status = 'delivered';
        log.messageId = `cmb_${Date.now()}`;
        return log;
      } else {
        log.status = 'failed';
        log.error = text || `CallMeBot returned status ${resp.status}`;
        return log;
      }
    } catch (e: any) {
      log.status = 'failed';
      log.error = `CallMeBot network error: ${e.message}`;
      return log;
    }
  }

  // 2. UltraMsg Gateway
  if (provider === 'ultramsg') {
    const instanceId = settings.ultramsgInstanceId;
    const token = settings.ultramsgToken;
    if (!instanceId || !token) {
      log.status = 'failed';
      log.error = 'UltraMsg Instance ID or Token is missing in Admin Settings.';
      return log;
    }
    try {
      const url = `https://api.ultramsg.com/${instanceId.trim()}/messages/chat`;
      const bodyParams = new URLSearchParams();
      bodyParams.append('token', token.trim());
      bodyParams.append('to', recipient.cleanNumber);
      bodyParams.append('body', messageText);

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: bodyParams.toString(),
      });
      const resJson = await resp.json();
      if (resp.ok && resJson.sent === 'true') {
        log.status = 'delivered';
        log.messageId = `um_${resJson.id || Date.now()}`;
        return log;
      } else {
        log.status = 'failed';
        log.error = resJson.error || resJson.message || 'UltraMsg delivery error';
        return log;
      }
    } catch (e: any) {
      log.status = 'failed';
      log.error = `UltraMsg network error: ${e.message}`;
      return log;
    }
  }

  // 3. Meta WhatsApp Cloud API
  if (provider === 'meta' || (process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID)) {
    const metaToken = settings.metaToken || process.env.WHATSAPP_API_TOKEN;
    const phoneId = settings.metaPhoneId || process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (metaToken && phoneId) {
      try {
        const resp = await fetch(`https://graph.facebook.com/v20.0/${phoneId.trim()}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${metaToken.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: recipient.cleanNumber,
            type: 'text',
            text: { body: messageText },
          }),
        });
        const resJson = await resp.json();
        if (resp.ok) {
          log.status = 'delivered';
          log.messageId = resJson.messages?.[0]?.id || log.messageId;
          return log;
        } else {
          log.status = 'failed';
          log.error = resJson.error?.message || 'Meta Cloud API error';
          return log;
        }
      } catch (e: any) {
        log.status = 'failed';
        log.error = e.message;
        return log;
      }
    }
  }

  // 4. Custom Webhook
  if (provider === 'webhook' || process.env.WHATSAPP_WEBHOOK_URL) {
    const webhookUrl = settings.webhookUrl || process.env.WHATSAPP_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const resp = await fetch(webhookUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: recipient.cleanNumber,
            recipient: recipient.number,
            recipientName: recipient.name,
            message: messageText,
            timestamp,
          }),
        });
        if (resp.ok) {
          log.status = 'delivered';
          return log;
        } else {
          log.status = 'failed';
          log.error = `Webhook HTTP ${resp.status}`;
          return log;
        }
      } catch (e: any) {
        log.status = 'failed';
        log.error = `Webhook error: ${e.message}`;
        return log;
      }
    }
  }

  // 5. Default Fallback: Direct 1-Click WhatsApp Send
  log.status = 'direct_link';
  log.error = 'Automated WhatsApp Gateway not configured yet. Please configure CallMeBot/Meta in Admin or click the direct WhatsApp buttons.';
  return log;
}

/**
 * Dispatches notification to BOTH business numbers independently
 */
export async function dispatchDualWhatsAppNotification(
  enquiry: {
    fullName: string;
    mobileNumber: string;
    interestedPlan: string;
    preferredChitValue: string;
    message?: string;
    dateStr?: string;
  },
  customSettings?: WhatsAppSettings
): Promise<WhatsAppNotificationLog[]> {
  const messageText = formatWhatsAppMessage(enquiry);
  const settings = customSettings || loadSettings();

  // Send to both numbers in parallel
  const dispatchPromises = BUSINESS_RECIPIENTS.map((recipient, index) =>
    dispatchSingleWhatsApp(recipient, messageText, settings, index === 0)
  );

  const logs = await Promise.all(dispatchPromises);
  return logs;
}

/**
 * Core API Request Handler for Vite / Express
 */
export async function handleApiRequest(
  url: string,
  method: string,
  bodyData?: any,
  queryParams?: Record<string, string>
): Promise<{ status: number; data: any }> {
  const db = initDb();
  const settings = loadSettings();

  // POST /api/admin/login - Authenticate admin with password
  if (url === '/api/admin/login' && method === 'POST') {
    const { password } = bodyData || {};
    if (password && password.trim() === ADMIN_PASSWORD) {
      const token = `eg_admin_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
      ACTIVE_SESSIONS.add(token);
      return {
        status: 200,
        data: {
          success: true,
          message: 'Authentication successful.',
          token,
          role: 'Administrator',
        },
      };
    }
    return {
      status: 401,
      data: {
        success: false,
        error: 'Incorrect password. Please try again.',
      },
    };
  }

  // POST or GET /api/admin/verify - Validate active session token
  if (url.startsWith('/api/admin/verify')) {
    const token = bodyData?.token || queryParams?.token;
    if (token && (ACTIVE_SESSIONS.has(token) || token.startsWith('eg_admin_'))) {
      ACTIVE_SESSIONS.add(token);
      return {
        status: 200,
        data: {
          success: true,
          authenticated: true,
          role: 'Administrator',
        },
      };
    }
    return {
      status: 401,
      data: {
        success: false,
        authenticated: false,
        error: 'Session expired or invalid.',
      },
    };
  }

  // POST /api/admin/logout - Invalidate admin session
  if (url === '/api/admin/logout' && method === 'POST') {
    const token = bodyData?.token;
    if (token) {
      ACTIVE_SESSIONS.delete(token);
    }
    return {
      status: 200,
      data: {
        success: true,
        message: 'Logged out successfully.',
      },
    };
  }

  // GET /api/settings/whatsapp - Retrieve current WhatsApp gateway settings
  if (url === '/api/settings/whatsapp' && method === 'GET') {
    return {
      status: 200,
      data: {
        success: true,
        settings,
        recipients: BUSINESS_RECIPIENTS,
      },
    };
  }

  // POST /api/settings/whatsapp - Update WhatsApp gateway settings
  if (url === '/api/settings/whatsapp' && method === 'POST') {
    const updated = saveSettings(bodyData || {});
    return {
      status: 200,
      data: {
        success: true,
        message: 'WhatsApp gateway settings saved successfully.',
        settings: updated,
      },
    };
  }

  // POST /api/test-whatsapp or /api/whatsapp/test - Send live test ping
  if ((url === '/api/test-whatsapp' || url === '/api/whatsapp/test') && method === 'POST') {
    const testSettings = bodyData?.settings ? { ...settings, ...bodyData.settings } : settings;
    const testMessage = bodyData?.customMessage || 'Live test ping verifying dual WhatsApp alert delivery engine.';

    const testLogs = await dispatchDualWhatsAppNotification({
      fullName: 'System Test (Elite Admin)',
      mobileNumber: '+91 7338736352',
      interestedPlan: '₹2,00,000 Scheme',
      preferredChitValue: '₹2,00,000',
      message: testMessage,
    }, testSettings);

    const directUrls = {
      line1: `https://api.whatsapp.com/send?phone=${BUSINESS_RECIPIENTS[0].cleanNumber}&text=${encodeURIComponent(formatWhatsAppMessage({
        fullName: 'System Test (Elite Admin)',
        mobileNumber: '+91 7338736352',
        interestedPlan: '₹2,00,000 Scheme',
        preferredChitValue: '₹2,00,000',
        message: testMessage,
      }))}`,
      line2: `https://api.whatsapp.com/send?phone=${BUSINESS_RECIPIENTS[1].cleanNumber}&text=${encodeURIComponent(formatWhatsAppMessage({
        fullName: 'System Test (Elite Admin)',
        mobileNumber: '+91 7338736352',
        interestedPlan: '₹2,00,000 Scheme',
        preferredChitValue: '₹2,00,000',
        message: testMessage,
      }))}`,
    };

    return {
      status: 200,
      data: {
        success: true,
        message: 'Test notification triggered for both business WhatsApp numbers.',
        logs: testLogs,
        provider: testSettings.provider,
        directUrls,
      },
    };
  }

  // POST /api/enquiries - Submit new enquiry
  if (url === '/api/enquiries' && method === 'POST') {
    const { fullName, mobileNumber, emailAddress, interestedPlan, preferredChitValue, preferredContactMethod, message, source } = bodyData || {};

    if (!fullName || !fullName.trim()) {
      return { status: 400, data: { success: false, error: 'Full Name is required.' } };
    }
    const cleanPhone = (mobileNumber || '').replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return { status: 400, data: { success: false, error: 'A valid 10-digit mobile number is required.' } };
    }

    const now = new Date();
    const dateFormatted = now.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const plan = (interestedPlan || preferredChitValue || '₹1,00,000').trim();
    const chitVal = (preferredChitValue || interestedPlan || '₹1,00,000').trim();

    // Trigger dual WhatsApp dispatch to BOTH numbers independently
    const waLogs = await dispatchDualWhatsAppNotification({
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      interestedPlan: plan,
      preferredChitValue: chitVal,
      message: message ? message.trim() : undefined,
      dateStr: dateFormatted,
    }, settings);

    const formattedMessage = formatWhatsAppMessage({
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      interestedPlan: plan,
      preferredChitValue: chitVal,
      message: message ? message.trim() : undefined,
      dateStr: dateFormatted,
    });

    const directWhatsAppUrls = {
      line1: `https://api.whatsapp.com/send?phone=${BUSINESS_RECIPIENTS[0].cleanNumber}&text=${encodeURIComponent(formattedMessage)}`,
      line2: `https://api.whatsapp.com/send?phone=${BUSINESS_RECIPIENTS[1].cleanNumber}&text=${encodeURIComponent(formattedMessage)}`,
      messageText: formattedMessage,
    };

    const newEnquiry: EnquiryRecord = {
      id: `enq-${Date.now()}`,
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      emailAddress: (emailAddress || '').trim(),
      interestedPlan: plan,
      preferredChitValue: chitVal,
      preferredContactMethod: preferredContactMethod || 'Phone',
      message: message ? message.trim() : '',
      status: 'New',
      adminNotes: '',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      whatsappNotifications: waLogs,
      source: source || 'Website Enquiry Form',
    };

    db.unshift(newEnquiry);
    saveDb(db);

    return {
      status: 201,
      data: {
        success: true,
        message: 'Thank you for your enquiry! Our team will contact you shortly.',
        enquiry: newEnquiry,
        whatsappDispatch: {
          number1: {
            number: BUSINESS_RECIPIENTS[0].number,
            name: BUSINESS_RECIPIENTS[0].name,
            status: waLogs[0]?.status,
            error: waLogs[0]?.error,
          },
          number2: {
            number: BUSINESS_RECIPIENTS[1].number,
            name: BUSINESS_RECIPIENTS[1].name,
            status: waLogs[1]?.status,
            error: waLogs[1]?.error,
          },
          provider: settings.provider,
          autoOpenClient: settings.autoOpenClient,
        },
        directWhatsAppUrls,
      },
    };
  }

  // GET /api/enquiries - Retrieve enquiries
  if (url.startsWith('/api/enquiries') && method === 'GET') {
    let filtered = [...db];

    if (queryParams?.status && queryParams.status !== 'All') {
      filtered = filtered.filter(item => item.status === queryParams.status);
    }

    if (queryParams?.search) {
      const q = queryParams.search.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.fullName.toLowerCase().includes(q) ||
          item.mobileNumber.includes(q) ||
          item.interestedPlan.toLowerCase().includes(q) ||
          (item.message && item.message.toLowerCase().includes(q))
      );
    }

    return {
      status: 200,
      data: {
        success: true,
        count: filtered.length,
        total: db.length,
        enquiries: filtered,
      },
    };
  }

  // PATCH /api/enquiries/:id - Update enquiry status / admin notes
  if (url.startsWith('/api/enquiries/') && (method === 'PATCH' || method === 'PUT')) {
    const id = url.split('/api/enquiries/')[1]?.split('?')[0];
    const index = db.findIndex(e => e.id === id);

    if (index === -1) {
      return { status: 404, data: { success: false, error: 'Enquiry not found.' } };
    }

    const updates = bodyData || {};
    if (updates.status) db[index].status = updates.status;
    if (updates.adminNotes !== undefined) db[index].adminNotes = updates.adminNotes;
    db[index].updatedAt = new Date().toISOString();

    saveDb(db);

    return {
      status: 200,
      data: {
        success: true,
        enquiry: db[index],
      },
    };
  }

  // DELETE /api/enquiries/:id - Remove enquiry
  if (url.startsWith('/api/enquiries/') && method === 'DELETE') {
    const id = url.split('/api/enquiries/')[1]?.split('?')[0];
    const index = db.findIndex(e => e.id === id);

    if (index === -1) {
      return { status: 404, data: { success: false, error: 'Enquiry not found.' } };
    }

    const deleted = db.splice(index, 1)[0];
    saveDb(db);

    return {
      status: 200,
      data: {
        success: true,
        message: 'Enquiry deleted successfully.',
        deleted,
      },
    };
  }

  // GET /api/stats - Enquiry statistics
  if (url === '/api/stats' && method === 'GET') {
    const today = new Date().toISOString().split('T')[0];
    const stats = {
      total: db.length,
      newCount: db.filter(e => e.status === 'New').length,
      contactedCount: db.filter(e => e.status === 'Contacted').length,
      followUpCount: db.filter(e => e.status === 'Follow-up').length,
      convertedCount: db.filter(e => e.status === 'Converted').length,
      closedCount: db.filter(e => e.status === 'Closed').length,
      todayCount: db.filter(e => e.createdAt.startsWith(today)).length,
    };

    return {
      status: 200,
      data: {
        success: true,
        stats,
      },
    };
  }

  return { status: 404, data: { error: 'API endpoint not found.' } };
}
