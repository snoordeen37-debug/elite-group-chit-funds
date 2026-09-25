import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { ChitPlansSection } from './components/ChitPlansSection';
import { CalculatorSection } from './components/CalculatorSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { AboutSection } from './components/AboutSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { EnquiryModal } from './components/EnquiryModal';
import { AdminPortal } from './components/AdminPortal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { LegalModals } from './components/LegalModals';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { getStoredAdminToken, verifyAdminSession, logoutAdmin } from './services/adminAuthService';
import { applySeoMetadata } from './utils/seo';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => !!getStoredAdminToken());
  
  // View mode: 'public' for public website, 'admin' for dedicated Admin Portal
  const [viewMode, setViewMode] = useState<'public' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const isHashAdmin = window.location.hash === '#admin';
      const wasAdminActive = sessionStorage.getItem('eg_admin_active') === 'true';
      if ((isHashAdmin || wasAdminActive) && !!getStoredAdminToken()) {
        return 'admin';
      }
    }
    return 'public';
  });

  const [selectedPlanForEnquiry, setSelectedPlanForEnquiry] = useState<string>('₹1,00,000');
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | 'disclaimer' | null>(null);

  // Validate session on mount and browser refresh
  useEffect(() => {
    const checkSession = async () => {
      const isValid = await verifyAdminSession();
      setIsAdminAuthenticated(isValid);
      if (!isValid && viewMode === 'admin') {
        setViewMode('public');
        sessionStorage.removeItem('eg_admin_active');
      }
    };
    checkSession();

    // Deep linking and SEO metadata sync on mount and back/forward navigation
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '');
      const validSections = ['chit-plans', '10-month-plans', 'calculator', 'contact', 'how-it-works', 'benefits', 'about', 'faq'];
      if (validSections.includes(path)) {
        setActiveSection(path);
        applySeoMetadata(path, false);
        setTimeout(() => {
          const element = document.getElementById(path);
          if (element) {
            const yOffset = -80;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 150);
      } else {
        applySeoMetadata('home', false);
      }
    }

    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '') || 'home';
      setActiveSection(path);
      applySeoMetadata(path, false);
      const element = document.getElementById(path === 'home' ? 'hero-section' : path);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Listen for hash changes
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        if (getStoredAdminToken()) {
          setViewMode('admin');
          sessionStorage.setItem('eg_admin_active', 'true');
        } else {
          setIsAdminLoginModalOpen(true);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [viewMode]);

  const handleAdminTrigger = () => {
    if (isAdminAuthenticated && getStoredAdminToken()) {
      setViewMode('admin');
      sessionStorage.setItem('eg_admin_active', 'true');
      window.location.hash = '#admin';
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginModalOpen(false);
    setViewMode('admin');
    sessionStorage.setItem('eg_admin_active', 'true');
    window.location.hash = '#admin';
  };

  const handleAdminLogout = async () => {
    await logoutAdmin();
    setIsAdminAuthenticated(false);
    setViewMode('public');
    sessionStorage.removeItem('eg_admin_active');
    if (window.location.hash === '#admin') {
      window.location.hash = '#home';
    }
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    applySeoMetadata(sectionId, true);
    if (viewMode === 'admin') {
      setViewMode('public');
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // Account for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenEnquiry = (plan?: string) => {
    if (plan) {
      setSelectedPlanForEnquiry(plan);
    }
    setIsEnquiryModalOpen(true);
  };

  // Dedicated Admin Workspace View
  if (viewMode === 'admin') {
    return (
      <AdminPortal
        onLogout={handleAdminLogout}
        onSwitchToPublic={() => setViewMode('public')}
      />
    );
  }

  // Public Website View
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col relative selection:bg-[#C5A028] selection:text-[#001A33]">
      
      {/* Sticky High Density Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenEnquiry={handleOpenEnquiry}
        onOpenAdmin={handleAdminTrigger}
      />

      {/* Main Content Sections */}
      <main className="flex-1 pb-16 sm:pb-0">
        {/* Hero Section */}
        <div id="home">
          <Hero
            onNavigate={handleNavigate}
            onOpenEnquiry={handleOpenEnquiry}
          />
        </div>

        {/* Compact Trust / Company Information Strip */}
        <TrustStrip />

        {/* Available Chit Plans Section (21-row table, 5-row table & Interactive Cards) */}
        <ChitPlansSection onOpenEnquiry={handleOpenEnquiry} />

        {/* Interactive Chit Plan Calculator */}
        <CalculatorSection onOpenEnquiry={handleOpenEnquiry} />

        {/* 5-Step How It Works Process */}
        <HowItWorksSection onOpenEnquiry={() => handleOpenEnquiry()} />

        {/* Why Choose ELITE GROUP (7 Core Values) */}
        <WhyChooseSection />

        {/* About ELITE GROUP – SS CHIT FUNDS PVT LTD */}
        <AboutSection
          onOpenEnquiry={() => handleOpenEnquiry()}
          onNavigate={handleNavigate}
        />

        {/* 10 FAQs */}
        <FaqSection onOpenEnquiry={() => handleOpenEnquiry()} />

        {/* Contact Us & Enquiry Form */}
        <ContactSection initialPlan={selectedPlanForEnquiry} />
      </main>

      {/* Premium Dark Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLegal={(type) => setLegalModalType(type)}
        onOpenEnquiry={() => handleOpenEnquiry()}
        onOpenAdmin={handleAdminTrigger}
      />

      {/* Sticky & Floating Lead Actions (Mobile Bottom Dock + Desktop Floating Stack) */}
      <WhatsAppFloatingButton onOpenEnquiry={handleOpenEnquiry} />

      {/* Lead Generation Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        initialPlan={selectedPlanForEnquiry}
      />

      {/* Professional Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Legal Modals (Terms, Privacy, Disclaimer) */}
      <LegalModals
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

    </div>
  );
}
