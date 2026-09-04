import React, { useState } from 'react';
import { 
  Table, 
  Layers, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  Search, 
  Info, 
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  FileSpreadsheet
} from 'lucide-react';
import { 
  OFFICIAL_CHIT_CATALOG, 
  CHIT_CONTRIBUTION_OPTIONS, 
  CHIT_PLANS_SUMMARY 
} from '../data/chitPlansData';

interface ChitPlansSectionProps {
  onOpenEnquiry: (plan?: string) => void;
}

export const ChitPlansSection: React.FC<ChitPlansSectionProps> = ({ onOpenEnquiry }) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'catalog' | 'contributions'>('cards');
  const [selectedDenomination, setSelectedDenomination] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);

  const filteredCards = selectedDenomination === 'all'
    ? CHIT_PLANS_SUMMARY
    : CHIT_PLANS_SUMMARY.filter(plan => plan.value === selectedDenomination);

  const filteredCatalogRows = OFFICIAL_CHIT_CATALOG.filter(row => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      row.sNo.toString().includes(q) ||
      row.plan50k.toLowerCase().includes(q) ||
      row.plan100k.toLowerCase().includes(q) ||
      row.plan200k.toLowerCase().includes(q) ||
      row.plan300k.toLowerCase().includes(q) ||
      row.plan400k.toLowerCase().includes(q) ||
      row.plan500k.toLowerCase().includes(q)
    );
  });

  return (
    <section className="py-12 md:py-16 bg-[#001A33] relative border-t border-slate-800" id="chit-plans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#001226] border border-[#C5A028]/40 text-[#C5A028] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A028]" />
            Official Structure Catalog
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
            AVAILABLE CHIT PLANS
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Explore our complete range of structured chit fund options from ₹50,000 to ₹5,00,000. 
            All plans feature transparent 21-installment schedules and flexible contribution modes.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('cards')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'cards'
                ? 'bg-[#C5A028] text-[#001A33] shadow-md font-bold'
                : 'bg-[#001226] text-slate-300 hover:bg-[#00264d] hover:text-white border border-slate-800'
            }`}
            id="tab-interactive-cards"
          >
            <Layers className="w-4 h-4" />
            <span>Interactive Plan Cards</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#C5A028] text-[#001A33] shadow-md font-bold'
                : 'bg-[#001226] text-slate-300 hover:bg-[#00264d] hover:text-white border border-slate-800'
            }`}
            id="tab-official-catalog"
          >
            <Table className="w-4 h-4" />
            <span>Full 21-Row Official Table</span>
          </button>

          <button
            onClick={() => setActiveTab('contributions')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'contributions'
                ? 'bg-[#C5A028] text-[#001A33] shadow-md font-bold'
                : 'bg-[#001226] text-slate-300 hover:bg-[#00264d] hover:text-white border border-slate-800'
            }`}
            id="tab-contribution-options"
          >
            <Calendar className="w-4 h-4" />
            <span>Contribution Options (Daily / Weekly / Monthly)</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE PLAN CARDS */}
        {activeTab === 'cards' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pb-1">
              <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A028]" /> Filter Value:
              </span>
              {['all', '₹50,000', '₹1,00,000', '₹2,00,000', '₹3,00,000', '₹4,00,000', '₹5,00,000'].map((val) => (
                <button
                  key={val}
                  onClick={() => setSelectedDenomination(val)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    selectedDenomination === val
                      ? 'bg-[#C5A028] text-[#001A33] font-bold shadow-sm'
                      : 'bg-[#001226] text-slate-300 hover:bg-[#00264d] border border-slate-800'
                  }`}
                >
                  {val === 'all' ? 'All 6 Plans' : val}
                </button>
              ))}
            </div>

            {/* Grid of Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCards.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-lg bg-[#001226] border border-slate-800 hover:border-[#C5A028]/60 p-5 flex flex-col justify-between transition-all duration-200 hover:bg-[#001730] hover:shadow-lg group"
                  id={`plan-card-${plan.id}`}
                >
                  <div>
                    {/* Plan Top Header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-3.5">
                      <div>
                        <span className="text-[10px] font-bold text-[#C5A028] uppercase tracking-wider">
                          Chit Value
                        </span>
                        <h3 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-white group-hover:text-[#C5A028] transition-colors">
                          {plan.value}
                        </h3>
                      </div>
                      <div className="px-2.5 py-1 rounded bg-[#00264d] border border-[#C5A028]/40 text-[#C5A028] text-xs font-mono font-bold">
                        {plan.duration}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 italic mb-4 leading-relaxed min-h-[32px]">
                      "{plan.tagline}"
                    </p>

                    {/* Contribution Breakdown Grid */}
                    <div className="bg-[#001A33] rounded-md p-3 border border-slate-800 mb-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Monthly Contribution:</span>
                        <span className="font-bold text-white">{plan.monthlyContribution}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Weekly Option:</span>
                        <span className="font-semibold text-slate-200">{plan.weeklyContribution}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Daily Option:</span>
                        <span className="font-semibold text-slate-200">{plan.dailyContribution}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Catalog Progression:</span>
                        <span className="font-mono text-[#C5A028] font-bold">
                          {plan.minTakeHome} – {plan.maxTakeHome}
                        </span>
                      </div>
                    </div>

                    {/* Feature Bullets */}
                    <div className="space-y-1.5 mb-5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Key Highlights:
                      </div>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-[#C5A028] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enquire Button */}
                  <button
                    onClick={() => onOpenEnquiry(plan.value)}
                    className="w-full py-2.5 rounded-md bg-[#00264d] hover:bg-[#C5A028] text-slate-200 hover:text-[#001A33] border border-[#C5A028]/40 font-bold text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:border-[#C5A028]"
                    id={`enquire-btn-${plan.id}`}
                  >
                    <span>ENQUIRE ABOUT THIS PLAN</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Helper Note */}
            <div className="p-3.5 rounded-md bg-[#001226] border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#C5A028] shrink-0 mt-0.5" />
              <div>
                Looking for the full row-by-row installment schedule? Switch to the{' '}
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="text-[#C5A028] underline font-bold hover:text-white cursor-pointer"
                >
                  Full 21-Row Official Table
                </button>{' '}
                to examine exact take-home figures for every tier.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FULL 21-ROW PRIMARY CATALOG TABLE */}
        {activeTab === 'catalog' && (
          <div className="space-y-4 animate-in fade-in duration-200" id="official-catalog-table-view">
            
            {/* Table Control & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-md bg-[#001226] border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#C5A028]" />
                  Official 21-Tier Schedule
                </h3>
                <p className="text-xs text-slate-400">
                  Exact catalog records for S.NO 1 through 21 across all 6 chit values.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search value or row..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-[#001A33] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A028]"
                />
              </div>
            </div>

            {/* Responsive Table Container with High Density Gold Headers */}
            <div className="overflow-x-auto rounded-md border border-[#C5A028]/40 bg-[#001226] shadow-xl">
              <table className="w-full text-left border-collapse min-w-[700px] text-xs">
                <thead>
                  <tr className="bg-[#C5A028] text-[#001A33] border-b border-[#001A33]">
                    <th className="py-2.5 px-3 font-bold text-center w-16 uppercase tracking-wider sticky left-0 bg-[#C5A028] z-10">
                      S.NO
                    </th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">
                      ₹50,000
                    </th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">
                      ₹1,00,000
                    </th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">
                      ₹2,00,000
                    </th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">
                      ₹3,00,000
                    </th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">
                      ₹4,00,000
                    </th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">
                      ₹5,00,000
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredCatalogRows.map((row) => {
                    const isFirstRow = row.sNo === 1;
                    const isHighlighted = highlightedRow === row.sNo;

                    return (
                      <tr
                        key={row.sNo}
                        onMouseEnter={() => setHighlightedRow(row.sNo)}
                        onMouseLeave={() => setHighlightedRow(null)}
                        className={`transition-colors ${
                          isFirstRow
                            ? 'bg-[#00264d] font-bold text-[#C5A028]'
                            : isHighlighted
                            ? 'bg-[#00264d] text-white'
                            : row.sNo % 2 === 0
                            ? 'bg-[#001226]'
                            : 'bg-[#001A33]'
                        }`}
                      >
                        <td className="py-2 px-3 font-mono font-bold text-center text-slate-300 sticky left-0 bg-inherit border-r border-slate-800">
                          {row.sNo}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-200">
                          {row.plan50k}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-200">
                          {row.plan100k}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-200">
                          {row.plan200k}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-200">
                          {row.plan300k}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-200">
                          {row.plan400k}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-200">
                          {row.plan500k}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Catalog Disclaimer */}
            <div className="p-3.5 rounded-md bg-[#000d1a] border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#C5A028] shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-200">Important Note:</strong> Exact data from official catalog. Row 1 represents the initial company contribution/start cycle as per chit fund procedures. S.NO 2 through 21 illustrate the progression tiers. Subject to the subscriber agreement and auction terms.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: SECONDARY PAYMENT TABLE (CHIT CONTRIBUTION OPTIONS - EXACTLY 5 ROWS) */}
        {activeTab === 'contributions' && (
          <div className="space-y-4 animate-in fade-in duration-200" id="secondary-contribution-table-view">
            
            <div className="p-5 rounded-lg bg-[#001226] border border-[#C5A028]/40 shadow-xl">
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider text-[#C5A028] font-bold mb-1">
                  Flexible Payment Schedules
                </div>
                <h3 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-white">
                  CHIT CONTRIBUTION OPTIONS
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Choose the contribution frequency that matches your cash flow — Monthly, Weekly, or Daily across 21 installments.
                </p>
              </div>

              {/* Exact 5-Row Secondary Table with High Density Gold Headers */}
              <div className="overflow-x-auto rounded-md border border-slate-800">
                <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[540px]">
                  <thead>
                    <tr className="bg-[#C5A028] text-[#001A33] font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3 font-bold text-center w-16">S.NO</th>
                      <th className="py-2.5 px-3 font-bold">CHIT VALUE</th>
                      <th className="py-2.5 px-3 font-bold">MONTHLY</th>
                      <th className="py-2.5 px-3 font-bold">WEEKLY</th>
                      <th className="py-2.5 px-3 font-bold">DAILY</th>
                      <th className="py-2.5 px-3 font-bold text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {CHIT_CONTRIBUTION_OPTIONS.map((opt, idx) => (
                      <tr 
                        key={opt.sNo} 
                        className={`transition-colors hover:bg-[#00264d] ${idx % 2 === 0 ? 'bg-[#001226]' : 'bg-[#001A33]'}`}
                      >
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-300">
                          {opt.sNo}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white text-xs sm:text-sm">
                          {opt.chitValue}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-[#C5A028] font-mono">
                          {opt.monthly}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-200 font-mono">
                          {opt.weekly}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-200 font-mono">
                          {opt.daily}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onOpenEnquiry(opt.chitValue)}
                            className="px-3 py-1 rounded-md bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] font-bold text-xs uppercase transition-all cursor-pointer shadow-sm"
                          >
                            Enquire
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Note on 5 plans */}
              <div className="mt-3 text-xs text-slate-400 italic">
                * Note: 21 installments schedule. Contact our Mettupalayam office for custom arrangements or higher ticket denominations.
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
