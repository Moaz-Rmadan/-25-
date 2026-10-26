/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useId, useEffect, useRef } from 'react';
import {
  Phone,
  Menu,
  X,
  Star,
  ChevronDown,
  MessageCircle,
  Eye,
  ArrowLeft,
  Check,
  MapPin,
  Clock,
  Maximize2,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  storeConfig,
  getWhatsAppUrl,
  getProductInquiryUrl,
  getCategoryInquiryUrl,
  type ProductItem,
} from './config/storeConfig';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Quick inquiry form state with validation
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryCategory, setInquiryCategory] = useState(storeConfig.categories[0]?.name || 'غرف المعيشة');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; message?: string }>({});

  const nameInputId = useId();
  const categorySelectId = useId();
  const messageInputId = useId();

  // Accessibility Refs for Modals (Focus Management & Focus Trap)
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const productModalRef = useRef<HTMLDivElement | null>(null);
  const lightboxModalRef = useRef<HTMLDivElement | null>(null);
  const productCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const lightboxCloseButtonRef = useRef<HTMLButtonElement | null>(null);

  const isModalOpen = activeModalProduct !== null || lightboxImage !== null;

  // Accessibility & UX: Handle Focus Trap, Escape key, and restore body scroll + focus
  useEffect(() => {
    if (!isModalOpen) return;

    // Capture currently focused element before moving focus into dialog
    if (document.activeElement instanceof HTMLElement) {
      lastActiveElementRef.current = document.activeElement;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move initial focus to the primary interactive element (close button)
    const focusTimer = setTimeout(() => {
      if (activeModalProduct && productCloseButtonRef.current) {
        productCloseButtonRef.current.focus();
      } else if (lightboxImage && lightboxCloseButtonRef.current) {
        lightboxCloseButtonRef.current.focus();
      }
    }, 40);

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Escape key closes the active dialog
      if (e.key === 'Escape') {
        e.preventDefault();
        setActiveModalProduct(null);
        setLightboxImage(null);
        return;
      }

      // 2. Tab and Shift+Tab focus trap
      if (e.key === 'Tab') {
        const activeContainer = activeModalProduct
          ? productModalRef.current
          : lightboxModalRef.current;

        if (!activeContainer) return;

        const focusableElements = activeContainer.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !activeContainer.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !activeContainer.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      // Return focus to previous trigger element if it exists in DOM
      if (lastActiveElementRef.current && typeof lastActiveElementRef.current.focus === 'function') {
        lastActiveElementRef.current.focus();
      }
    };
  }, [isModalOpen, activeModalProduct, lightboxImage]);

  const filteredProducts = selectedCategoryFilter === 'all'
    ? storeConfig.featuredProducts
    : storeConfig.featuredProducts.filter(p => p.categoryId === selectedCategoryFilter);

  // Selected category metadata for empty state display and WhatsApp link
  const selectedCategoryMeta = storeConfig.categories.find(c => c.id === selectedCategoryFilter);
  const currentCategoryName = selectedCategoryMeta ? selectedCategoryMeta.name : 'هذا القسم';

  // Strict validation and sanitization for contact form
  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedName = inquiryName.trim();
    const sanitizedMessage = inquiryMessage.trim();

    const errors: { name?: string; message?: string } = {};

    if (!sanitizedName || sanitizedName.length < 2) {
      errors.name = 'يرجى كتابة الاسم الكريم (حرفان على الأقل) للتواصل.';
    }

    if (!sanitizedMessage || sanitizedMessage.length < 5) {
      errors.message = 'يرجى كتابة تفاصيل استفسارك أو المقاسات المطلوبة (5 أحرف على الأقل).';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const text = `مرحبًا معرض ${storeConfig.brand.name}،\nاسمي: ${sanitizedName}\nالقسم المهتم به: ${inquiryCategory}\nاستفساري: ${sanitizedMessage}`;
    window.open(getWhatsAppUrl(text), '_blank');
  };

  // Build filter tabs dynamically from configured categories
  const filterTabs = [
    { id: 'all', label: 'كافة المعروضات' },
    ...storeConfig.categories.map(c => ({ id: c.id, label: c.name })),
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#221C18] antialiased selection:bg-[#C59B51]/20 selection:text-[#221C18]" dir="rtl">
      
      {/* Top Notification / Trust Banner */}
      {storeConfig.sections.topBanner && (
        <div className="bg-[#221C18] text-[#EFE8DC] text-xs py-2 px-4 border-b border-[#362D26]">
          <div className="container mx-auto flex items-center justify-between text-[11px] sm:text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C59B51]"></span>
              <span>{storeConfig.brand.topBannerNotice}</span>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-[#D5C7B7]">
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="text-[#C59B51]" /> مواعيد العمل: {storeConfig.brand.workingHoursShort}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="text-[#C59B51]" /> {storeConfig.brand.locationShort}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Luxury Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFCFC0] transition-shadow">
        <nav className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-6" aria-label="شريط التنقل الرئيسي">
          
          {/* Brand Wordmark */}
          <a href="#hero" className="flex flex-col group shrink-0">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#221C18] group-hover:text-[#9A7233] transition-colors">
              {storeConfig.brand.name}
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#887869] font-medium font-mono">
              {storeConfig.brand.subname}
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-7 text-[13px] font-medium text-[#5C4F44]">
            {storeConfig.sections.hero && <a href="#hero" className="hover:text-[#221C18] transition-colors py-1">الرئيسية</a>}
            {storeConfig.sections.categories && <a href="#categories" className="hover:text-[#221C18] transition-colors py-1">أقسام الأثاث</a>}
            {storeConfig.sections.featuredProducts && <a href="#featured-products" className="hover:text-[#221C18] transition-colors py-1">المنتجات المميزة</a>}
            {storeConfig.sections.gallery && <a href="#gallery" className="hover:text-[#221C18] transition-colors py-1">معرض الصور</a>}
            {storeConfig.sections.about && <a href="#about" className="hover:text-[#221C18] transition-colors py-1">من نحن</a>}
            {storeConfig.sections.whyUs && <a href="#why-us" className="hover:text-[#221C18] transition-colors py-1">لماذا تختارنا؟</a>}
            {storeConfig.sections.reviews && <a href="#reviews" className="hover:text-[#221C18] transition-colors py-1">آراء العملاء</a>}
            {storeConfig.sections.faq && <a href="#faq" className="hover:text-[#221C18] transition-colors py-1">الأسئلة الشائعة</a>}
            {storeConfig.sections.contact && <a href="#contact" className="hover:text-[#221C18] transition-colors py-1">تواصل معنا</a>}
          </div>

          {/* Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <a
              href={getWhatsAppUrl(`مرحبًا معرض ${storeConfig.brand.name}، أود الاستفسار عن المعروضات المتوفرة`)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide bg-[#221C18] text-[#FAF7F2] hover:bg-[#9A7233] transition-all duration-300 shadow-sm hover:shadow cursor-pointer"
            >
              <Phone size={14} className="text-[#C59B51]" />
              <span>استفسار واتساب</span>
            </a>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2.5 rounded-xl border border-[#DDD4C4] text-[#221C18] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
              aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="xl:hidden overflow-hidden bg-[#FAF7F2] border-t border-[#E8DFCF] px-6 py-6 shadow-xl"
            >
              <div className="flex flex-col gap-3.5 text-sm font-semibold text-[#5C4F44]">
                {[
                  ...(storeConfig.sections.hero ? [{ label: 'الرئيسية', href: '#hero' }] : []),
                  ...(storeConfig.sections.categories ? [{ label: 'أقسام الأثاث', href: '#categories' }] : []),
                  ...(storeConfig.sections.featuredProducts ? [{ label: 'المنتجات المميزة', href: '#featured-products' }] : []),
                  ...(storeConfig.sections.gallery ? [{ label: 'معرض الصور والتصاميم', href: '#gallery' }] : []),
                  ...(storeConfig.sections.about ? [{ label: 'من نحن', href: '#about' }] : []),
                  ...(storeConfig.sections.whyUs ? [{ label: 'لماذا تختارنا؟', href: '#why-us' }] : []),
                  ...(storeConfig.sections.reviews ? [{ label: 'آراء العملاء', href: '#reviews' }] : []),
                  ...(storeConfig.sections.faq ? [{ label: 'الأسئلة الشائعة', href: '#faq' }] : []),
                  ...(storeConfig.sections.contact ? [{ label: 'تواصل معنا وموقع المعرض', href: '#contact' }] : []),
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2 px-3 rounded-lg hover:bg-[#F2ECE1] hover:text-[#221C18] transition-colors flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <ArrowLeft size={14} className="text-[#A29282]" />
                  </a>
                ))}
                <div className="pt-4 border-t border-[#E8DFCF] flex flex-col gap-2">
                  <a
                    href={getWhatsAppUrl(`مرحبًا معرض ${storeConfig.brand.name}، أود الاستفسار`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#221C18] text-white font-bold text-sm"
                  >
                    <MessageCircle size={16} className="text-[#C59B51]" />
                    <span>مراسلة عبر واتساب</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        
        {/* 1. Hero Section (افتتاحية فخمة ومبهرة) */}
        {storeConfig.sections.hero && (
          <section id="hero" className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Warm Luxury Scrim - Eager Loading for Highest LCP */}
            <div className="absolute inset-0">
              <img
                src={storeConfig.hero.backgroundImage}
                alt={`صالة معيشة فاخرة من معرض ${storeConfig.brand.name}`}
                className="w-full h-full object-cover object-center scale-[1.01]"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410] via-[#1A1410]/70 to-[#1A1410]/35" />
              <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_0%,_rgba(26,20,16,0.6)_100%]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10 py-24 sm:py-32 text-center text-white max-w-4xl">
              
              {/* Pill-free Kicker */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm tracking-wide text-[#E8DFCFC0] mb-6 font-medium"
              >
                {storeConfig.hero.kicker.map((k, idx) => (
                  <span key={idx} className="flex items-center gap-2 sm:gap-3">
                    <span>{k}</span>
                    {idx < storeConfig.hero.kicker.length - 1 && <span className="text-[#C59B51]">·</span>}
                  </span>
                ))}
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-6xl md:text-7xl font-bold font-editorial tracking-tight mb-6 leading-[1.25] text-balance text-[#FAF7F2]"
              >
                {storeConfig.hero.headline}
              </motion.h1>

              {/* Marketing Prose */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-base sm:text-xl text-[#DDD4C4] font-light max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
              >
                {storeConfig.hero.subheadline}
              </motion.p>

              {/* Dual CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <a
                  href="#featured-products"
                  className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm tracking-wide bg-[#C59B51] hover:bg-[#B68943] text-[#1A1410] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  {storeConfig.hero.primaryCtaText}
                </a>
                <a
                  href="#contact"
                  className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm tracking-wide bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {storeConfig.hero.secondaryCtaText}
                </a>
              </motion.div>

              {/* Trust highlights bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.5 }}
                className="mt-16 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#E5DDCF]/90 font-light"
              >
                {storeConfig.hero.trustBadges.map((badge, idx) => (
                  <div key={idx} className="flex items-center justify-center gap-2">
                    <Check size={14} className="text-[#C59B51]" />
                    <span>{badge}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* 2. أقسام الأثاث (Category Cards) */}
        {storeConfig.sections.categories && (
          <section id="categories" className="py-24 sm:py-32 container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-[#9A7233] font-bold">مجموعات الأثاث</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#221C18] mt-2 mb-4 font-editorial">
                أقسام الأثاث المتكاملة
              </h2>
              <p className="text-[#736354] text-sm sm:text-base leading-relaxed">
                اختر القسم الذي ترغب في تأثيثه للاطلاع على أحدث التصاميم المصممة بعناية فائقة.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {storeConfig.categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryFilter(cat.id);
                    const el = document.getElementById('featured-products');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative overflow-hidden rounded-2xl h-80 sm:h-96 cursor-pointer bg-[#221C18] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(45,36,30,0.14)] transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-end p-6 border border-[#E8DFCF]"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F1915]/95 via-[#1F1915]/40 to-transparent group-hover:from-[#1F1915] transition-colors duration-500" />

                  <div className="relative z-10">
                    <span className="text-[11px] text-[#C59B51] font-semibold tracking-wider block mb-1">
                      قسم المعرض
                    </span>
                    <h3 className="text-2xl font-bold text-[#FAF7F2] mb-1.5 transition-colors group-hover:text-[#FAF7F2]">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#D5C7B7] line-clamp-1 mb-4 font-light">
                      {cat.tagline}
                    </p>

                    <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C59B51] group-hover:text-[#FAF7F2] transition-colors">
                      <span>استعراض منتجات القسم</span>
                      <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. المنتجات المميزة (Featured Products Showcase) */}
        {storeConfig.sections.featuredProducts && (
          <section id="featured-products" className="py-24 sm:py-32 bg-[#F4EFE6] border-y border-[#E8DFCF]">
            <div className="container mx-auto px-4 sm:px-6">
              
              <div className="max-w-3xl mx-auto text-center mb-12">
                <span className="text-xs uppercase tracking-widest text-[#9A7233] font-bold">مختارات الصالة</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#221C18] mt-2 mb-4 font-editorial">
                  المنتجات المميزة
                </h2>
                <p className="text-[#736354] text-sm sm:text-base leading-relaxed">
                  نماذج من قطع الأثاث المختارة التي تجمع بين دقة الصنعة وأناقة الحضور، مع إمكانية تعديل الأبعاد وخامات الأقمشة حسب الطلب.
                </p>
              </div>

              {/* Dynamic Filter segmented buttons generated from config */}
              <div className="flex items-center justify-center flex-wrap gap-2 mb-14" role="tablist" aria-label="تصنيف المنتجات المعروضة">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategoryFilter(tab.id)}
                    role="tab"
                    aria-selected={selectedCategoryFilter === tab.id}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                      selectedCategoryFilter === tab.id
                        ? 'bg-[#221C18] text-[#FAF7F2] shadow-sm'
                        : 'bg-white/80 text-[#6B5C4E] hover:bg-white hover:text-[#221C18] border border-[#DDD4C4]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Products Grid or Empty State */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="group bg-white rounded-2xl overflow-hidden border border-[#E5DDCF] shadow-[0_4px_20px_rgba(45,36,30,0.03)] hover:shadow-[0_20px_35px_rgba(45,36,30,0.09)] transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#E8DFCF]">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                          loading="lazy"
                          decoding="async"
                        />
                        
                        <div className="absolute top-4 right-4 bg-[#FAF7F2]/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-[#5C4F44] border border-[#DDD4C4]/60">
                          {prod.category}
                        </div>

                        <button
                          onClick={(e) => {
                            lastActiveElementRef.current = e.currentTarget;
                            setActiveModalProduct(prod);
                          }}
                          className="absolute bottom-4 left-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#221C18] shadow-md transition-all duration-300 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105 cursor-pointer"
                          title={`معاينة تفاصيل: ${prod.name}`}
                          aria-label={`معاينة تفاصيل: ${prod.name}`}
                        >
                          <Eye size={16} />
                        </button>
                      </div>

                      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-[#221C18] mb-2 group-hover:text-[#9A7233] transition-colors font-editorial">
                            {prod.name}
                          </h3>
                          
                          <p className="text-xs text-[#736354] leading-relaxed mb-4 line-clamp-2">
                            {prod.description}
                          </p>

                          <div className="text-[11px] text-[#887869] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8DFCF] mb-5">
                            <span className="font-semibold text-[#5C4F44]">الأبعاد المقترحة: </span>
                            <span>{prod.dimensions}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#F0E9DF]">
                          <div className="flex items-center justify-between text-xs mb-3.5">
                            <span className="text-[#887869]">حالة السعر:</span>
                            <span className="font-bold text-[#9A7233] bg-[#C59B51]/10 px-2.5 py-0.5 rounded-full text-[11px]">
                              {prod.priceStatus || 'عند الطلب حسب المقاس'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <a
                              href={getProductInquiryUrl(prod.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#221C18] hover:bg-[#9A7233] text-[#FAF7F2] text-xs font-bold transition-all duration-300 shadow-sm"
                            >
                              <Phone size={13} className="text-[#C59B51]" />
                              <span>اسأل عن السعر</span>
                            </a>

                            <button
                              onClick={(e) => {
                                lastActiveElementRef.current = e.currentTarget;
                                setActiveModalProduct(prod);
                              }}
                              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#F5EFEB] hover:bg-[#EFE8DC] text-[#4A3F35] text-xs font-bold transition-colors border border-[#DDD4C4] cursor-pointer"
                            >
                              <Eye size={13} />
                              <span>تفاصيل القطعة</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Elegant empty state when a category has no products yet */
                <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#E5DDCF] shadow-[0_4px_24px_rgba(45,36,30,0.04)] text-center max-w-2xl mx-auto my-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] text-[#9A7233] flex items-center justify-center mx-auto mb-5 border border-[#E8DFCF]">
                    <Clock size={28} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#221C18] mb-3 font-editorial">
                    قسم {currentCategoryName}
                  </h3>
                  <p className="text-[#6B5C4E] text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
                    {storeConfig.emptyCategoryNotice.message}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={getCategoryInquiryUrl(currentCategoryName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#221C18] hover:bg-[#9A7233] text-[#FAF7F2] text-xs font-bold transition-all duration-300 shadow-sm"
                    >
                      <Phone size={14} className="text-[#C59B51]" />
                      <span>{storeConfig.emptyCategoryNotice.whatsappCtaText}</span>
                    </a>
                    <button
                      onClick={() => setSelectedCategoryFilter('all')}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#5C4F44] text-xs font-bold transition-colors border border-[#DDD4C4] cursor-pointer"
                    >
                      {storeConfig.emptyCategoryNotice.viewAllCtaText}
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom note about customization */}
              <div className="mt-14 p-6 bg-white rounded-2xl border border-[#E5DDCF] text-center max-w-2xl mx-auto text-xs text-[#736354] leading-relaxed">
                <span className="font-bold text-[#221C18]">ملاحظة هامة: </span>
                كافة المعروضات أعلاه قابلة للتعديل من حيث نوع ولون الأقمشة والمقاسات بما يلائم مساحة بيتك. اتصل بفريق المبيعات لتحديد السعر الدقيق بناءً على رغبتك.
              </div>

            </div>
          </section>
        )}

        {/* 4. معرض الصور والتصميمات (Photo Gallery with Lightbox) */}
        {storeConfig.sections.gallery && (
          <section id="gallery" className="py-24 sm:py-32 container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-[#9A7233] font-bold">إلهام بصري</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#221C18] mt-2 mb-4 font-editorial">
                معرض الصور والتصاميم
              </h2>
              <p className="text-[#736354] text-sm sm:text-base leading-relaxed">
                لقطات حية توضح تناغم خاماتنا وألواننا داخل المساحات السكنية المختلفة. اضغط على أي صورة لتكبيرها.
              </p>
            </div>

            <div className="grid grid-cols-12 gap-5 sm:gap-6">
              {storeConfig.galleryItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    lastActiveElementRef.current = e.currentTarget;
                    setLightboxImage({ url: item.image, title: item.title });
                  }}
                  className={`${item.span} group relative h-72 sm:h-88 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-500 border border-[#E5DDCF]`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      lastActiveElementRef.current = e.currentTarget;
                      setLightboxImage({ url: item.image, title: item.title });
                    }
                  }}
                  aria-label={`عرض صورة مكبرة: ${item.title}`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    loading="lazy"
                    decoding="async"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F1915]/90 via-[#1F1915]/20 to-transparent opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-end">
                      <span className="p-2.5 rounded-full bg-white/80 text-[#221C18] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                        <Maximize2 size={16} />
                      </span>
                    </div>
                    <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0">
                      <span className="text-[11px] text-[#C59B51] font-semibold block mb-1">{item.category}</span>
                      <h4 className="text-lg font-bold text-white font-editorial">{item.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. قسم من نحن (About Us) */}
        {storeConfig.sections.about && (
          <section id="about" className="py-24 sm:py-32 bg-[#F4EFE6] border-y border-[#E8DFCF]">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                
                <div className="lg:col-span-6 relative">
                  <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-xl aspect-[4/3]">
                    <img
                      src={storeConfig.about.image}
                      alt={`صالة عرض ${storeConfig.brand.name}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                  
                  <div className="absolute -bottom-6 -left-4 sm:bottom-6 sm:-left-6 bg-[#221C18] text-[#FAF7F2] p-6 rounded-2xl shadow-xl max-w-xs border border-[#3E3228]">
                    <div className="text-2xl font-bold font-editorial text-[#C59B51] mb-1">{storeConfig.about.badgeTitle}</div>
                    <div className="text-xs text-[#D5C7B7] font-light leading-relaxed">
                      {storeConfig.about.badgeSubtitle}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <span className="text-xs uppercase tracking-widest text-[#9A7233] font-bold">{storeConfig.about.kicker}</span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#221C18] mt-2 mb-6 font-editorial leading-tight">
                    {storeConfig.about.headline}
                  </h2>
                  
                  <p className="text-[#5C4F44] text-base leading-relaxed mb-6 font-light">
                    {storeConfig.about.introLead}
                  </p>

                  <p className="text-[#5C4F44] text-sm leading-relaxed mb-8 font-light">
                    {storeConfig.about.bodyParagraph}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#DDD4C4]">
                    {storeConfig.about.pillars.map((pillar, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/70 border border-[#DDD4C4]">
                        <div className="text-lg font-bold text-[#221C18] font-editorial mb-1">{pillar.title}</div>
                        <div className="text-xs text-[#736354]">{pillar.desc}</div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            </div>
          </section>
        )}

        {/* 6. لماذا تختارنا؟ (Why Choose Us) */}
        {storeConfig.sections.whyUs && (
          <section id="why-us" className="py-24 sm:py-32 container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-[#9A7233] font-bold">معايير التميز</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#221C18] mt-2 mb-4 font-editorial">
                لماذا تختار {storeConfig.brand.name}؟
              </h2>
              <p className="text-[#736354] text-sm sm:text-base leading-relaxed">
                قيم ومبادئ واضحة نحرص على تقديمها في كل قطعة أثاث تخرج من صالتنا إلى منزلك.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {storeConfig.whyChooseUs.map((feature, idx) => {
                const IconComp = feature.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-7 rounded-2xl border border-[#E5DDCF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(45,36,30,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#9A7233] flex items-center justify-center mb-5 border border-[#E8DFCF]">
                        <IconComp size={22} />
                      </div>
                      <h3 className="text-lg font-bold text-[#221C18] mb-2 font-editorial">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-[#736354] leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 7. آراء العملاء (Client Reviews) */}
        {storeConfig.sections.reviews && (
          <section id="reviews" className="py-24 sm:py-32 bg-[#F4EFE6] border-y border-[#E8DFCF]">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-2xl mx-auto text-center mb-16">
                <span className="text-xs uppercase tracking-widest text-[#9A7233] font-bold">تجارب نعتز بها</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#221C18] mt-2 mb-4 font-editorial">
                  انطباعات عملاء المعرض
                </h2>
                <p className="text-[#736354] text-xs sm:text-sm leading-relaxed">
                  نماذج استرشادية توضح تجربة العملاء مع جودة تشطيباتنا ومستوى الخدمة والتواصل.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {storeConfig.reviews.items.map((rev, i) => (
                  <div
                    key={i}
                    className="bg-white p-8 rounded-2xl border border-[#E5DDCF] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-center gap-1 text-[#C59B51] mb-5">
                        {Array.from({ length: rev.rating }).map((_, rIdx) => (
                          <Star key={rIdx} size={16} fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-sm text-[#4A3F35] leading-relaxed italic mb-6">
                        «{rev.text}»
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#F0E9DF] flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-[#221C18]">{rev.name}</div>
                        <div className="text-xs text-[#887869]">{rev.city}</div>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#FAF7F2] text-[#9A7233] font-bold text-xs flex items-center justify-center border border-[#DDD4C4]">
                        {rev.name[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {storeConfig.reviews.disclaimer && (
                <div className="text-center mt-10 text-xs text-[#887869]">
                  {storeConfig.reviews.disclaimer}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 8. الأسئلة الشائعة (Frequently Asked Questions - FAQ Accordion) */}
        {storeConfig.sections.faq && (
          <section id="faq" className="py-24 sm:py-32 container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-[#9A7233] font-bold">إجابات واضحة</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#221C18] mt-2 mb-4 font-editorial">
                الأسئلة الشائعة
              </h2>
              <p className="text-[#736354] text-sm sm:text-base leading-relaxed">
                جمعنا لك أهم التساؤلات المتكررة حول الاستفسار عن الأسعار، المقاسات، والخامات.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {storeConfig.faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-[#E5DDCF] rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full text-right p-6 font-bold text-sm sm:text-base text-[#221C18] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF7F2] transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      <span className={`p-1.5 rounded-full bg-[#FAF7F2] text-[#9A7233] transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#C59B51]/15 text-[#9A7233]' : ''}`}>
                        <ChevronDown size={18} />
                      </span>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#5C4F44] leading-relaxed border-t border-[#F0E9DF]">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 9. تواصل معنا ونموذج الاستفسار السريع (Contact & Showroom Info) */}
        {storeConfig.sections.contact && (
          <section id="contact" className="py-24 sm:py-32 bg-[#F4EFE6] border-t border-[#E8DFCF]">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                
                {/* Showroom Information Column */}
                <div className="lg:col-span-5">
                  <span className="text-xs uppercase tracking-widest text-[#9A7233] font-bold">قنوات الاتصال المباشر</span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#221C18] mt-2 mb-6 font-editorial">
                    يسعدنا تواصلكم وزيارتكم
                  </h2>
                  
                  <p className="text-[#5C4F44] text-sm leading-relaxed mb-8 font-light">
                    سواء كنت تؤثث شقة جديدة أو ترغب في تجديد غرفة معيشة، فريق «{storeConfig.brand.name}» مستعد للإجابة عن كافة أسئلتكم ومساعدتكم في اختيار الأثاث الأنسب.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E5DDCF]">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#9A7233] flex items-center justify-center shrink-0 border border-[#E8DFCF]">
                        <Phone size={18} />
                      </div>
                      <div>
                        <div className="text-xs text-[#887869]">
                          {storeConfig.contact.isDemoNumber ? 'رقم الهاتف والواتساب التجريبي' : 'رقم الهاتف والواتساب'}
                        </div>
                        <a href={getWhatsAppUrl('')} target="_blank" rel="noopener noreferrer" className="font-bold text-[#221C18] hover:text-[#9A7233] transition-colors dir-ltr block text-sm">
                          {storeConfig.contact.displayPhone}
                        </a>
                        {storeConfig.contact.isDemoNumber && (
                          <div className="text-[10px] text-[#A89888] mt-0.5">
                            {storeConfig.contact.demoNotice}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E5DDCF]">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#9A7233] flex items-center justify-center shrink-0 border border-[#E8DFCF]">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div className="text-xs text-[#887869]">موقع المعرض</div>
                        <div className="font-bold text-sm text-[#221C18]">{storeConfig.brand.locationDetailed}</div>
                        <div className="text-[11px] text-[#887869] mt-0.5">{storeConfig.brand.locationDirectionsNote}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E5DDCF]">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#9A7233] flex items-center justify-center shrink-0 border border-[#E8DFCF]">
                        <Clock size={18} />
                      </div>
                      <div>
                        <div className="text-xs text-[#887869]">ساعات استقبال الزوار</div>
                        <div className="font-bold text-sm text-[#221C18]">{storeConfig.brand.workingHoursDetailed}</div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Interactive Quick Inquiry Box */}
                <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E5DDCF] shadow-sm">
                  <h3 className="text-2xl font-bold text-[#221C18] mb-2 font-editorial">
                    أرسل استفسارك مباشرة عبر واتساب
                  </h3>
                  <p className="text-xs text-[#736354] mb-8">
                    املأ البيانات وسيقوم النموذج بنقلك فورًا لمحادثة واتساب مجهزة بنص استفسارك دون انتظار.
                  </p>

                  <form onSubmit={handleSendInquiry} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor={nameInputId} className="block text-xs font-semibold text-[#5C4F44] mb-2">
                          الاسم الكريم <span className="text-[#C59B51]">*</span>
                        </label>
                        <input
                          id={nameInputId}
                          type="text"
                          value={inquiryName}
                          onChange={(e) => {
                            setInquiryName(e.target.value);
                            if (formErrors.name) {
                              setFormErrors((prev) => ({ ...prev, name: undefined }));
                            }
                          }}
                          placeholder="مثال: أحمد عبد الله"
                          aria-invalid={!!formErrors.name}
                          aria-describedby={formErrors.name ? `${nameInputId}-error` : undefined}
                          className={`w-full px-4 py-3 rounded-xl border text-sm bg-[#FAF7F2] transition-colors focus:outline-none ${
                            formErrors.name
                              ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                              : 'border-[#DDD4C4] focus:border-[#9A7233]'
                          }`}
                        />
                        {formErrors.name && (
                          <p id={`${nameInputId}-error`} className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                            <AlertCircle size={13} className="shrink-0" />
                            <span>{formErrors.name}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor={categorySelectId} className="block text-xs font-semibold text-[#5C4F44] mb-2">
                          القسم أو الغرفة المطلوبة
                        </label>
                        <select
                          id={categorySelectId}
                          value={inquiryCategory}
                          onChange={(e) => setInquiryCategory(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#DDD4C4] focus:outline-none focus:border-[#9A7233] text-sm bg-[#FAF7F2]"
                        >
                          {storeConfig.categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                          <option value="تأثيث شقة كاملة">تأثيث شقة كاملة</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor={messageInputId} className="block text-xs font-semibold text-[#5C4F44] mb-2">
                        تفاصيل استفسارك أو المقاسات المطلوبة <span className="text-[#C59B51]">*</span>
                      </label>
                      <textarea
                        id={messageInputId}
                        rows={4}
                        value={inquiryMessage}
                        onChange={(e) => {
                          setInquiryMessage(e.target.value);
                          if (formErrors.message) {
                            setFormErrors((prev) => ({ ...prev, message: undefined }));
                          }
                        }}
                        placeholder="أود الاستفسار عن الموديلات المتاحة والأسعار وإمكانية المعاينة..."
                        aria-invalid={!!formErrors.message}
                        aria-describedby={formErrors.message ? `${messageInputId}-error` : undefined}
                        className={`w-full px-4 py-3 rounded-xl border text-sm bg-[#FAF7F2] transition-colors focus:outline-none ${
                          formErrors.message
                            ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                            : 'border-[#DDD4C4] focus:border-[#9A7233]'
                        }`}
                      />
                      {formErrors.message && (
                        <p id={`${messageInputId}-error`} className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                          <AlertCircle size={13} className="shrink-0" />
                          <span>{formErrors.message}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl font-bold text-sm bg-[#221C18] hover:bg-[#9A7233] text-[#FAF7F2] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                    >
                      <MessageCircle size={18} className="text-[#C59B51]" />
                      <span>إرسال الاستفسار عبر واتساب الآن</span>
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </section>
        )}

      </main>

      {/* 10. Footer Section (تذييل فخم ومتكامل) */}
      <footer className="bg-[#1C1714] text-[#D5C7B7] pt-20 pb-12 border-t border-[#312720]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-[#312720]">
            
            {/* Brand column */}
            <div className="lg:col-span-5">
              <span className="text-3xl font-bold font-editorial text-[#FAF7F2] block mb-2">
                {storeConfig.brand.name}
              </span>
              <span className="text-xs tracking-widest text-[#C59B51] uppercase font-mono block mb-4">
                {storeConfig.brand.subname}
              </span>
              <p className="text-xs text-[#A89888] leading-relaxed max-w-sm mb-6 font-light">
                {storeConfig.brand.description}
              </p>
              <div className="text-xs text-[#A89888]">
                <span>{storeConfig.contact.isDemoNumber ? 'رقم التواصل التجريبي: ' : 'رقم التواصل المعتمد: '}</span>
                <span className="text-[#FAF7F2] font-mono dir-ltr inline-block">{storeConfig.contact.displayPhone}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3">
              <div className="text-sm font-bold text-[#FAF7F2] mb-4 font-editorial">أقسام الموقع</div>
              <ul className="space-y-2.5 text-xs text-[#A89888]">
                {storeConfig.sections.hero && <li><a href="#hero" className="hover:text-[#C59B51] transition-colors">الرئيسية</a></li>}
                {storeConfig.sections.categories && <li><a href="#categories" className="hover:text-[#C59B51] transition-colors">أقسام الأثاث</a></li>}
                {storeConfig.sections.featuredProducts && <li><a href="#featured-products" className="hover:text-[#C59B51] transition-colors">المنتجات المميزة</a></li>}
                {storeConfig.sections.gallery && <li><a href="#gallery" className="hover:text-[#C59B51] transition-colors">معرض الصور</a></li>}
                {storeConfig.sections.about && <li><a href="#about" className="hover:text-[#C59B51] transition-colors">من نحن</a></li>}
                {storeConfig.sections.whyUs && <li><a href="#why-us" className="hover:text-[#C59B51] transition-colors">لماذا تختارنا؟</a></li>}
              </ul>
            </div>

            {/* Support and Info */}
            <div className="lg:col-span-4">
              <div className="text-sm font-bold text-[#FAF7F2] mb-4 font-editorial">الخدمات والاستفسار</div>
              <ul className="space-y-2.5 text-xs text-[#A89888] mb-6">
                {storeConfig.sections.faq && <li><a href="#faq" className="hover:text-[#C59B51] transition-colors">الأسئلة الشائعة حول الأسعار والمقاسات</a></li>}
                {storeConfig.sections.contact && <li><a href="#contact" className="hover:text-[#C59B51] transition-colors">مواعيد صالة العرض وزيارة المعرض</a></li>}
                <li><a href={getWhatsAppUrl(`مرحبًا معرض ${storeConfig.brand.name}، أود طلب استشارة مقاسات مجانية`)} target="_blank" rel="noopener noreferrer" className="hover:text-[#C59B51] transition-colors">طلب استشارة مقاسات مجانية عبر واتساب</a></li>
              </ul>

              <a
                href={getWhatsAppUrl(`مرحبًا معرض ${storeConfig.brand.name}، أود الاستفسار من المبيعات`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2D241E] hover:bg-[#9A7233] text-[#FAF7F2] text-xs font-bold transition-colors border border-[#3E3228]"
              >
                <Phone size={14} className="text-[#C59B51]" />
                <span>محادثة فورية مع المبيعات</span>
              </a>
            </div>

          </div>

          {/* Copyright bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A6B5D] gap-4">
            <div>
              © {storeConfig.footer.copyrightYear} معرض {storeConfig.brand.name}. {storeConfig.footer.copyrightNotice}
            </div>
            <div className="flex items-center gap-6">
              <a href="#hero" className="hover:text-[#C59B51] transition-colors">العودة للأعلى ↑</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      {storeConfig.sections.floatingWhatsApp && (
        <a
          href={getWhatsAppUrl(`مرحبًا معرض ${storeConfig.brand.name}، أود الاستفسار عن الأثاث المتوفر`)}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-40 p-4 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-108 active:scale-95 transition-all duration-300 flex items-center justify-center group cursor-pointer"
          title="تواصل معنا عبر واتساب"
          aria-label="تواصل معنا عبر واتساب"
        >
          <MessageCircle size={26} fill="currentColor" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-out text-xs font-bold px-0 group-hover:px-2">
            تواصل عبر واتساب
          </span>
        </a>
      )}

      {/* Product Quick-View Modal */}
      <AnimatePresence>
        {activeModalProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div
              ref={productModalRef}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#DDD4C4]"
            >
              <div className="relative aspect-video bg-[#E8DFCF]">
                <img
                  src={activeModalProduct.image}
                  alt={activeModalProduct.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <button
                  ref={productCloseButtonRef}
                  onClick={() => setActiveModalProduct(null)}
                  className="absolute top-4 left-4 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
                  aria-label="إغلاق نافذة تفاصيل المنتج"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#221C18]">
                  {activeModalProduct.category}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h3 id="product-modal-title" className="text-2xl font-bold text-[#221C18] mb-3 font-editorial">
                  {activeModalProduct.name}
                </h3>
                
                <p className="text-sm text-[#5C4F44] leading-relaxed mb-6">
                  {activeModalProduct.description}
                </p>

                <div className="space-y-4 mb-8 bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8DFCF]">
                  <div>
                    <span className="text-xs font-bold text-[#221C18] block mb-1.5">المواصفات وخامات التصنيع:</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5C4F44]">
                      {activeModalProduct.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check size={14} className="text-[#C59B51]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[#E8DFCF] text-xs text-[#5C4F44]">
                    <span className="font-bold text-[#221C18]">الأبعاد والمقاسات القياسية: </span>
                    <span>{activeModalProduct.dimensions}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={getProductInquiryUrl(activeModalProduct.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-sm bg-[#221C18] hover:bg-[#9A7233] text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <MessageCircle size={16} className="text-[#C59B51]" />
                    <span>طلب السعر والمقاسات عبر واتساب</span>
                  </a>
                  <button
                    onClick={() => setActiveModalProduct(null)}
                    className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-bold text-sm bg-[#F5EFEB] hover:bg-[#EAE2D8] text-[#5C4F44] transition-colors cursor-pointer"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gallery Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            
            <motion.div
              ref={lightboxModalRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 max-w-4xl max-h-[90vh] flex flex-col items-center"
            >
              <button
                ref={lightboxCloseButtonRef}
                onClick={() => setLightboxImage(null)}
                className="absolute -top-12 left-0 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="إغلاق معاينة الصورة المكبرة"
              >
                <X size={24} />
              </button>

              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
                loading="eager"
              />

              <div id="lightbox-modal-title" className="mt-4 text-center text-white text-base font-editorial">
                {lightboxImage.title}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
