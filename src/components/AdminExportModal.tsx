import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Calendar,
  Filter,
  CheckCircle2,
  X,
  Download,
  Loader2,
  Sparkles,
  Info
} from 'lucide-react';
import { EnquiryRecord, EnquiryStatus } from '../types';
import { exportEnquiriesToExcel, exportEnquiriesToCSV } from '../utils/enquiryExport';

interface AdminExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiries: EnquiryRecord[];
  onExportSuccess: (msg: string) => void;
}

export const AdminExportModal: React.FC<AdminExportModalProps> = ({
  isOpen,
  onClose,
  enquiries,
  onExportSuccess,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [dateRangePreset, setDateRangePreset] = useState<'all' | 'today' | '7days' | '30days' | 'custom'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  // Filter logic
  const filteredEnquiries = enquiries.filter((enq) => {
    // Status Filter
    if (statusFilter !== 'All' && enq.status !== statusFilter) {
      return false;
    }

    // Plan Filter
    if (planFilter !== 'All') {
      const match = enq.interestedPlan.includes(planFilter) || enq.preferredChitValue.includes(planFilter);
      if (!match) return false;
    }

    // Date Range Filter
    const enqDate = new Date(enq.createdAt);
    const now = new Date();

    if (dateRangePreset === 'today') {
      const isToday =
        enqDate.getDate() === now.getDate() &&
        enqDate.getMonth() === now.getMonth() &&
        enqDate.getFullYear() === now.getFullYear();
      if (!isToday) return false;
    } else if (dateRangePreset === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (enqDate < sevenDaysAgo) return false;
    } else if (dateRangePreset === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (enqDate < thirtyDaysAgo) return false;
    } else if (dateRangePreset === 'custom') {
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (enqDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (enqDate > end) return false;
      }
    }

    return true;
  });

  const getSubtitle = (): string => {
    const parts = [];
    if (statusFilter !== 'All') parts.push(`Status: ${statusFilter}`);
    if (planFilter !== 'All') parts.push(`Plan: ${planFilter}`);
    if (dateRangePreset === 'today') parts.push('Date: Today');
    else if (dateRangePreset === '7days') parts.push('Date: Last 7 Days');
    else if (dateRangePreset === '30days') parts.push('Date: Last 30 Days');
    else if (dateRangePreset === 'custom' && (startDate || endDate)) {
      parts.push(`Date: ${startDate || 'Start'} to ${endDate || 'Now'}`);
    }
    return parts.length > 0 ? parts.join(' | ') : 'All Enquiries';
  };

  const handleExportExcel = async () => {
    if (filteredEnquiries.length === 0) {
      alert('No enquiries match the selected filters to export.');
      return;
    }
    setIsExporting(true);
    try {
      await exportEnquiriesToExcel(filteredEnquiries, getSubtitle());
      onExportSuccess(`Successfully exported ${filteredEnquiries.length} enquiries to Excel (.xlsx)`);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert('Failed to generate Excel file: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredEnquiries.length === 0) {
      alert('No enquiries match the selected filters to export.');
      return;
    }
    try {
      exportEnquiriesToCSV(filteredEnquiries, getSubtitle());
      onExportSuccess(`Successfully exported ${filteredEnquiries.length} enquiries to CSV`);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert('Failed to generate CSV file: ' + err.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150"
      id="admin-export-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-[#001226] border border-[#C5A028]/40 shadow-2xl p-5 sm:p-7 space-y-5 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        id="admin-export-modal-card"
      >
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C5A028] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#00264d] border border-[#C5A028]/40 flex items-center justify-center text-[#C5A028]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Cinzel'] text-lg font-bold text-white tracking-wide">
                Export Customer Enquiries
              </h3>
              <p className="text-xs text-slate-400">
                Generate formatted business reports with auto-filters & cell styling
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#001A33] text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            id="admin-export-close-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="space-y-4 text-xs">
          
          {/* Status Scope Filter */}
          <div>
            <div id="export-status-filter-label" className="block text-[11px] uppercase font-bold text-slate-300 tracking-wider mb-2">
              1. Status Filter:
            </div>
            <div role="group" aria-labelledby="export-status-filter-label" className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {['All', 'New', 'Contacted', 'Follow-up', 'Converted', 'Closed'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`py-1.5 px-2 rounded-lg text-center font-semibold text-[11px] transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#C5A028] text-[#001A33] font-bold shadow'
                      : 'bg-[#001A33] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Chit Plan Filter */}
          <div>
            <label htmlFor="export-plan-filter" className="block text-[11px] uppercase font-bold text-slate-300 tracking-wider mb-2">
              2. Chit Plan Value:
            </label>
            <select
              id="export-plan-filter"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#001A33] border border-slate-700 text-xs text-white focus:border-[#C5A028] outline-none cursor-pointer"
            >
              <option value="All">All Chit Plans (₹50,000 to ₹5,000,00)</option>
              <option value="₹50,000">₹50,000 Chit Plan</option>
              <option value="₹1,00,000">₹1,00,000 Chit Plan</option>
              <option value="₹2,00,000">₹2,00,000 Chit Plan</option>
              <option value="₹3,00,000">₹3,00,000 Chit Plan</option>
              <option value="₹4,00,000">₹4,00,000 Chit Plan</option>
              <option value="₹5,00,000">₹5,00,000 Chit Plan</option>
            </select>
          </div>

          {/* Date Range Presets */}
          <div>
            <div id="export-date-range-label" className="block text-[11px] uppercase font-bold text-slate-300 tracking-wider mb-2">
              3. Date Range:
            </div>
            <div role="group" aria-labelledby="export-date-range-label" className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-2.5">
              {[
                { id: 'all', label: 'All Time' },
                { id: 'today', label: 'Today' },
                { id: '7days', label: 'Last 7 Days' },
                { id: '30days', label: 'Last 30 Days' },
                { id: 'custom', label: 'Custom Range' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDateRangePreset(p.id as any)}
                  className={`py-1.5 px-2 rounded-lg text-center font-semibold text-[11px] transition-all cursor-pointer ${
                    dateRangePreset === p.id
                      ? 'bg-[#C5A028] text-[#001A33] font-bold shadow'
                      : 'bg-[#001A33] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom Date Range Pickers */}
            {dateRangePreset === 'custom' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#001A33] border border-slate-800">
                <div>
                  <label htmlFor="export-start-date" className="block text-[10px] uppercase font-bold text-slate-400 mb-1">From Date</label>
                  <input
                    id="export-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-[#001226] border border-slate-700 text-xs text-white outline-none focus:border-[#C5A028]"
                  />
                </div>
                <div>
                  <label htmlFor="export-end-date" className="block text-[10px] uppercase font-bold text-slate-400 mb-1">To Date</label>
                  <input
                    id="export-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-[#001226] border border-slate-700 text-xs text-white outline-none focus:border-[#C5A028]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Filter Summary Badge */}
        <div className="p-3 rounded-xl bg-[#001A33] border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Matching Records: <strong className="text-white text-sm">{filteredEnquiries.length}</strong> of{' '}
              {enquiries.length}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono italic">
            {getSubtitle()}
          </span>
        </div>

        {/* Excel Quality Features Note */}
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-slate-300 space-y-1">
          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A028]" />
            <span>Professional Formatting Included:</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            • Phone numbers stored strictly as text (no scientific notation like 8.25E+09)
            <br />
            • Clean Indian currency symbol (₹) • Frozen top header row • Auto-filter enabled • Clickable WhatsApp links
          </p>
        </div>

        {/* Download Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          
          {/* Primary Action: Excel .xlsx */}
          <button
            onClick={handleExportExcel}
            disabled={isExporting || filteredEnquiries.length === 0}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C5A028]/20 cursor-pointer disabled:opacity-50"
            id="download-excel-btn"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Styled Excel...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4" />
                <span>DOWNLOAD EXCEL (.XLSX)</span>
              </>
            )}
          </button>

          {/* Secondary Action: CSV */}
          <button
            onClick={handleExportCSV}
            disabled={isExporting || filteredEnquiries.length === 0}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#001A33] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            id="download-csv-btn"
            title="Download UTF-8 BOM CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>

      </div>
    </div>
  );
};
