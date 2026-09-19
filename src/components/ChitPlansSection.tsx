import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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

  const renderCellValue = (val: string) => {
    return val === 'Company' ? t('plans.company') : val;
  };

  return (
    <section className="py-12 md:py-16 bg-[#FDFBF7] relative border-t border-amber-200/80" id="chit-plans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-amber-200/80 shadow-xs text-[#001A33] text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A028]" />
            {t('plans.badge')}
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#001A33] tracking-tight mb-3">
            {t('plans.title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
            {t('plans.subtitle')}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          <button
            onClick={() => setActiveTab('cards')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm sm:text-base font-semibold transition-all cursor-pointer ${
              activeTab === 'cards'
                ? 'bg-[#001A33] text-white shadow-md font-bold'
                : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-sm'
            }`}
            id="tab-interactive-cards"
          >
            <Layers className="w-4 h-4 text-[#C5A028]" />
            <span>{t('plans.tabCards')}</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm sm:text-base font-semibold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#001A33] text-white shadow-md font-bold'
                : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-sm'
            }`}
            id="tab-official-catalog"
          >
            <Table className="w-4 h-4 text-[#C5A028]" />
            <span>{t('plans.tabCatalog')}</span>
          </button>

          <button
            onClick={() => setActiveTab('contributions')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm sm:text-base font-semibold transition-all cursor-pointer ${
              activeTab === 'contributions'
                ? 'bg-[#001A33] text-white shadow-md font-bold'
                : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-sm'
            }`}
            id="tab-contribution-options"
          >
            <Calendar className="w-4 h-4 text-[#C5A028]" />
            <span>{t('plans.tabContributions')}</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE PLAN CARDS */}
        {activeTab === 'cards' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pb-1">
              <span className="text-xs text-slate-500 font-semibold mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A028]" /> {t('plans.filterLabel')}
              </span>
              {['all', '₹50,000', '₹1,00,000', '₹2,00,000', '₹3,00,000', '₹4,00,000', '₹5,00,000'].map((val) => (
                <button
                  key={val}
                  onClick={() => setSelectedDenomination(val)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    selectedDenomination === val
                      ? 'bg-[#001A33] text-[#C5A028] font-bold shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
                  }`}
                >
                  {val === 'all' ? t('plans.filterAll') : val}
                </button>
              ))}
            </div>

            {/* Grid of Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCards.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-xl bg-white border border-amber-200/80 hover:border-[#C5A028] p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg shadow-xs group"
                  id={`plan-card-${plan.id}`}
                >
                  <div>
                    {/* Plan Top Header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 mb-3.5">
                      <div>
                        <span className="text-xs font-bold text-[#C5A028] uppercase tracking-wider">
                          {t('plans.totalChitValue')}
                        </span>
                        <h3 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-[#001A33] group-hover:text-[#C5A028] transition-colors">
                          {plan.value}
                        </h3>
                      </div>
                      <div className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-[#001A33] text-xs sm:text-sm font-mono font-bold">
                        {plan.duration}
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 italic mb-4 leading-relaxed min-h-[32px]">
                      "{plan.tagline}"
                    </p>

                    {/* Contribution Breakdown Grid */}
                    <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 mb-4 space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{t('plans.monthlyContribution')}</span>
                        <span className="font-bold text-slate-900">{plan.monthlyContribution}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{t('plans.weeklyOption')}</span>
                        <span className="font-semibold text-slate-700">{plan.weeklyContribution}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{t('plans.dailyOption')}</span>
                        <span className="font-semibold text-slate-700">{plan.dailyContribution}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-slate-500 font-medium">{t('plans.takeHomeProgression')}</span>
                        <span className="font-mono text-[#001A33] font-bold">
                          {plan.minTakeHome} – {plan.maxTakeHome}
                        </span>
                      </div>
                    </div>

                    {/* Feature Bullets */}
                    <div className="space-y-1.5 mb-5">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        {t('plans.featuresTitle')}
                      </div>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-[#C5A028] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enquire Button */}
                  <button
                    onClick={() => onOpenEnquiry(plan.value)}
                    className="w-full py-3 rounded-md bg-[#001A33] hover:bg-[#C5A028] text-white hover:text-[#001A33] border border-[#001A33] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:border-[#C5A028]"
                    id={`enquire-btn-${plan.id}`}
                  >
                    <span>{t('plans.enquireAboutPlan')}</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A028] group-hover:text-[#001A33]" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Helper Note */}
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm text-xs sm:text-sm text-slate-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#C5A028] shrink-0 mt-0.5" />
              <div>
                {t('plans.helperNotePrefix')}
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="text-[#001A33] underline font-bold hover:text-[#C5A028] cursor-pointer"
                >
                  {t('plans.tabCatalog')}
                </button>
                {t('plans.helperNoteSuffix')}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FULL 21-ROW PRIMARY CATALOG TABLE */}
        {activeTab === 'catalog' && (
          <div className="space-y-4 animate-in fade-in duration-200" id="official-catalog-table-view">
            
            {/* Table Control & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#001A33] flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#C5A028]" />
                  {t('plans.officialScheduleTitle')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('plans.officialScheduleSubtitle')}
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <label htmlFor="catalog-search-input" className="sr-only">
                  {t('plans.searchPlaceholder')}
                </label>
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="catalog-search-input"
                  type="text"
                  placeholder={t('plans.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C5A028] focus:bg-white"
                />
              </div>
            </div>

            {/* Responsive Table Container with High Density Deep Blue Headers */}
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px] text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#001A33] text-white border-b border-slate-300">
                    <th className="py-2.5 px-3 font-bold text-center w-16 uppercase tracking-wider sticky left-0 bg-[#001A33] z-10 text-[#C5A028]">
                      {t('plans.tableColSNo')}
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
                <tbody className="divide-y divide-slate-200">
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
                            ? 'bg-amber-50 font-bold text-[#001A33]'
                            : isHighlighted
                            ? 'bg-slate-100 text-slate-900'
                            : row.sNo % 2 === 0
                            ? 'bg-slate-50/60 text-slate-800'
                            : 'bg-white text-slate-800'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-center text-[#001A33] sticky left-0 bg-inherit border-r border-slate-200">
                          {row.sNo}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                          {renderCellValue(row.plan50k)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                          {renderCellValue(row.plan100k)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                          {renderCellValue(row.plan200k)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                          {renderCellValue(row.plan300k)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                          {renderCellValue(row.plan400k)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                          {renderCellValue(row.plan500k)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Catalog Disclaimer */}
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm text-xs text-slate-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#C5A028] shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-900 font-bold">{t('plans.disclaimerImportant')}</strong> {t('plans.disclaimerText')}
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: SECONDARY PAYMENT TABLE (CHIT CONTRIBUTION OPTIONS - EXACTLY 5 ROWS) */}
        {activeTab === 'contributions' && (
          <div className="space-y-4 animate-in fade-in duration-200" id="secondary-contribution-table-view">
            
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider text-[#C5A028] font-bold mb-1">
                  {t('plans.flexibleSchedules')}
                </div>
                <h3 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-[#001A33]">
                  {t('plans.contributionsTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {t('plans.contributionsSubtitle')}
                </p>
              </div>

              {/* Exact 5-Row Secondary Table with Deep Blue Headers */}
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[540px]">
                  <thead>
                    <tr className="bg-[#001A33] text-white font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3 font-bold text-center w-16 text-[#C5A028]">{t('plans.tableColSNo')}</th>
                      <th className="py-2.5 px-3 font-bold">{t('plans.totalChitValue')}</th>
                      <th className="py-2.5 px-3 font-bold">{t('plans.monthlyCol')}</th>
                      <th className="py-2.5 px-3 font-bold">{t('plans.weeklyCol')}</th>
                      <th className="py-2.5 px-3 font-bold">{t('plans.dailyCol')}</th>
                      <th className="py-2.5 px-3 font-bold text-right">{t('plans.actionCol')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {CHIT_CONTRIBUTION_OPTIONS.map((opt, idx) => (
                      <tr 
                        key={opt.sNo} 
                        className={`transition-colors hover:bg-slate-100 ${idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}`}
                      >
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-[#001A33]">
                          {opt.sNo}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 text-xs sm:text-sm">
                          {opt.chitValue}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-[#001A33] font-mono">
                          {opt.monthly}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-700 font-mono">
                          {opt.weekly}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-700 font-mono">
                          {opt.daily}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onOpenEnquiry(opt.chitValue)}
                            className="px-3 py-1.5 rounded-md bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] font-bold text-xs uppercase transition-all cursor-pointer shadow-sm"
                          >
                            {t('plans.enquireNow')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Note on 5 plans */}
              <div className="mt-3 text-xs text-slate-500 italic">
                {t('plans.flexibleNote')}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
