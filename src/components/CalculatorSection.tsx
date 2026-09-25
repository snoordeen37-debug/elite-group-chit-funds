import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, ArrowRight, ShieldAlert, Sparkles, TrendingUp, Calendar, CheckCircle2, PhoneCall, Loader2, MessageCircle, ExternalLink, Zap } from 'lucide-react';
import { 
  OFFICIAL_CHIT_CATALOG, 
  CHIT_CONTRIBUTION_OPTIONS, 
  CHIT_PLANS_SUMMARY,
  CHIT_10_MONTH_PLANS,
  OFFICIAL_10_MONTH_TIER_CATALOG
} from '../data/chitPlansData';
import { submitEnquiry, DirectWhatsAppUrls } from '../services/enquiryService';

interface CalculatorSectionProps {
  onOpenEnquiry: (plan?: string) => void;
}

const DENOMINATIONS_21 = ['₹50,000', '₹1,00,000', '₹2,00,000', '₹3,00,000', '₹4,00,000', '₹5,00,000'];
const DENOMINATIONS_10 = ['₹10,000', '₹20,000', '₹30,000', '₹50,000', '₹1,00,000', '₹2,00,000'];

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({ onOpenEnquiry }) => {
  const { t } = useTranslation();
  const [selectedDuration, setSelectedDuration] = useState<'21' | '10'>('21');
  const [selectedPlanValue, setSelectedPlanValue] = useState<string>('₹1,00,000');

  // Quick Callback Form State
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [isSubmittingCallback, setIsSubmittingCallback] = useState(false);
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [callbackDirectUrls, setCallbackDirectUrls] = useState<DirectWhatsAppUrls | null>(null);

  const handleDurationChange = (dur: '21' | '10') => {
    setSelectedDuration(dur);
    if (dur === '10') {
      const exists = DENOMINATIONS_10.includes(selectedPlanValue);
      if (!exists) {
        setSelectedPlanValue('₹50,000');
      }
    } else {
      const exists = DENOMINATIONS_21.includes(selectedPlanValue);
      if (!exists) {
        setSelectedPlanValue('₹1,00,000');
      }
    }
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackError(null);

    const cleanName = callbackName.trim();
    const cleanPhone = callbackPhone.replace(/\D/g, '');

    if (!cleanName) {
      setCallbackError(t('calculator.nameError', 'Please enter your full name.'));
      return;
    }
    if (cleanPhone.length !== 10) {
      setCallbackError(t('calculator.phoneError', 'Please enter a valid 10-digit mobile number.'));
      return;
    }

    const planLabel = selectedDuration === '10'
      ? `${selectedPlanValue} (10-Month Plan)`
      : `${selectedPlanValue} Chit Plan`;

    setIsSubmittingCallback(true);
    try {
      const res = await submitEnquiry({
        fullName: cleanName,
        mobileNumber: cleanPhone,
        interestedPlan: planLabel,
        preferredChitValue: selectedPlanValue,
        preferredContactMethod: 'Phone',
        message: `Quick callback & plan details requested from Chit Calculator for ${planLabel}.`,
      });

      if (res.success || res.directWhatsAppUrls) {
        setCallbackSuccess(true);
        if (res.directWhatsAppUrls) {
          setCallbackDirectUrls(res.directWhatsAppUrls);
        }
      } else {
        setCallbackError(res.error || t('calculator.submitError', 'Failed to submit callback request. Please try again.'));
      }
    } catch (err: any) {
      setCallbackError(err.message || t('calculator.submitError', 'Error submitting request. Please try again.'));
    } finally {
      setIsSubmittingCallback(false);
    }
  };

  const handleResetCallback = () => {
    setCallbackSuccess(false);
    setCallbackName('');
    setCallbackPhone('');
    setCallbackDirectUrls(null);
    setCallbackError(null);
  };

  // 21-Month Lookups
  const currentPlan = CHIT_PLANS_SUMMARY.find(p => p.value === selectedPlanValue) || CHIT_PLANS_SUMMARY[1];
  const contributionInfo = CHIT_CONTRIBUTION_OPTIONS.find(c => c.chitValue === selectedPlanValue);

  // 10-Month Lookup
  const current10mPlan = CHIT_10_MONTH_PLANS.find(p => p.totalPlan === selectedPlanValue) || CHIT_10_MONTH_PLANS[3];

  // Column key in official catalog
  const getCatalogColumnKey = (val: string): keyof typeof OFFICIAL_CHIT_CATALOG[0] => {
    switch (val) {
      case '₹50,000': return 'plan50k';
      case '₹1,00,000': return 'plan100k';
      case '₹2,00,000': return 'plan200k';
      case '₹3,00,000': return 'plan300k';
      case '₹4,00,000': return 'plan400k';
      case '₹5,00,000': return 'plan500k';
      default: return 'plan100k';
    }
  };

  const get10mCatalogColumnKey = (val: string): 'plan10k' | 'plan20k' | 'plan30k' | 'plan50k' | 'plan100k' | 'plan200k' => {
    switch (val) {
      case '₹10,000': return 'plan10k';
      case '₹20,000': return 'plan20k';
      case '₹30,000': return 'plan30k';
      case '₹50,000': return 'plan50k';
      case '₹1,00,000': return 'plan100k';
      case '₹2,00,000': return 'plan200k';
      default: return 'plan50k';
    }
  };

  const colKey = getCatalogColumnKey(selectedPlanValue);

  // Extract catalog sample progression milestones: Row 2 (Min auction), Row 11 (Mid-tier), Row 21 (Final tier)
  const minTierVal = OFFICIAL_CHIT_CATALOG[1][colKey]; // Row 2
  const midTierVal = OFFICIAL_CHIT_CATALOG[10][colKey]; // Row 11
  const maxTierVal = OFFICIAL_CHIT_CATALOG[20][colKey]; // Row 21

  // Extract 10-month catalog tier milestones: Row 2 (Month 2), Row 6 (Month 6), Row 10 (Month 10 final payout)
  const colKey10m = get10mCatalogColumnKey(selectedPlanValue);
  const minTier10m = OFFICIAL_10_MONTH_TIER_CATALOG[1][colKey10m]; // Row 2 (Month 2)
  const midTier10m = OFFICIAL_10_MONTH_TIER_CATALOG[5][colKey10m]; // Row 6 (Month 6)
  const maxTier10m = OFFICIAL_10_MONTH_TIER_CATALOG[9][colKey10m]; // Row 10 (Month 10 Final)

  const activeDenominations = selectedDuration === '10' ? DENOMINATIONS_10 : DENOMINATIONS_21;

  return (
    <section className="py-12 md:py-16 bg-[#FBF8F1] relative border-t border-amber-200/80" id="calculator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#001A33]/5 border border-[#001A33]/15 text-[#001A33] text-xs font-bold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5 text-[#C5A028]" />
            {t('calculator.heroBadge', 'Monthly Dividend Calculation & Official Schedule')}
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-[#001A33] tracking-tight mb-2.5">
            {t('calculator.heroTitle', 'CHIT PLAN CALCULATOR & MONTHLY DIVIDEND ESTIMATOR')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
            {t('calculator.heroSubtitle', 'Calculate your monthly chit savings scheme returns for ₹50,000 to ₹5,00,000 chit plans in Tamil Nadu. Review official 21-month structured chit schemes & 10-month plans compliant with the Chit Funds Act 1982 by SS Chit Funds Pvt Ltd Mettupalayam.')}
          </p>
        </div>

        {/* Interactive Calculator Box */}
        <div className="max-w-4xl mx-auto rounded-xl bg-white border border-amber-200/80 p-5 sm:p-7 shadow-lg">
          
          {/* Step 1: Select Duration */}
          <div className="mb-6 pb-5 border-b border-amber-200/80">
            <div id="calc-duration-label" className="block text-xs sm:text-sm uppercase tracking-wider font-bold text-slate-900 mb-2.5">
              {t('calculator.selectDurationScheme', '1. Select Chit Duration / Scheme:')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-labelledby="calc-duration-label">
              <button
                type="button"
                onClick={() => handleDurationChange('21')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedDuration === '21'
                    ? 'bg-[#001A33] border-[#C5A028] text-white shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
                id="calc-duration-21"
              >
                <div>
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    <Calendar className={`w-4 h-4 ${selectedDuration === '21' ? 'text-[#C5A028]' : 'text-slate-500'}`} />
                    <span>{t('calculator.standardScheme21', '21-Month Standard Scheme')}</span>
                  </div>
                  <div className={`text-xs mt-0.5 ${selectedDuration === '21' ? 'text-slate-300' : 'text-slate-500'}`}>
                    {t('calculator.standardScheme21Desc', 'Auction progression, monthly dividend savings (₹50k - ₹5L)')}
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
                  selectedDuration === '21' ? 'border-[#C5A028] bg-[#C5A028]' : 'border-slate-300'
                }`} />
              </button>

              <button
                type="button"
                onClick={() => handleDurationChange('10')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedDuration === '10'
                    ? 'bg-[#001A33] border-[#C5A028] text-white shadow-md'
                    : 'bg-amber-50/50 border-amber-300 hover:bg-amber-100/60 text-slate-700'
                }`}
                id="calc-duration-10"
              >
                <div>
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    <Zap className={`w-4 h-4 ${selectedDuration === '10' ? 'text-[#C5A028]' : 'text-amber-600'}`} />
                    <span>{t('calculator.tenMonthDuration', '10-Month Rapid Scheme')}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#C5A028] text-[#001A33] text-[10px] font-black uppercase tracking-wider">
                      {t('plans.tenMonth.newBadge', 'NEW')}
                    </span>
                  </div>
                  <div className={`text-xs mt-0.5 ${selectedDuration === '10' ? 'text-slate-300' : 'text-slate-500'}`}>
                    {t('calculator.tenMonthSubtitle', 'Daily (25d), weekly & monthly micro-savings (₹10k - ₹2L)')}
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
                  selectedDuration === '10' ? 'border-[#C5A028] bg-[#C5A028]' : 'border-slate-300'
                }`} />
              </button>
            </div>
          </div>

          {/* Step 2: Select Denomination */}
          <div className="mb-6">
            <div id="calc-denomination-label" className="block text-xs sm:text-sm uppercase tracking-wider font-bold text-slate-900 mb-2.5">
              {selectedDuration === '10'
                ? t('calculator.chooseDenomination10', '2. Choose Chit Denomination (10-Month Plans):')
                : t('calculator.chooseDenomination21', '2. Choose Chit Denomination (21-Month Plans):')}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5" role="group" aria-labelledby="calc-denomination-label">
              {activeDenominations.map((val) => {
                const isSelected = selectedPlanValue === val;
                return (
                  <button
                    key={val}
                    onClick={() => setSelectedPlanValue(val)}
                    className={`py-3 px-2 rounded-lg text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#001A33] text-[#C5A028] font-black shadow-md border-2 border-[#C5A028]'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 font-bold'
                    }`}
                    id={`calc-select-${val.replace(/[^0-9]/g, '')}`}
                  >
                    <div className="text-sm font-bold">{val}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Data Display Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            
            {/* Box 1: Installment & Frequency */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('calculator.contributionCycle', 'Contribution Cycle')}
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {selectedDuration === '10' 
                    ? t('calculator.monthsCount10', '10 Months')
                    : t('calculator.installmentsCount21', '21 Installments')}
                </div>
                {selectedDuration === '10' && (
                  <div className="text-xs text-amber-700 font-semibold mt-0.5">
                    {t('calculator.cycle25Days', '25 Days / Month Cycle')}
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-slate-600">
                  <span>{t('calculator.monthly', 'Monthly:')}</span>
                  <span className="font-bold text-[#001A33] font-sans tabular-nums">
                    {selectedDuration === '10'
                      ? current10mPlan.monthly
                      : (contributionInfo ? contributionInfo.monthly : currentPlan.monthlyContribution)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>{t('calculator.weekly', 'Weekly:')}</span>
                  <span className="font-sans tabular-nums text-slate-900 font-bold">
                    {selectedDuration === '10'
                      ? current10mPlan.weekly
                      : (contributionInfo ? contributionInfo.weekly : t('calculator.flexible', 'Flexible'))}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>{t('calculator.daily', 'Daily:')}</span>
                  <span className="font-sans tabular-nums text-amber-900 font-bold">
                    {selectedDuration === '10'
                      ? `${current10mPlan.daily} (25d)`
                      : (contributionInfo ? contributionInfo.daily : t('calculator.flexible', 'Flexible'))}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2: Catalog Take-Home or Short-Term Liquidity */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-sm">
              {selectedDuration === '21' ? (
                <>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {t('calculator.catalogTakeHomeRange', 'Catalog Take-Home Range')}
                    </span>
                    <div className="text-lg sm:text-xl font-black text-[#001A33] mt-1 font-sans tabular-nums">
                      {currentPlan.minTakeHome} – {currentPlan.maxTakeHome}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 text-xs sm:text-sm text-slate-600 space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{t('calculator.row2Starting', 'Row 2 (Starting tier):')}</span>
                      <span className="font-sans tabular-nums text-slate-900 font-bold">{minTierVal}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('calculator.row11Mid', 'Row 11 (Mid-cycle):')}</span>
                      <span className="font-sans tabular-nums text-slate-900 font-bold">{midTierVal}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('calculator.row21Final', 'Row 21 (Final tier):')}</span>
                      <span className="font-sans tabular-nums text-[#b48616] font-black">{maxTierVal}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {t('calculator.tenMonthTakeHome', 'Official Tier Payout Range')}
                    </span>
                    <div className="text-lg sm:text-xl font-black text-[#001A33] mt-1 font-sans tabular-nums">
                      ₹{minTier10m} – ₹{maxTier10m}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 text-xs sm:text-sm text-slate-600 space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{t('plans.tenMonth.month1Company', 'Month 1: Company Chit')}</span>
                      <span className="font-sans tabular-nums text-slate-500 font-bold">{t('plans.company', 'Company')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('calculator.startingMonth2', 'Month 2 (Starting):')}</span>
                      <span className="font-sans tabular-nums text-slate-900 font-bold">₹{minTier10m}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('calculator.midCycleMonth6', 'Month 6 (Mid-cycle):')}</span>
                      <span className="font-sans tabular-nums text-slate-900 font-bold">₹{midTier10m}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('calculator.finalMonth10', 'Month 10 (Final Bonus):')}</span>
                      <span className="font-sans tabular-nums text-[#b48616] font-black">₹{maxTier10m}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Box 3: Action & Group Status */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('calculator.selectedPlan', 'Selected Plan')}
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-sans tabular-nums">
                  {selectedPlanValue} {selectedDuration === '10' ? '(10M)' : 'Chit'}
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => onOpenEnquiry(
                    selectedDuration === '10'
                      ? `${selectedPlanValue} (10-Month Plan)`
                      : selectedPlanValue
                  )}
                  className="w-full py-3 rounded-lg bg-[#C5A028] hover:bg-[#b59020] text-[#001A33] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                  id="calc-enquire-btn"
                >
                  <span>
                    {selectedDuration === '10'
                      ? t('calculator.enquireTenMonth', 'Enquire 10-Month Plan')
                      : t('calculator.enquireThisPlan', 'Enquire This Plan')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Sample Breakdown Visual Strip */}
          {selectedDuration === '21' ? (
            <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#C5A028]" />
                  {t('calculator.progressionSampleTitle', { val: selectedPlanValue, defaultValue: `Official Progression Sample for ${selectedPlanValue}` })}
                </span>
                <span className="text-xs text-[#b48616] font-bold font-sans tabular-nums">S.NO 2 → 21</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <div className="text-slate-500 text-xs font-medium">{t('calculator.tierSNo', 'Tier S.NO')} 2</div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 font-sans tabular-nums mt-0.5">{OFFICIAL_CHIT_CATALOG[1][colKey]}</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <div className="text-slate-500 text-xs font-medium">{t('calculator.tierSNo', 'Tier S.NO')} 7</div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 font-sans tabular-nums mt-0.5">{OFFICIAL_CHIT_CATALOG[6][colKey]}</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <div className="text-slate-500 text-xs font-medium">{t('calculator.tierSNo', 'Tier S.NO')} 13</div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 font-sans tabular-nums mt-0.5">{OFFICIAL_CHIT_CATALOG[12][colKey]}</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <div className="text-slate-500 text-xs font-medium">{t('calculator.tierSNo', 'Tier S.NO')} 21</div>
                  <div className="text-sm sm:text-base font-bold text-[#b48616] font-sans tabular-nums mt-0.5">{OFFICIAL_CHIT_CATALOG[20][colKey]}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50/40 p-4 sm:p-5 rounded-xl border border-amber-200 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#C5A028]" />
                  {t('calculator.tenMonthProgression', { val: selectedPlanValue, defaultValue: `10-Month Tier Progression for ${selectedPlanValue} Scheme` })}
                </span>
                <a
                  href="#table-10-month-breakdown"
                  className="text-xs text-[#b48616] hover:text-[#8c670d] font-bold underline flex items-center gap-1 shrink-0"
                >
                  <span>{t('calculator.viewFullTenMonthSchedule', 'View Full Month-by-Month Schedule')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Official Payout Progression Milestones */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs mb-3">
                <div className="p-3 rounded-lg bg-white border border-amber-200/80 shadow-xs">
                  <div className="text-slate-500 text-xs font-medium">{t('calculator.startingMonth2', 'Month 2 (Starting):')}</div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 font-sans tabular-nums mt-0.5">₹{minTier10m}</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-amber-200/80 shadow-xs">
                  <div className="text-slate-500 text-xs font-medium">{t('plans.tenMonth.midTierMonth5', 'Month 5 (Mid-tier)')}</div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 font-sans tabular-nums mt-0.5">₹{OFFICIAL_10_MONTH_TIER_CATALOG[4][colKey10m]}</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-amber-200/80 shadow-xs">
                  <div className="text-slate-500 text-xs font-medium">{t('plans.tenMonth.lateTierMonth8', 'Month 8 (Late tier)')}</div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 font-sans tabular-nums mt-0.5">₹{OFFICIAL_10_MONTH_TIER_CATALOG[7][colKey10m]}</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-amber-200/80 shadow-xs">
                  <div className="text-slate-500 text-xs font-medium">{t('calculator.finalMonth10', 'Month 10 (Final Bonus):')}</div>
                  <div className="text-sm sm:text-base font-bold text-[#b48616] font-sans tabular-nums mt-0.5">₹{maxTier10m}</div>
                </div>
              </div>

              {/* Deposit Frequency Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-amber-200/60 text-[11px] sm:text-xs text-slate-600">
                <span>{t('plans.tenMonth.daily', 'Daily')} (25d): <strong className="text-amber-900 font-sans tabular-nums font-bold">{current10mPlan.daily}</strong></span>
                <span>{t('plans.tenMonth.weekly', 'Weekly')}: <strong className="text-slate-900 font-sans tabular-nums font-bold">{current10mPlan.weekly}</strong></span>
                <span>{t('plans.tenMonth.monthly', 'Monthly')}: <strong className="text-[#001A33] font-sans tabular-nums font-bold">{current10mPlan.monthly}</strong></span>
                <span>{t('calculator.selectedPlan', 'Selected Plan')}: <strong className="text-[#b48616] font-sans tabular-nums font-black">{current10mPlan.totalPlan}</strong></span>
              </div>
            </div>
          )}

          {/* MANDATORY PROMINENT DISCLAIMER */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-amber-900 block mb-0.5 font-bold">
                {t('calculator.disclaimerTitle', 'Official Disclaimer:')}
              </strong>
              {t('calculator.disclaimerText', '“Illustrative information only. Actual contributions, auction terms, discounts, payout amounts and other conditions are subject to the applicable chit agreement and company terms.”')}
            </div>
          </div>

          {/* ========================================================= */}
          {/* Quick 'Request Callback / Get Plan Details' Lead Form     */}
          {/* ========================================================= */}
          <div
            className="mt-8 rounded-2xl bg-gradient-to-br from-white via-amber-50/40 to-white border-2 border-[#C5A028]/40 p-5 sm:p-8 shadow-xl shadow-amber-950/5 relative overflow-hidden"
            id="calculator-quick-callback"
          >
            {/* Top decorative accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C5A028] via-[#e0b83e] to-[#C5A028]"></div>

            {!callbackSuccess ? (
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-amber-200/70 mb-5">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A028]/15 text-[#001A33] text-xs font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A028]" />
                      <span>{t('calculator.callbackBadge', 'Instant Callback & Official Schedule')}</span>
                    </div>
                    <h3 className="font-['Cinzel'] text-xl sm:text-2xl font-black text-[#001A33] tracking-tight">
                      {t('calculator.callbackTitle', 'Request Callback / Get Full Plan Details')}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
                      {selectedDuration === '10'
                        ? t('calculator.callbackSubtext10m', { plan: `${selectedPlanValue} (10-Month Plan)`, defaultValue: `Enter your name and mobile number to receive the complete 10-month rapid savings schedule, daily deposit breakdown, and priority slot booking for the ${selectedPlanValue} (10-Month Plan).` })
                        : t('calculator.callbackSubtext', { plan: `${selectedPlanValue} Chit Plan`, defaultValue: `Enter your name and mobile number to receive the complete 21-installment auction progression, dividend calculations, and priority slot booking for the ${selectedPlanValue} Chit Plan.` })}
                    </p>
                  </div>

                  {/* Plan Badge */}
                  <div className="shrink-0 p-3 sm:p-4 rounded-xl bg-white border border-amber-200 shadow-sm text-center md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      {t('calculator.selectedScheme', 'Selected Scheme')}
                    </span>
                    <span className="text-lg sm:text-xl font-black text-[#001A33] font-sans tabular-nums">{selectedPlanValue}</span>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                      {selectedDuration === '10' 
                        ? t('calculator.cycle10Short', '10-Month Cycle (25d)') 
                        : t('calculator.cycle21Short', '21-Month Cycle')}
                    </span>
                  </div>
                </div>

                {callbackError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{callbackError}</span>
                  </div>
                )}

                <form onSubmit={handleCallbackSubmit} className="space-y-4" id="calc-callback-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 items-end">
                    
                    {/* Full Name Field */}
                    <div>
                      <label htmlFor="calc-callback-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        {t('calculator.fullNameLabel', 'Full Name')} <span className="text-[#b48616]">*</span>
                      </label>
                      <input
                        id="calc-callback-name"
                        type="text"
                        required
                        placeholder={t('calculator.fullNamePlaceholder', 'e.g. Ramesh Kumar')}
                        value={callbackName}
                        onChange={(e) => setCallbackName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C5A028] focus:ring-1 focus:ring-[#C5A028] text-sm transition-colors shadow-xs"
                      />
                    </div>

                    {/* Mobile Number Field */}
                    <div>
                      <label htmlFor="calc-callback-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        {t('calculator.mobileNumberLabel', 'Mobile Number (WhatsApp)')} <span className="text-[#b48616]">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold font-sans tabular-nums">
                          +91
                        </span>
                        <input
                          id="calc-callback-phone"
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="98765 43210"
                          value={callbackPhone}
                          onChange={(e) => setCallbackPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="w-full pl-12 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C5A028] focus:ring-1 focus:ring-[#C5A028] text-sm transition-colors shadow-xs font-sans tabular-nums"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmittingCallback}
                        className="w-full py-2.5 px-4 rounded-lg bg-[#C5A028] hover:bg-[#b59020] text-[#001A33] font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[#C5A028]/20 cursor-pointer disabled:opacity-60 border border-[#e0b83e]"
                        id="calc-callback-submit-btn"
                      >
                        {isSubmittingCallback ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#001A33]" />
                            <span>{t('calculator.submitting', 'Submitting...')}</span>
                          </>
                        ) : (
                          <>
                            <PhoneCall className="w-4 h-4 text-[#001A33]" />
                            <span>{t('calculator.requestCallbackNow', 'Request Callback Now')}</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                  {/* Micro Trust Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] sm:text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {t('calculator.trustAdvisor', '15-minute callback by certified chit fund advisor')}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {t('calculator.trustPdf', 'Complete PDF schedule delivered to your WhatsApp')}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {t('calculator.trustFree', '100% Free Consultation • Zero Obligation')}
                    </span>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-4 text-center space-y-4 animate-in fade-in duration-200">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-slate-900">
                    {t('calculator.callbackReceivedTitle', 'Callback Request Received!')}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-1">
                    {t('calculator.callbackReceivedMsg', { 
                      name: callbackName, 
                      phone: callbackPhone, 
                      plan: selectedDuration === '10' ? `${selectedPlanValue} (10-Month Plan)` : `${selectedPlanValue} Chit Plan`,
                      defaultValue: `Thank you, ${callbackName}! Our representative will contact you on +91 ${callbackPhone} shortly regarding the ${selectedPlanValue} Chit Plan.`
                    })}
                  </p>
                </div>

                {/* 1-Click WhatsApp Instant Links */}
                {callbackDirectUrls && (
                  <div className="p-4 rounded-xl bg-white border border-emerald-200 max-w-md mx-auto space-y-2.5 shadow-sm text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>{t('calculator.instantConnectWhatsApp', 'Instant Connect via WhatsApp:')}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        href={callbackDirectUrls.line1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{t('calculator.chatLine1', 'Chat on Line 1')}</span>
                      </a>
                      <a
                        href={callbackDirectUrls.line2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{t('calculator.chatLine2', 'Chat on Line 2')}</span>
                      </a>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleResetCallback}
                  className="text-xs text-slate-500 hover:text-slate-900 underline font-semibold cursor-pointer"
                >
                  {t('calculator.submitAnotherCallback', 'Submit another callback request or change details')}
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
