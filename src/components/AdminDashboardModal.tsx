import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Search,
  Download,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  FileSpreadsheet,
  Send,
  Lock,
  Unlock,
  KeyRound,
  Filter,
  UserCheck,
  TrendingUp,
  Building2,
  Calendar,
  ExternalLink,
  ChevronDown,
  Settings,
  Sparkles,
  Check,
  HelpCircle,
  Radio
} from 'lucide-react';
import { EnquiryRecord, EnquiryStatus, EnquiryStats, WhatsAppSettings, WhatsAppProvider } from '../types';
import {
  getEnquiries,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryStats,
  testWhatsAppNotification,
  getWhatsAppSettings,
  saveWhatsAppSettings,
  formatWhatsAppEnquiryText,
} from '../services/enquiryService';
import { BrandLogo } from './BrandLogo';
import { exportEnquiriesToExcel } from '../utils/enquiryExport';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_CONFIG: Record<
  EnquiryStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  New: {
    label: 'New Lead',
    bg: 'bg-emerald-950/80',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
  },
  Contacted: {
    label: 'Contacted',
    bg: 'bg-sky-950/80',
    text: 'text-sky-400',
    border: 'border-sky-500/40',
  },
  'Follow-up': {
    label: 'Follow-up',
    bg: 'bg-amber-950/80',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
  },
  Converted: {
    label: 'Converted',
    bg: 'bg-purple-950/80',
    text: 'text-purple-300',
    border: 'border-purple-500/40',
  },
  Closed: {
    label: 'Closed',
    bg: 'bg-slate-900',
    text: 'text-slate-400',
    border: 'border-slate-700',
  },
};

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [stats, setStats] = useState<EnquiryStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [testingWhatsApp, setTestingWhatsApp] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // WhatsApp Gateway Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<WhatsAppSettings>({
    provider: 'none',
    callmebotApiKey1: '',
    callmebotApiKey2: '',
    ultramsgInstanceId: '',
    ultramsgToken: '',
    metaToken: '',
    metaPhoneId: '',
    webhookUrl: '',
    autoOpenClient: true,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated, selectedStatus, searchQuery]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Support master PINs and owner phone numbers
    if (
      pinInput === '1995' ||
      pinInput === '1234' ||
      pinInput === '7338' ||
      pinInput === '7338736352' ||
      pinInput === '9345836032'
    ) {
      setIsAuthenticated(true);
      setPinError('');
      loadData();
    } else {
      setPinError('Incorrect PIN. (Use 1995 or 1234 for demo access)');
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [res, statsRes, settingsRes] = await Promise.all([
        getEnquiries({ status: selectedStatus, search: searchQuery }),
        getEnquiryStats(),
        getWhatsAppSettings(),
      ]);
      if (res.enquiries) {
        setEnquiries(res.enquiries);
      }
      setStats(statsRes);
      if (settingsRes) {
        setSettings(settingsRes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await saveWhatsAppSettings(settings);
      if (res.success && res.settings) {
        setSettings(res.settings);
        showToast('WhatsApp gateway settings saved.');
      } else {
        showToast(res.error || 'Failed to save settings.');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    setEnquiries(prev =>
      prev.map(e => (e.id === id ? { ...e, status: newStatus } : e))
    );
    await updateEnquiry(id, { status: newStatus });
    showToast(`Status updated to "${newStatus}"`);
    loadData();
  };

  const handleNotesChange = async (id: string, notes: string) => {
    setEnquiries(prev =>
      prev.map(e => (e.id === id ? { ...e, adminNotes: notes } : e))
    );
    await updateEnquiry(id, { adminNotes: notes });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this enquiry record?')) {
      await deleteEnquiry(id);
      setEnquiries(prev => prev.filter(e => e.id !== id));
      showToast('Enquiry deleted.');
      loadData();
    }
  };

  const handleTestWhatsApp = async () => {
    setTestingWhatsApp(true);
    setTestResult(null);
    try {
      const res = await testWhatsAppNotification({
        settings,
        customMessage: 'Live test ping verifying dual WhatsApp alert delivery engine.',
      });
      setTestResult(res);
      if (res.logs?.[0]?.status === 'delivered' && res.logs?.[1]?.status === 'delivered') {
        showToast('✅ Test message DELIVERED to both business phones!');
      } else {
        showToast(res.message || 'Test completed.');
      }
    } catch (err: any) {
      showToast('WhatsApp test failed: ' + err.message);
    } finally {
      setTestingWhatsApp(false);
    }
  };

  const exportToCSV = async () => {
    if (enquiries.length === 0) {
      alert('No enquiries to export.');
      return;
    }
    await exportEnquiriesToExcel(enquiries, selectedStatus !== 'All' ? `Status: ${selectedStatus}` : 'All Enquiries');
    showToast('Exported CSV successfully.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
      id="admin-dashboard-backdrop"
    >
      <div
        className="relative w-full max-w-6xl h-[92vh] max-h-[900px] rounded-2xl bg-[#001226] border border-[#C5A028]/50 p-4 sm:p-6 shadow-2xl shadow-black flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
        id="admin-dashboard-card"
      >
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C5A028] to-transparent" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#001A33] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700/60 z-10"
          id="admin-dashboard-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-lg bg-emerald-950/95 border border-emerald-500 text-emerald-300 text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Authentication Gate */}
        {!isAuthenticated ? (
          <div className="py-12 sm:py-16 max-w-sm mx-auto text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#001A33] border-2 border-[#C5A028] flex items-center justify-center text-[#C5A028] mx-auto shadow-lg shadow-black">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-white">
                Admin Management Portal
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your security PIN to view enquiries and configure WhatsApp gateway.
              </p>
            </div>

            {pinError && (
              <div className="p-2.5 rounded bg-red-950/80 border border-red-500/50 text-red-300 text-xs">
                {pinError}
              </div>
            )}

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                maxLength={10}
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="Enter PIN (e.g. 1995)"
                className="w-full text-center tracking-[0.4em] font-mono text-xl py-2.5 rounded-lg bg-[#001A33] border border-slate-700 focus:border-[#C5A028] text-white outline-none"
                autoFocus
                id="admin-pin-input"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] font-bold text-xs uppercase tracking-wider transition-all shadow cursor-pointer"
                id="admin-unlock-btn"
              >
                Unlock Dashboard
              </button>
            </form>

            <div className="text-[11px] text-slate-500">
              ELITE GROUP – SS CHIT FUNDS • Authorized Personnel Only (PIN: 1995)
            </div>
          </div>
        ) : (
          /* Main Admin View */
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#001A33] border border-[#C5A028]/50 flex items-center justify-center text-[#C5A028]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-['Cinzel'] text-lg font-bold text-white">
                      Enquiry Management Dashboard
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Business Lines: <strong className="text-slate-300">+91 7338736352</strong> & <strong className="text-slate-300">+91 9345836032</strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pr-8 sm:pr-0">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`px-3 py-1.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    showSettings
                      ? 'bg-[#C5A028] text-[#001A33] font-bold border-[#C5A028]'
                      : 'bg-[#001A33] hover:bg-[#00264d] border-slate-700 text-slate-200 hover:text-[#C5A028]'
                  }`}
                  id="admin-whatsapp-settings-btn"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>WhatsApp Gateway Setup</span>
                </button>

                <button
                  onClick={handleTestWhatsApp}
                  disabled={testingWhatsApp}
                  className="px-3 py-1.5 rounded-md bg-[#001A33] hover:bg-[#00264d] border border-slate-700 text-slate-200 hover:text-[#C5A028] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Test notification engine"
                  id="admin-test-wa-btn"
                >
                  <Send className="w-3.5 h-3.5 text-[#C5A028]" />
                  <span>{testingWhatsApp ? 'Testing...' : 'Test WhatsApp Ping'}</span>
                </button>

                <button
                  onClick={exportToCSV}
                  className="px-3 py-1.5 rounded-md bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Export to Excel / CSV"
                  id="admin-export-csv-btn"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={loadData}
                  className="p-1.5 rounded-md bg-[#001A33] hover:bg-[#00264d] border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Refresh data"
                  id="admin-refresh-btn"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* WhatsApp Gateway Settings Drawer / Panel */}
            {showSettings && (
              <div className="my-3 p-4 rounded-xl bg-[#001A33] border border-[#C5A028]/40 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-3 max-h-[60vh] overflow-y-auto">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-['Cinzel'] text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-[#C5A028]" />
                        WhatsApp Delivery Gateway Settings
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        settings.provider !== 'none'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}>
                        {settings.provider !== 'none' ? `${settings.provider} Active` : '1-Click Send Only'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configure automated server delivery to <strong>+91 7338736352</strong> and <strong>+91 9345836032</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs"
                  >
                    Close Setup
                  </button>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  {/* Select Provider */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Choose Delivery Method:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {[
                        { id: 'callmebot', name: 'CallMeBot (FREE)', desc: 'Instant WhatsApp alerts, free forever' },
                        { id: 'ultramsg', name: 'UltraMsg', desc: 'Scan QR with any WhatsApp phone' },
                        { id: 'meta', name: 'Meta Cloud API', desc: 'Official Facebook Business API' },
                        { id: 'none', name: '1-Click Direct Send', desc: 'Opens WhatsApp on submit (0 API keys)' },
                      ].map(p => (
                        <div
                          key={p.id}
                          onClick={() => setSettings(s => ({ ...s, provider: p.id as WhatsAppProvider }))}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            settings.provider === p.id
                              ? 'bg-[#00264d] border-[#C5A028] text-white shadow-md'
                              : 'bg-[#001226] border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white">{p.name}</span>
                            <input
                              type="radio"
                              name="provider"
                              checked={settings.provider === p.id}
                              onChange={() => {}}
                              className="accent-[#C5A028]"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Provider Specific Inputs */}
                  {settings.provider === 'callmebot' && (
                    <div className="p-3.5 rounded-lg bg-[#001226] border border-emerald-500/30 space-y-3">
                      <div className="p-3 rounded bg-emerald-950/40 border border-emerald-500/20 text-xs text-slate-300 space-y-1">
                        <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A028]" />
                          Quick 30-Second Free Setup for Both Numbers:
                        </div>
                        <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 pl-1">
                          <li>Save <strong>+34 644 10 55 84</strong> in phone contacts as <em>CallMeBot</em>.</li>
                          <li>From Phone 1 (<strong>+91 7338736352</strong>), send WhatsApp message: <code className="bg-black/50 px-1 py-0.5 rounded text-emerald-300 font-mono">I allow callmebot to send me messages</code></li>
                          <li>From Phone 2 (<strong>+91 9345836032</strong>), send the exact same message from Phone 2.</li>
                          <li>CallMeBot will reply immediately with your free API keys. Paste them below:</li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            API Key for Line 1 (+91 7338736352)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 481920"
                            value={settings.callmebotApiKey1 || ''}
                            onChange={e => setSettings(s => ({ ...s, callmebotApiKey1: e.target.value }))}
                            className="w-full px-3 py-2 rounded bg-[#001A33] border border-slate-700 text-white text-xs font-mono focus:border-[#C5A028] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            API Key for Line 2 (+91 9345836032)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 592813"
                            value={settings.callmebotApiKey2 || ''}
                            onChange={e => setSettings(s => ({ ...s, callmebotApiKey2: e.target.value }))}
                            className="w-full px-3 py-2 rounded bg-[#001A33] border border-slate-700 text-white text-xs font-mono focus:border-[#C5A028] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {settings.provider === 'ultramsg' && (
                    <div className="p-3.5 rounded-lg bg-[#001226] border border-slate-800 space-y-3">
                      <p className="text-xs text-slate-400">
                        UltraMsg instance connects directly to WhatsApp by scanning a QR code on <a href="https://ultramsg.com" target="_blank" rel="noreferrer" className="text-[#C5A028] underline">ultramsg.com</a>.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            UltraMsg Instance ID
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. instance12345"
                            value={settings.ultramsgInstanceId || ''}
                            onChange={e => setSettings(s => ({ ...s, ultramsgInstanceId: e.target.value }))}
                            className="w-full px-3 py-2 rounded bg-[#001A33] border border-slate-700 text-white text-xs font-mono focus:border-[#C5A028] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            UltraMsg Token
                          </label>
                          <input
                            type="password"
                            placeholder="e.g. abc123xyz"
                            value={settings.ultramsgToken || ''}
                            onChange={e => setSettings(s => ({ ...s, ultramsgToken: e.target.value }))}
                            className="w-full px-3 py-2 rounded bg-[#001A33] border border-slate-700 text-white text-xs font-mono focus:border-[#C5A028] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {settings.provider === 'meta' && (
                    <div className="p-3.5 rounded-lg bg-[#001226] border border-slate-800 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Meta WhatsApp Token (Bearer)
                          </label>
                          <input
                            type="password"
                            placeholder="EAAG..."
                            value={settings.metaToken || ''}
                            onChange={e => setSettings(s => ({ ...s, metaToken: e.target.value }))}
                            className="w-full px-3 py-2 rounded bg-[#001A33] border border-slate-700 text-white text-xs font-mono focus:border-[#C5A028] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Phone Number ID
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 1092837465"
                            value={settings.metaPhoneId || ''}
                            onChange={e => setSettings(s => ({ ...s, metaPhoneId: e.target.value }))}
                            className="w-full px-3 py-2 rounded bg-[#001A33] border border-slate-700 text-white text-xs font-mono focus:border-[#C5A028] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fallback Checkbox */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="auto-open-client"
                      checked={settings.autoOpenClient !== false}
                      onChange={e => setSettings(s => ({ ...s, autoOpenClient: e.target.checked }))}
                      className="accent-[#C5A028] rounded cursor-pointer"
                    />
                    <label htmlFor="auto-open-client" className="text-xs text-slate-300 cursor-pointer">
                      Always provide 1-click Direct WhatsApp buttons on enquiry submission (Guaranteed delivery)
                    </label>
                  </div>

                  {/* Settings Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="px-4 py-2 rounded-md bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSavingSettings ? 'Saving...' : 'Save Gateway Settings'}
                    </button>

                    <button
                      type="button"
                      onClick={handleTestWhatsApp}
                      disabled={testingWhatsApp}
                      className="px-4 py-2 rounded-md bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{testingWhatsApp ? 'Sending Ping...' : 'Send Live Test Message Now'}</span>
                    </button>
                  </div>
                </form>

                {/* Live Test Feedback Box */}
                {testResult && (
                  <div className="p-3.5 rounded-lg bg-[#001226] border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A028]" />
                        Live Test Results for Business Lines
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Provider: {testResult.provider || 'none'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Line 1 (+91 7338736352):</span>
                        <span className={testResult.logs?.[0]?.status === 'delivered' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-semibold'}>
                          {testResult.logs?.[0]?.status === 'delivered' ? 'Delivered to Phone' : testResult.logs?.[0]?.error || 'Pending Direct Send'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Line 2 (+91 9345836032):</span>
                        <span className={testResult.logs?.[1]?.status === 'delivered' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-semibold'}>
                          {testResult.logs?.[1]?.status === 'delivered' ? 'Delivered to Phone' : testResult.logs?.[1]?.error || 'Pending Direct Send'}
                        </span>
                      </div>
                    </div>

                    {testResult.directUrls && (
                      <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                        <a
                          href={testResult.directUrls.line1}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[11px] font-semibold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open Test Chat on Line 1</span>
                        </a>
                        <a
                          href={testResult.directUrls.line2}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[11px] font-semibold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open Test Chat on Line 2</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* KPI Stat Cards Strip */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 my-3 shrink-0">
                <div className="p-2.5 rounded-lg bg-[#001A33] border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Enquiries</div>
                  <div className="text-xl font-bold text-white mt-0.5">{stats.total}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                  <div className="text-[10px] uppercase font-bold text-emerald-400">New Leads</div>
                  <div className="text-xl font-bold text-emerald-300 mt-0.5">{stats.newCount}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/30">
                  <div className="text-[10px] uppercase font-bold text-sky-400">Contacted</div>
                  <div className="text-xl font-bold text-sky-300 mt-0.5">{stats.contactedCount}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30">
                  <div className="text-[10px] uppercase font-bold text-amber-400">Follow-up</div>
                  <div className="text-xl font-bold text-amber-300 mt-0.5">{stats.followUpCount}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/30">
                  <div className="text-[10px] uppercase font-bold text-purple-400">Converted</div>
                  <div className="text-xl font-bold text-purple-300 mt-0.5">{stats.convertedCount}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Closed</div>
                  <div className="text-xl font-bold text-slate-300 mt-0.5">{stats.closedCount}</div>
                </div>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800 shrink-0">
              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1">
                {['All', 'New', 'Contacted', 'Follow-up', 'Converted', 'Closed'].map(st => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      selectedStatus === st
                        ? 'bg-[#C5A028] text-[#001A33] font-bold shadow'
                        : 'bg-[#001A33] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative flex-1 sm:flex-initial sm:min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search customer, phone, plan..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-md bg-[#001A33] border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-[#C5A028] outline-none"
                />
              </div>
            </div>

            {/* Enquiries List / Table */}
            <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-3">
              {enquiries.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Filter className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-sm">No enquiries found for the selected filter.</p>
                </div>
              ) : (
                enquiries.map(enq => {
                  const cleanPhone = enq.mobileNumber.replace(/[^0-9]/g, '');
                  const waCustomerUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${enq.fullName}, greetings from ELITE GROUP – SS CHIT FUNDS regarding your enquiry for the ${enq.interestedPlan} chit plan.`
                  )}`;

                  const stConf = STATUS_CONFIG[enq.status] || STATUS_CONFIG.New;

                  const formattedMsg = formatWhatsAppEnquiryText(enq);
                  const forwardLine1 = `https://api.whatsapp.com/send?phone=917338736352&text=${encodeURIComponent(formattedMsg)}`;
                  const forwardLine2 = `https://api.whatsapp.com/send?phone=919345836032&text=${encodeURIComponent(formattedMsg)}`;

                  return (
                    <div
                      key={enq.id}
                      className="p-3.5 sm:p-4 rounded-lg bg-[#001A33] border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3"
                    >
                      {/* Top Row: Customer Info, Status, Date */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-base text-white">
                              {enq.fullName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 bg-[#001226] px-1.5 py-0.5 rounded">
                              {enq.id}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <a
                              href={`tel:${cleanPhone}`}
                              className="text-slate-300 hover:text-[#C5A028] flex items-center gap-1 font-semibold"
                            >
                              <Phone className="w-3 h-3 text-[#C5A028]" />
                              <span>{enq.mobileNumber}</span>
                            </a>

                            <a
                              href={waCustomerUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold flex items-center gap-1"
                              title="Chat with customer on WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>Chat on WA</span>
                            </a>
                          </div>
                        </div>

                        {/* Status Control & Delete */}
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                              Status:
                            </label>
                            <select
                              value={enq.status}
                              onChange={e => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                              className={`px-2.5 py-1 rounded text-xs font-bold border cursor-pointer outline-none ${stConf.bg} ${stConf.text} ${stConf.border}`}
                            >
                              <option value="New">New Lead</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Follow-up">Follow-up</option>
                              <option value="Converted">Converted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>

                          <button
                            onClick={() => handleDelete(enq.id)}
                            className="p-1.5 rounded bg-slate-900 hover:bg-red-950/80 text-slate-500 hover:text-red-400 border border-slate-800 transition-colors cursor-pointer mt-3"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Middle: Plan Details & Customer Message */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-[#001226] p-2.5 rounded border border-slate-800/80">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Interested Plan / Value</div>
                          <div className="text-[#C5A028] font-semibold mt-0.5">
                            {enq.interestedPlan}
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Customer Message / Enquiry</div>
                          <div className="text-slate-300 italic mt-0.5">
                            {enq.message ? `"${enq.message}"` : 'No custom message provided.'}
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp Delivery Status Strip & Forward Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-[11px]">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-400">
                          <span className="flex items-center gap-1 text-[#C5A028]">
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp Delivery:
                          </span>
                          <span>
                            +91 7338736352:{' '}
                            <strong className={enq.whatsappNotifications?.[0]?.status === 'delivered' ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'}>
                              {enq.whatsappNotifications?.[0]?.status || 'pending'}
                            </strong>
                          </span>
                          <span>|</span>
                          <span>
                            +91 9345836032:{' '}
                            <strong className={enq.whatsappNotifications?.[1]?.status === 'delivered' ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'}>
                              {enq.whatsappNotifications?.[1]?.status || 'pending'}
                            </strong>
                          </span>
                        </div>

                        {/* Direct Re-Send to Business Lines */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500">Forward Alert:</span>
                          <a
                            href={forwardLine1}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-[#00264d] text-slate-300 hover:text-emerald-400 text-[10px] font-semibold"
                            title="Forward to Line 1 (+91 7338736352)"
                          >
                            Line 1
                          </a>
                          <a
                            href={forwardLine2}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-[#00264d] text-slate-300 hover:text-emerald-400 text-[10px] font-semibold"
                            title="Forward to Line 2 (+91 9345836032)"
                          >
                            Line 2
                          </a>
                          <span className="text-[10px] text-slate-500 ml-2">
                            {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Admin Follow-up Notes */}
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-800/40">
                        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Admin Notes:</span>
                        <input
                          type="text"
                          defaultValue={enq.adminNotes || ''}
                          onBlur={e => handleNotesChange(enq.id, e.target.value)}
                          placeholder="Type internal note and click away to save..."
                          className="w-full px-2 py-1 rounded bg-[#001226] border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:border-[#C5A028] outline-none"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Status Bar */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
              <span>Showing <strong>{enquiries.length}</strong> enquiries</span>
              <span>ELITE GROUP SS CHIT FUNDS Management System • Mettupalayam</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
