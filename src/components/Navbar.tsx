import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, MapPin, ShieldCheck, ChevronRight, Lock, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BrandLogo, BRAND_NAME } from './BrandLogo';
import { COMPANY_DETAILS } from '../data/chitPlansData';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenEnquiry: (plan?: string) => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenEnquiry,
  onOpenAdmin,
}) => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentLang = i18n.language?.startsWith('ta') ? 'ta' : 'en';

  const toggleLanguage = (lang: 'en' | 'ta') => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'chit-plans', label: t('nav.chitPlans') },
    { id: 'how-it-works', label: t('nav.howItWorks') },
    { id: 'benefits', label: t('nav.benefits') },
    { id: 'calculator', label: t('nav.calculator') },
    { id: 'faq', label: t('nav.faq') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(COMPANY_DETAILS.whatsappDefaultMsg)}`;

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300" id="main-header">
      {/* Top Trust & Contact Utility Bar */}
      <div className="bg-[#000d1a] border-b border-slate-800 text-xs text-slate-300 py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-[11px] md:text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A028]" />
              <span className="font-semibold text-slate-200">{t('utility.cin')}</span> {COMPANY_DETAILS.cin}
            </span>
            <span className="hidden lg:inline-block text-slate-700">|</span>
            <span className="hidden lg:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#C5A028]" />
              {COMPANY_DETAILS.officeAddress}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] md:text-xs">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#C5A028]" />
              <a
                href={`tel:${COMPANY_DETAILS.phone1Clean}`}
                className="hover:text-[#C5A028] transition-colors font-medium text-slate-200"
                id="header-phone-1"
              >
                {COMPANY_DETAILS.phone1}
              </a>
              <span className="text-slate-600">/</span>
              <a
                href={`tel:${COMPANY_DETAILS.phone2Clean}`}
                className="hover:text-[#C5A028] transition-colors font-medium text-slate-200"
                id="header-phone-2"
              >
                {COMPANY_DETAILS.phone2}
              </a>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60 transition-colors font-medium text-[11px]"
              id="header-whatsapp-link"
            >
              <MessageCircle className="w-3 h-3" />
              {t('utility.whatsApp')}
            </a>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#001A33] border border-slate-700 text-slate-400 hover:text-[#C5A028] hover:border-[#C5A028]/50 text-[10px] font-semibold transition-all cursor-pointer"
                title="Admin Enquiry Portal"
                id="header-admin-btn"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>{t('nav.admin')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full px-3 sm:px-6 lg:px-8 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#001226]/95 backdrop-blur-md border-b border-[#C5A028]/30 shadow-lg shadow-black/50 py-2 sm:py-2.5'
            : 'bg-[#001226] border-b border-slate-800 py-2.5 sm:py-3'
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Strictly Single Logo Instance - Brand Name Locked in English */}
          <button
            onClick={() => handleLinkClick('home')}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A028] rounded-md text-left cursor-pointer transition-transform hover:scale-[1.02] shrink-0"
            id="nav-logo-btn"
            aria-label={`${BRAND_NAME} Home`}
          >
            <BrandLogo 
              size="nav" 
              showManagedBy={false} 
              imgClassName="h-12 sm:h-14 w-auto brightness-110 contrast-105"
              imgStyle={{
                filter: 'drop-shadow(0px 1px 4px rgba(255, 215, 0, 0.45)) drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.85)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6))',
              }}
            />
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  id={`nav-link-${link.id}`}
                  className={`px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-[#C5A028] bg-[#00264d] border border-[#C5A028]/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#00264d]/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Action Area: Prominent Language Toggle + Enquire CTA + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Prominent High-Contrast Language Switch Button */}
            <div
              className="inline-flex items-center bg-[#001A33] border-2 border-[#C5A028] rounded-full p-1 sm:p-1.5 shadow-lg shadow-black/40 hover:border-[#e0b83e] hover:shadow-[#C5A028]/20 transition-all"
              role="group"
              aria-label="Language selection"
              id="main-language-toggle"
            >
              <div className="pl-1.5 pr-0.5 hidden xs:flex items-center text-[#C5A028]" aria-hidden="true">
                <Globe className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>

              <button
                type="button"
                onClick={() => toggleLanguage('en')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-[#C5A028] text-[#001A33] font-black shadow-md scale-[1.02]'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
                aria-pressed={currentLang === 'en'}
                aria-label="Switch to English"
                id="header-lang-en-btn"
              >
                English
              </button>

              <button
                type="button"
                onClick={() => toggleLanguage('ta')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                  currentLang === 'ta'
                    ? 'bg-[#C5A028] text-[#001A33] font-black shadow-md scale-[1.02]'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
                aria-pressed={currentLang === 'ta'}
                aria-label="Switch to Tamil"
                id="header-lang-ta-btn"
              >
                தமிழ்
              </button>
            </div>

            {/* Enquire Now CTA (Desktop & Tablet) */}
            <button
              onClick={() => onOpenEnquiry()}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#001A33] bg-[#C5A028] hover:bg-[#e0b83e] rounded-md shadow-md transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 border border-[#f0c842] cursor-pointer shrink-0"
              id="nav-enquire-now-btn"
            >
              {t('nav.enquireNow')}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-[#00264d] border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-[#C5A028] shrink-0 cursor-pointer"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#C5A028]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-x-0 top-[68px] sm:top-[104px] bottom-0 bg-[#001226]/98 backdrop-blur-xl border-b border-slate-800 z-50 flex flex-col justify-between overflow-y-auto p-5 animate-in fade-in slide-in-from-top-4 duration-200"
          id="mobile-drawer-menu"
        >
          <div className="flex flex-col gap-3">
            {/* Mobile Language Switcher Card - Extra Large and prominent */}
            <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-[#001A33] border-2 border-[#C5A028]/70 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C5A028] uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  <span>{t('nav.language')} / மொழி</span>
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {currentLang === 'en' ? 'Selected: English' : 'தேர்ந்தெடுக்கப்பட்டது: தமிழ்'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-[#000d1a] p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => toggleLanguage('en')}
                  className={`py-2.5 rounded-md text-sm font-bold transition-all cursor-pointer text-center ${
                    currentLang === 'en'
                      ? 'bg-[#C5A028] text-[#001A33] shadow-md font-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  id="mobile-lang-en-btn"
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => toggleLanguage('ta')}
                  className={`py-2.5 rounded-md text-sm font-bold transition-all cursor-pointer text-center ${
                    currentLang === 'ta'
                      ? 'bg-[#C5A028] text-[#001A33] shadow-md font-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  id="mobile-lang-ta-btn"
                >
                  தமிழ்
                </button>
              </div>
            </div>

            <div className="pb-2 border-b border-slate-800 text-xs text-slate-400 font-medium">
              {t('nav.menu')}
            </div>

            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  id={`mobile-nav-link-${link.id}`}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-[#00264d] text-[#C5A028] border border-[#C5A028]/40'
                      : 'text-slate-200 hover:bg-[#001A33] hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#C5A028]' : 'text-slate-500'}`} />
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Footer Info */}
          <div className="pt-6 border-t border-slate-800 mt-6 flex flex-col gap-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full py-3 text-center font-bold text-sm tracking-wider uppercase text-[#001A33] bg-[#C5A028] hover:bg-[#e0b83e] rounded-md shadow-lg"
              id="mobile-menu-enquire-btn"
            >
              {t('nav.enquireNow')}
            </button>

            <div className="flex flex-col gap-2 bg-[#001A33] p-4 rounded-lg border border-slate-800 text-sm text-slate-300">
              <div className="font-semibold text-[#C5A028]">{t('nav.directSupport')}</div>
              <div className="flex flex-col gap-1.5">
                <a href={`tel:${COMPANY_DETAILS.phone1Clean}`} className="flex items-center gap-2 text-sm text-white hover:text-[#C5A028] font-medium">
                  <Phone className="w-3.5 h-3.5 text-[#C5A028]" /> {COMPANY_DETAILS.phone1}
                </a>
                <a href={`tel:${COMPANY_DETAILS.phone2Clean}`} className="flex items-center gap-2 text-sm text-white hover:text-[#C5A028] font-medium">
                  <Phone className="w-3.5 h-3.5 text-[#C5A028]" /> {COMPANY_DETAILS.phone2}
                </a>
              </div>
              <div className="text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span>{t('utility.cin')} {COMPANY_DETAILS.cin}</span>
                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="text-[#C5A028] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Lock className="w-3 h-3" />
                    {t('nav.adminLogin')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
