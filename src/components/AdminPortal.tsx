import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageCircle,
  FileSpreadsheet,
  Building2,
  Phone,
  Search,
  RefreshCw,
  Trash2,
  Send,
  LogOut,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Sparkles,
  Settings,
  MapPin,
  Clock,
  Globe,
  ChevronRight,
  Table as TableIcon,
  LayoutGrid,
  ArrowUpDown,
  Download,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  EnquiryRecord, 
  EnquiryStatus, 
  EnquiryStats, 
  WhatsAppSettings, 
  WhatsAppProvider 
} from '../types';
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
import { logoutAdmin } from '../services/adminAuthService';
import { COMPANY_DETAILS, CHIT_PLANS_SUMMARY } from '../data/chitPlansData';
import { BrandLogo } from './BrandLogo';
import { AdminExportModal } from './AdminExportModal';
import { 
  exportEnquiriesToExcel, 
  exportEnquiriesToCSV, 
  formatExportDateTime, 
  formatExportPhone, 
  cleanPhoneForWhatsApp 
} from '../utils/enquiryExport';

interface AdminPortalProps {
  onLogout: () => void;
  onSwitchToPublic: () => void;
}

type AdminTab = 'enquiries' | 'whatsapp' | 'catalog' | 'company';

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

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onLogout,
  onSwitchToPublic,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('enquiries');

  // Enquiries Data State
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [stats, setStats] = useState<EnquiryStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'plan'>('newest');
  const [viewStyle, setViewStyle] = useState<'table' | 'cards'>('table');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [testingWhatsApp, setTestingWhatsApp] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // WhatsApp Gateway Settings State
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
    loadData();
  }, [selectedStatus, searchQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    setEnquiries(prev =>
      prev.map(e => (e.id === id ? { ...e, status: newStatus } : e))
    );
    await updateEnquiry(id, { status: newStatus });
    showToast('Changes saved successfully.');
    loadData();
  };

  const handleNotesChange = async (id: string, notes: string) => {
    setEnquiries(prev =>
      prev.map(e => (e.id === id ? { ...e, adminNotes: notes } : e))
    );
    await updateEnquiry(id, { adminNotes: notes });
    showToast('Changes saved successfully.');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this enquiry record?')) {
      await deleteEnquiry(id);
      setEnquiries(prev => prev.filter(e => e.id !== id));
      showToast('Changes saved successfully.');
      loadData();
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await saveWhatsAppSettings(settings);
      if (res.success && res.settings) {
        setSettings(res.settings);
        showToast('Changes saved successfully.');
      } else {
        showToast(res.error || 'Failed to save settings.');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving settings.');
    } finally {
      setIsSavingSettings(false);
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
        showToast('Test message DELIVERED to both business phones.');
      } else {
        showToast(res.message || 'Test completed.');
      }
    } catch (err: any) {
      showToast('WhatsApp test error: ' + err.message);
    } finally {
      setTestingWhatsApp(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out of the Admin Portal?')) {
      await logoutAdmin();
      onLogout();
    }
  };

  // Filter & Sort Enquiries for rendering
  const processedEnquiries = enquiries
    .filter(enq => {
      if (selectedPlanFilter !== 'All') {
        const match =
          enq.interestedPlan.includes(selectedPlanFilter) ||
          enq.preferredChitValue.includes(selectedPlanFilter);
        if (!match) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'name') {
        return a.fullName.localeCompare(b.fullName);
      } else if (sortBy === 'plan') {
        return a.interestedPlan.localeCompare(b.interestedPlan);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#000d1a] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-[#C5A028] selection:text-[#001A33]" id="admin-portal-root">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className="fixed top-5 right-5 z-50 px-4 py-3 rounded-lg bg-[#001A33] border border-emerald-500 text-emerald-300 text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3"
          id="admin-toast-message"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#001226] border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showSubtext={false} />
            <div>
              <div className="font-['Cinzel'] font-bold text-sm text-white tracking-wide">
                ELITE GROUP
              </div>
              <div className="text-[10px] text-[#C5A028] font-semibold tracking-wider uppercase">
                Admin Management Portal
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            SECURE
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1.5 flex-1" id="admin-sidebar-nav">
          {[
            { id: 'enquiries', label: 'Enquiries & Leads', icon: Users, badge: stats?.newCount ? `${stats.newCount} New` : null },
            { id: 'whatsapp', label: 'WhatsApp Gateway', icon: MessageCircle, badge: settings.provider !== 'none' ? 'Active' : 'Direct' },
            { id: 'catalog', label: 'Chit Plans Catalog', icon: FileSpreadsheet, badge: '6 Plans' },
            { id: 'company', label: 'Company & Office', icon: Building2, badge: 'Kuttaiyur' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C5A028] text-[#001A33] font-bold shadow-md shadow-[#C5A028]/20'
                    : 'text-slate-300 hover:text-white hover:bg-[#001A33]'
                }`}
                id={`admin-tab-${tab.id}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#001A33]' : 'text-[#C5A028]'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-[#001A33] text-[#C5A028]' : 'bg-[#001A33] text-slate-400 border border-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Public Website Link & Logout Button */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-[#000d1a]/50">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold px-1">
            Session Controls
          </div>

          <button
            onClick={onSwitchToPublic}
            className="w-full py-2 px-3 rounded-lg bg-[#001A33] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
            id="admin-view-public-btn"
            title="Preview public website without logging out"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#C5A028]" />
              <span>View Public Website</span>
            </span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
            id="admin-logout-btn"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT ADMIN</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Workspace Top Bar */}
        <header className="px-5 py-3.5 bg-[#001226] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Admin Portal</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <h1 className="font-['Cinzel'] text-sm sm:text-base font-bold text-white capitalize">
              {activeTab === 'enquiries' && 'Customer Enquiries & Lead Pipeline'}
              {activeTab === 'whatsapp' && 'WhatsApp Delivery Gateway Configuration'}
              {activeTab === 'catalog' && 'Official 21-Tier Chit Plans Catalog'}
              {activeTab === 'company' && 'Company Credentials & Office Location'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'enquiries' && (
              <>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow shadow-[#C5A028]/20"
                  id="admin-top-export-excel"
                  title="Export styled Excel report (.xlsx) or CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>EXPORT ENQUIRIES</span>
                </button>

                <button
                  onClick={loadData}
                  className="p-1.5 rounded-lg bg-[#001A33] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </>
            )}

            {/* Quick Logout Icon on Top Bar */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="End session and return to public website"
              id="admin-top-logout-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: ENQUIRIES & LEADS PIPELINE */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              
              {/* KPI Stat Cards Strip */}
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 shrink-0">
                  <div className="p-3 rounded-xl bg-[#001226] border border-slate-800 shadow">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total Enquiries</div>
                    <div className="text-2xl font-bold text-white mt-0.5">{stats.total}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 shadow">
                    <div className="text-[10px] uppercase font-bold text-emerald-400">New Leads</div>
                    <div className="text-2xl font-bold text-emerald-300 mt-0.5">{stats.newCount}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 shadow">
                    <div className="text-[10px] uppercase font-bold text-sky-400">Contacted</div>
                    <div className="text-2xl font-bold text-sky-300 mt-0.5">{stats.contactedCount}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 shadow">
                    <div className="text-[10px] uppercase font-bold text-amber-400">Follow-up</div>
                    <div className="text-2xl font-bold text-amber-300 mt-0.5">{stats.followUpCount}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 shadow">
                    <div className="text-[10px] uppercase font-bold text-purple-400">Converted</div>
                    <div className="text-2xl font-bold text-purple-300 mt-0.5">{stats.convertedCount}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shadow">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Closed</div>
                    <div className="text-2xl font-bold text-slate-300 mt-0.5">{stats.closedCount}</div>
                  </div>
                </div>
              )}

              {/* Advanced Filter & Search Bar */}
              <div className="p-3.5 rounded-xl bg-[#001226] border border-slate-800 shadow space-y-3">
                
                {/* Row 1: Status Filter Tabs & View Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Status Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {['All', 'New', 'Contacted', 'Follow-up', 'Converted', 'Closed'].map(st => (
                      <button
                        key={st}
                        onClick={() => setSelectedStatus(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedStatus === st
                            ? 'bg-[#C5A028] text-[#001A33] font-bold shadow'
                            : 'bg-[#001A33] text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* View Switcher: CRM Table vs Pipeline Cards */}
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-[#001A33] border border-slate-800">
                    <button
                      onClick={() => setViewStyle('table')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        viewStyle === 'table'
                          ? 'bg-[#00264d] text-[#C5A028] border border-[#C5A028]/40 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="CRM Table View"
                    >
                      <TableIcon className="w-3.5 h-3.5" />
                      <span>Table</span>
                    </button>
                    <button
                      onClick={() => setViewStyle('cards')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        viewStyle === 'cards'
                          ? 'bg-[#00264d] text-[#C5A028] border border-[#C5A028]/40 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Detailed Cards View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Cards</span>
                    </button>
                  </div>
                </div>

                {/* Row 2: Search, Plan Filter, Sort & Export Trigger */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-slate-800/80">
                  
                  {/* Search Box */}
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search customer, phone, message, ID..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#001A33] border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-[#C5A028] outline-none"
                    />
                  </div>

                  {/* Plan Filter Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Plan:</span>
                    <select
                      value={selectedPlanFilter}
                      onChange={e => setSelectedPlanFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#001A33] border border-slate-700 text-xs text-white focus:border-[#C5A028] outline-none cursor-pointer"
                    >
                      <option value="All">All Chit Values</option>
                      <option value="₹50,000">₹50,000</option>
                      <option value="₹1,00,000">₹1,00,000</option>
                      <option value="₹2,00,000">₹2,00,000</option>
                      <option value="₹3,00,000">₹3,00,000</option>
                      <option value="₹4,00,000">₹4,00,000</option>
                      <option value="₹5,00,000">₹5,00,000</option>
                    </select>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value as any)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#001A33] border border-slate-700 text-xs text-white focus:border-[#C5A028] outline-none cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name">Customer Name (A-Z)</option>
                      <option value="plan">Plan Value</option>
                    </select>
                  </div>

                  {/* Export Enquiries Button */}
                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    id="admin-export-btn"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Enquiries</span>
                  </button>

                  <span className="text-[11px] text-slate-400 ml-auto font-mono">
                    Showing: <strong>{processedEnquiries.length}</strong> records
                  </span>
                </div>
              </div>

              {/* VIEW STYLE 1: PROFESSIONAL CRM DATA TABLE */}
              {viewStyle === 'table' && (
                <div className="rounded-xl border border-slate-800 bg-[#001226] overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#001A33] text-[#C5A028] border-b border-slate-800">
                          <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] w-40">
                            Enquiry ID & Date
                          </th>
                          <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] w-48">
                            Customer Info
                          </th>
                          <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] w-48">
                            Interested Plan
                          </th>
                          <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] min-w-[200px]">
                            Customer Message
                          </th>
                          <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] w-36 text-center">
                            Status
                          </th>
                          <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] w-56">
                            Admin Notes
                          </th>
                          <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] w-44">
                            WhatsApp Alerts
                          </th>
                          <th className="py-3 px-2 font-bold uppercase tracking-wider text-[11px] w-12 text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {processedEnquiries.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-16 text-center text-slate-400">
                              <Filter className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                              <p className="text-sm">No enquiries found for the selected filters.</p>
                            </td>
                          </tr>
                        ) : (
                          processedEnquiries.map(enq => {
                            const cleanPhone = cleanPhoneForWhatsApp(enq.mobileNumber);
                            const formattedPhone = formatExportPhone(enq.mobileNumber);
                            const formattedDate = formatExportDateTime(enq.createdAt);
                            const stConf = STATUS_CONFIG[enq.status] || STATUS_CONFIG.New;

                            const formattedMsg = formatWhatsAppEnquiryText(enq);
                            const forwardLine1 = `https://api.whatsapp.com/send?phone=917338736352&text=${encodeURIComponent(formattedMsg)}`;
                            const forwardLine2 = `https://api.whatsapp.com/send?phone=919345836032&text=${encodeURIComponent(formattedMsg)}`;
                            const waCustomerUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                              `Hello ${enq.fullName}, greetings from ELITE GROUP – SS CHIT FUNDS regarding your enquiry for the ${enq.interestedPlan} chit plan.`
                            )}`;

                            return (
                              <tr
                                key={enq.id}
                                className="hover:bg-[#001730] transition-colors"
                                id={`enquiry-table-row-${enq.id}`}
                              >
                                {/* 1. Enquiry ID & Date */}
                                <td className="py-3 px-3.5 align-top">
                                  <div className="font-mono text-[10px] text-slate-400">
                                    {enq.id}
                                  </div>
                                  <div className="text-[11px] text-slate-300 font-medium mt-0.5 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-[#C5A028] shrink-0" />
                                    <span>{formattedDate}</span>
                                  </div>
                                </td>

                                {/* 2. Customer Name & Mobile */}
                                <td className="py-3 px-3.5 align-top">
                                  <div className="font-bold text-white text-xs">
                                    {enq.fullName}
                                  </div>
                                  <div className="font-mono text-slate-300 text-xs mt-0.5 flex items-center gap-1">
                                    <span>{formattedPhone}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-1.5">
                                    <a
                                      href={`tel:${enq.mobileNumber.replace(/[^0-9]/g, '')}`}
                                      className="px-1.5 py-0.5 rounded bg-[#001A33] hover:bg-slate-800 border border-slate-700 text-[#C5A028] text-[10px] font-semibold flex items-center gap-1"
                                      title="Call customer"
                                    >
                                      <Phone className="w-2.5 h-2.5" />
                                      <span>Call</span>
                                    </a>
                                    <a
                                      href={waCustomerUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-1.5 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold flex items-center gap-1"
                                      title="Message customer on WhatsApp"
                                    >
                                      <MessageCircle className="w-2.5 h-2.5" />
                                      <span>Chat</span>
                                    </a>
                                  </div>
                                </td>

                                {/* 3. Interested Plan */}
                                <td className="py-3 px-3.5 align-top">
                                  <div className="text-[#C5A028] font-bold text-xs">
                                    {enq.interestedPlan}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">
                                    Preferred: <strong className="text-white">{enq.preferredChitValue}</strong>
                                  </div>
                                </td>

                                {/* 4. Customer Message */}
                                <td className="py-3 px-3.5 align-top">
                                  <div className="text-slate-200 text-xs leading-relaxed break-words whitespace-pre-wrap">
                                    {enq.message ? enq.message : <span className="text-slate-500 italic">No message provided</span>}
                                  </div>
                                </td>

                                {/* 5. Status Dropdown */}
                                <td className="py-3 px-3.5 align-top text-center">
                                  <select
                                    value={enq.status}
                                    onChange={e => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer outline-none ${stConf.bg} ${stConf.text} ${stConf.border}`}
                                  >
                                    <option value="New">New Lead</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Follow-up">Follow-up</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Closed">Closed</option>
                                  </select>
                                </td>

                                {/* 6. Admin Notes */}
                                <td className="py-3 px-3.5 align-top">
                                  <input
                                    type="text"
                                    defaultValue={enq.adminNotes || ''}
                                    onBlur={e => handleNotesChange(enq.id, e.target.value)}
                                    placeholder="Add notes (auto-saves)..."
                                    className="w-full px-2.5 py-1 rounded bg-[#001A33] border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:border-[#C5A028] outline-none"
                                  />
                                </td>

                                {/* 7. Dual WhatsApp Delivery Status & Forward Links */}
                                <td className="py-3 px-3.5 align-top space-y-1">
                                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                                    <span>Line 1 (+91 7338736352):</span>
                                    <a
                                      href={forwardLine1}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-emerald-400 hover:underline font-bold"
                                      title="Send / Forward to Line 1"
                                    >
                                      Send WA
                                    </a>
                                  </div>
                                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                                    <span>Line 2 (+91 9345836032):</span>
                                    <a
                                      href={forwardLine2}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-emerald-400 hover:underline font-bold"
                                      title="Send / Forward to Line 2"
                                    >
                                      Send WA
                                    </a>
                                  </div>
                                </td>

                                {/* 8. Delete Action */}
                                <td className="py-3 px-2 align-top text-center">
                                  <button
                                    onClick={() => handleDelete(enq.id)}
                                    className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/50 transition-colors cursor-pointer"
                                    title="Delete Enquiry"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW STYLE 2: DETAILED PIPELINE CARDS */}
              {viewStyle === 'cards' && (
                <div className="space-y-3">
                  {processedEnquiries.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 space-y-2 bg-[#001226] rounded-xl border border-slate-800">
                      <Filter className="w-8 h-8 mx-auto text-slate-600" />
                      <p className="text-sm">No enquiries found for the selected filter.</p>
                    </div>
                  ) : (
                    processedEnquiries.map(enq => {
                      const cleanPhone = cleanPhoneForWhatsApp(enq.mobileNumber);
                      const formattedPhone = formatExportPhone(enq.mobileNumber);
                      const formattedDate = formatExportDateTime(enq.createdAt);
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
                          className="p-4 sm:p-5 rounded-xl bg-[#001226] border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3"
                          id={`enquiry-card-${enq.id}`}
                        >
                          {/* Top Row: Customer Info, Status, Date */}
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-base text-white">
                                  {enq.fullName}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500 bg-[#001A33] px-1.5 py-0.5 rounded border border-slate-800">
                                  {enq.id}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <a
                                  href={`tel:${enq.mobileNumber.replace(/[^0-9]/g, '')}`}
                                  className="text-slate-300 hover:text-[#C5A028] flex items-center gap-1 font-semibold"
                                >
                                  <Phone className="w-3 h-3 text-[#C5A028]" />
                                  <span>{formattedPhone}</span>
                                </a>

                                <a
                                  href={waCustomerUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold flex items-center gap-1 shadow-sm"
                                  title="Chat with customer on WhatsApp"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>Chat on WA</span>
                                </a>
                              </div>
                            </div>

                            {/* Status Dropdown & Delete */}
                            <div className="flex items-center gap-2">
                              <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                                  Status:
                                </label>
                                <select
                                  value={enq.status}
                                  onChange={e => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer outline-none ${stConf.bg} ${stConf.text} ${stConf.border}`}
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
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 transition-colors cursor-pointer mt-3"
                                title="Delete Enquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Middle: Plan Details & Customer Message */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs bg-[#001A33] p-3 rounded-lg border border-slate-800/80">
                            <div>
                              <div className="text-[10px] uppercase font-bold text-slate-400">Interested Plan / Value</div>
                              <div className="text-[#C5A028] font-bold mt-0.5">
                                {enq.interestedPlan}
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] uppercase font-bold text-slate-400">Customer Message / Enquiry</div>
                              <div className="text-slate-300 italic mt-0.5 break-words">
                                {enq.message ? `"${enq.message}"` : 'No custom message provided.'}
                              </div>
                            </div>
                          </div>

                          {/* WhatsApp Delivery Status Strip & Forward Actions */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px]">
                            <div className="flex flex-wrap items-center gap-3 text-slate-400">
                              <span className="flex items-center gap-1 text-[#C5A028] font-semibold">
                                <MessageCircle className="w-3.5 h-3.5" />
                                WhatsApp Delivery:
                              </span>
                              <span>
                                +91 7338736352:{' '}
                                <strong className="text-emerald-400 font-mono">
                                  {enq.whatsappNotifications?.[0]?.status === 'delivered' ? 'Delivered' : 'Ready'}
                                </strong>
                              </span>
                              <span>|</span>
                              <span>
                                +91 9345836032:{' '}
                                <strong className="text-emerald-400 font-mono">
                                  {enq.whatsappNotifications?.[1]?.status === 'delivered' ? 'Delivered' : 'Ready'}
                                </strong>
                              </span>
                            </div>

                            {/* Forward Alert Links */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-500 font-semibold">Forward Alert:</span>
                              <a
                                href={forwardLine1}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-[#00264d] text-slate-300 hover:text-emerald-400 text-[10px] font-semibold transition-colors"
                                title="Forward to Line 1 (+91 7338736352)"
                              >
                                Line 1
                              </a>
                              <a
                                href={forwardLine2}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-[#00264d] text-slate-300 hover:text-emerald-400 text-[10px] font-semibold transition-colors"
                                title="Forward to Line 2 (+91 9345836032)"
                              >
                                Line 2
                              </a>
                              <span className="text-[10px] text-slate-500 ml-2">
                                {formattedDate}
                              </span>
                            </div>
                          </div>

                          {/* Admin Follow-up Notes */}
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/40">
                            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Admin Notes:</span>
                            <input
                              type="text"
                              defaultValue={enq.adminNotes || ''}
                              onBlur={e => handleNotesChange(enq.id, e.target.value)}
                              placeholder="Type internal follow-up note and click away to save..."
                              className="w-full px-3 py-1.5 rounded-lg bg-[#001A33] border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:border-[#C5A028] outline-none"
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WHATSAPP GATEWAY SETTINGS */}
          {activeTab === 'whatsapp' && (
            <div className="max-w-4xl space-y-5">
              <div className="p-5 rounded-2xl bg-[#001226] border border-slate-800 shadow-xl space-y-5">
                
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-['Cinzel'] text-lg font-bold text-white flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-[#C5A028]" />
                      Dual WhatsApp Delivery Gateway Configuration
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure automated delivery to both registered lines: <strong>+91 7338736352</strong> & <strong>+91 9345836032</strong>.
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    settings.provider !== 'none'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  }`}>
                    {settings.provider !== 'none' ? `${settings.provider} Active` : '1-Click Direct Send Active'}
                  </span>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-5">
                  {/* Select Provider */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                      Select Gateway Provider:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {[
                        { id: 'callmebot', name: 'CallMeBot (FREE)', desc: 'Direct WhatsApp alerts, zero credit card' },
                        { id: 'ultramsg', name: 'UltraMsg', desc: 'Scan QR with any WhatsApp phone' },
                        { id: 'meta', name: 'Meta Cloud API', desc: 'Official Facebook Business API' },
                        { id: 'none', name: '1-Click Direct Send', desc: 'Opens WhatsApp on submit (0 API keys)' },
                      ].map(p => (
                        <div
                          key={p.id}
                          onClick={() => setSettings(s => ({ ...s, provider: p.id as WhatsAppProvider }))}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            settings.provider === p.id
                              ? 'bg-[#00264d] border-[#C5A028] text-white shadow-lg'
                              : 'bg-[#001A33] border-slate-800 text-slate-400 hover:text-slate-200'
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
                          <p className="text-[11px] text-slate-400 mt-1">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CallMeBot Settings */}
                  {settings.provider === 'callmebot' && (
                    <div className="p-4 rounded-xl bg-[#001A33] border border-emerald-500/30 space-y-3.5">
                      <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-xs text-slate-300 space-y-1.5">
                        <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-[#C5A028]" />
                          Free 30-Second Setup for Both Business Lines:
                        </div>
                        <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300 pl-1">
                          <li>Save <strong>+34 644 10 55 84</strong> in phone contacts as <em>CallMeBot</em>.</li>
                          <li>From Phone 1 (<strong>+91 7338736352</strong>), send WhatsApp message: <code className="bg-black/50 px-1 py-0.5 rounded text-emerald-300 font-mono">I allow callmebot to send me messages</code></li>
                          <li>From Phone 2 (<strong>+91 9345836032</strong>), send the exact same message from Phone 2.</li>
                          <li>CallMeBot will reply immediately with your free API keys. Enter them below:</li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            API Key for Line 1 (+91 7338736352)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 481920"
                            value={settings.callmebotApiKey1 || ''}
                            onChange={e => setSettings(s => ({ ...s, callmebotApiKey1: e.target.value }))}
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#001226] border border-slate-700 text-white text-xs font-mono focus:border-[#C5A028] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            API Key for Line 2 (+91 9345836032)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 592813"
                            value={settings.callmebotApiKey2 || ''}
                            onChange={e => setSettings(s => ({ ...s, callmebotApiKey2: e.target.value }))}
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#001226] border border-slate-700 text-white text-xs font-mono focus:border-[#C5A028] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UltraMsg Settings */}
                  {settings.provider === 'ultramsg' && (
                    <div className="p-4 rounded-xl bg-[#001A33] border border-slate-800 space-y-3.5">
                      <p className="text-xs text-slate-400">
                        UltraMsg instance connects directly to WhatsApp by scanning a QR code on <a href="https://ultramsg.com" target="_blank" rel="noreferrer" className="text-[#C5A028] underline">ultramsg.com</a>.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            UltraMsg Instance ID
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. instance12345"
                            value={settings.ultramsgInstanceId || ''}
                            onChange={e => setSettings(s => ({ ...s, ultramsgInstanceId: e.target.value }))}
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#001226] border border-slate-700 text-white text-xs font-mono focus:border-[#C5A028] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            UltraMsg Token
                          </label>
                          <input
                            type="password"
                            placeholder="e.g. abc123xyz"
                            value={settings.ultramsgToken || ''}
                            onChange={e => setSettings(s => ({ ...s, ultramsgToken: e.target.value }))}
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#001226] border border-slate-700 text-white text-xs font-mono focus:border-[#C5A028] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Meta Settings */}
                  {settings.provider === 'meta' && (
                    <div className="p-4 rounded-xl bg-[#001A33] border border-slate-800 space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            Meta WhatsApp Token (Bearer)
                          </label>
                          <input
                            type="password"
                            placeholder="EAAG..."
                            value={settings.metaToken || ''}
                            onChange={e => setSettings(s => ({ ...s, metaToken: e.target.value }))}
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#001226] border border-slate-700 text-white text-xs font-mono focus:border-[#C5A028] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            Phone Number ID
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 1092837465"
                            value={settings.metaPhoneId || ''}
                            onChange={e => setSettings(s => ({ ...s, metaPhoneId: e.target.value }))}
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#001226] border border-slate-700 text-white text-xs font-mono focus:border-[#C5A028] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Auto-Open Option */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="auto-open-client-portal"
                      checked={settings.autoOpenClient !== false}
                      onChange={e => setSettings(s => ({ ...s, autoOpenClient: e.target.checked }))}
                      className="accent-[#C5A028] w-4 h-4 rounded cursor-pointer"
                    />
                    <label htmlFor="auto-open-client-portal" className="text-xs text-slate-300 cursor-pointer">
                      Always provide 1-click Direct WhatsApp buttons on enquiry submission (Guaranteed delivery)
                    </label>
                  </div>

                  {/* Save and Test Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="px-5 py-2.5 rounded-lg bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md disabled:opacity-50"
                      id="admin-save-settings-btn"
                    >
                      {isSavingSettings ? 'Saving...' : 'Save Gateway Settings'}
                    </button>

                    <button
                      type="button"
                      onClick={handleTestWhatsApp}
                      disabled={testingWhatsApp}
                      className="px-5 py-2.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow"
                      id="admin-send-test-btn"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{testingWhatsApp ? 'Sending Ping...' : 'Send Live Test Ping to Both Numbers'}</span>
                    </button>
                  </div>
                </form>

                {/* Live Test Results Display */}
                {testResult && (
                  <div className="p-4 rounded-xl bg-[#001A33] border border-slate-800 text-xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C5A028]" />
                        Live Ping Results for Both Business Lines
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Provider: {testResult.provider || 'none'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
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
                          className="px-3 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Chat on Line 1</span>
                        </a>
                        <a
                          href={testResult.directUrls.line2}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Chat on Line 2</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 3: CHIT PLANS CATALOG OVERVIEW */}
          {activeTab === 'catalog' && (
            <div className="space-y-4 max-w-5xl">
              <div className="p-4 rounded-xl bg-[#001226] border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-['Cinzel'] text-base font-bold text-white">
                    Official Chit Plans Catalog
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configured denominations, contribution rates, and progression brackets.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#001A33] border border-[#C5A028]/40 text-[#C5A028] text-xs font-bold">
                  21 Installment Groups
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CHIT_PLANS_SUMMARY.map(plan => (
                  <div key={plan.id} className="p-4 rounded-xl bg-[#001226] border border-slate-800 space-y-3 shadow">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#C5A028]">Chit Value</div>
                        <h4 className="font-['Cinzel'] text-xl font-bold text-white">{plan.value}</h4>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-[#00264d] text-[#C5A028] font-mono font-bold">
                        {plan.duration}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs bg-[#001A33] p-3 rounded-lg border border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Monthly:</span>
                        <span className="font-bold text-white">{plan.monthlyContribution}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Weekly Option:</span>
                        <span className="font-semibold text-slate-200">{plan.weeklyContribution}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Daily Option:</span>
                        <span className="font-semibold text-slate-200">{plan.dailyContribution}</span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Catalog Take-Home:</span>
                        <span className="font-mono text-[#C5A028] font-bold">
                          {plan.minTakeHome} – {plan.maxTakeHome}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 italic">
                      "{plan.tagline}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMPANY & OFFICE CREDENTIALS */}
          {activeTab === 'company' && (
            <div className="max-w-3xl space-y-4">
              <div className="p-5 rounded-2xl bg-[#001226] border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#00264d] border border-[#C5A028]/40 flex items-center justify-center text-[#C5A028]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-['Cinzel'] text-lg font-bold text-white">
                      {COMPANY_DETAILS.fullBrandName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Managed by {COMPANY_DETAILS.managedBy} • Registration Details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#001A33] border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Corporate Identity Number</span>
                    <div className="text-white font-mono font-bold mt-1">{COMPANY_DETAILS.cin}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#001A33] border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Management Entity</span>
                    <div className="text-white font-bold mt-1">{COMPANY_DETAILS.managedBy}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#001A33] border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Primary Support Line</span>
                    <div className="text-white font-bold mt-1">{COMPANY_DETAILS.phone1}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#001A33] border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Secondary Support Line</span>
                    <div className="text-white font-bold mt-1">{COMPANY_DETAILS.phone2}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#001A33] border border-slate-800 text-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A028]" />
                    <span>Registered Office Address</span>
                  </div>
                  <div className="font-bold text-white text-sm pt-0.5">
                    {COMPANY_DETAILS.officeAddress}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=ELITE+TURF,+Ajandha+Garden,+Kuttaiyur,+Mettupalayam+-+641104"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg bg-[#00264d] hover:bg-[#C5A028] text-[#C5A028] hover:text-[#001A33] border border-[#C5A028]/40 text-xs font-bold uppercase flex items-center gap-2 transition-all shadow"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Open Office in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Export Enquiries Modal */}
      <AdminExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        enquiries={enquiries}
        onExportSuccess={showToast}
      />

    </div>
  );
};
