'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Headphones,
  ArrowDownToLine,
  Lock,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  X,
  CreditCard,
  DownloadCloud,
} from 'lucide-react';
import type { ResourceData } from '@/lib/data-store';
import { PayPalCheckoutButton } from '@/components/checkout/PayPalCheckoutButton';
import { ShehnawiCheckoutButton } from '@/components/checkout/ShehnawiCheckoutButton';
import { CustomPaymentCheckoutButton } from '@/components/checkout/CustomPaymentCheckoutButton';

interface ResourcesListClientProps {
  initialResources: ResourceData[];
  locale: string;
}

export function ResourcesListClient({
  initialResources,
  locale,
}: ResourcesListClientProps) {
  const isRtl = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPaidResource, setSelectedPaidResource] = useState<ResourceData | null>(null);
  const [purchasedResourceIds, setPurchasedResourceIds] = useState<string[]>([]);

  // Unique categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialResources.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return Array.from(set);
  }, [initialResources]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return initialResources.filter((res) => {
      const title = isRtl ? res.titleAr || res.title : res.title;
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'ALL' || res.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialResources, searchQuery, selectedCategory, isRtl]);

  const handleResourceCardClick = (res: ResourceData) => {
    const isPaid = res.isFree === false || (typeof res.price === 'number' && res.price > 0);
    const alreadyPurchased = purchasedResourceIds.includes(res.id);

    if (isPaid && !alreadyPurchased) {
      setSelectedPaidResource(res);
    } else {
      // Direct Download
      const link = document.createElement('a');
      link.href = res.fileUrl || '/downloads/resource.pdf';
      link.download = '';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-surface-border shadow-card-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-navy-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'بحث في المصادر والمذكرات...' : 'Search resources...'}
            className="w-full ps-10 pe-4 py-2 rounded-xl border border-surface-border bg-surface-muted/40 text-xs text-navy-950 focus:bg-white focus:outline-hidden focus:border-brand-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'bg-surface-muted text-navy-700 hover:bg-surface-elevated'
            }`}
          >
            {isRtl ? 'جميع المصادر' : 'All Resources'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-surface-muted text-navy-700 hover:bg-surface-elevated'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resources - EVERY CARD IS HYPERLINKED & FULLY CLICKABLE */}
      {filteredResources.length === 0 ? (
        <div className="py-16 text-center max-w-lg mx-auto bg-white rounded-3xl p-8 border border-surface-border shadow-card-subtle">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-4 border border-brand-100">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-navy-950 mb-2">
            {isRtl ? 'لا توجد نتائج تطابق بحثك' : 'No matching resources found'}
          </h3>
          <p className="text-sm text-navy-600 mb-4">
            {isRtl ? 'جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً.' : 'Try adjusting your search terms or filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-brand-700 text-white font-bold text-xs"
          >
            {isRtl ? 'عرض كافة المصادر' : 'Reset filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {filteredResources.map((res) => {
            const title = isRtl ? res.titleAr || res.title : res.title;
            const isAudio =
              res.fileType?.toLowerCase().includes('mp3') ||
              res.category?.toLowerCase().includes('audio');
            const isPaid =
              res.isFree === false ||
              (typeof res.price === 'number' && res.price > 0) ||
              res.isPremium;
            const price = res.price || (isPaid ? 10 : 0);
            const isPurchased = purchasedResourceIds.includes(res.id);

            return (
              <div
                key={res.id}
                onClick={() => handleResourceCardClick(res)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleResourceCardClick(res);
                  }
                }}
                className={`academy-card p-6 flex flex-col justify-between rounded-3xl border-2 transition-all cursor-pointer relative group text-start select-none ${
                  isPaid && !isPurchased
                    ? 'border-surface-border hover:border-gold-400 hover:shadow-card-hover bg-white'
                    : 'border-surface-border hover:border-brand-500 hover:shadow-card-hover bg-white'
                }`}
                title={
                  isPaid && !isPurchased
                    ? isRtl
                      ? 'اضغط للشراء والتحميل الفوري'
                      : 'Click anywhere to purchase and download'
                    : isRtl
                    ? 'اضغط في أي مكان لتحميل الملف مباشرة'
                    : 'Click anywhere to download immediately'
                }
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon + Price/Free Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100 group-hover:scale-105 transition-transform">
                      {isAudio ? (
                        <Headphones className="w-6 h-6 text-brand-700" />
                      ) : (
                        <FileText className="w-6 h-6 text-brand-700" />
                      )}
                    </div>

                    {isPaid && !isPurchased ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-200 shadow-2xs">
                        <Lock className="w-3.5 h-3.5 text-amber-800" />
                        <span>${price} {res.currency || 'USD'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>{isRtl ? 'مجاني للتحميل' : 'Free Download'}</span>
                      </span>
                    )}
                  </div>

                  {/* Category & Title */}
                  <div>
                    <span className="text-[11px] font-bold text-navy-500 uppercase tracking-wider block mb-1">
                      {res.category || 'General'}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-navy-950 line-clamp-2 group-hover:text-brand-800 transition-colors leading-snug">
                      {title}
                    </h3>
                  </div>

                  {/* File Metadata */}
                  <div className="pt-3 border-t border-surface-borderSubtle flex items-center justify-between text-xs text-navy-500">
                    <span>
                      {isRtl ? 'حجم الملف:' : 'Size:'}{' '}
                      <strong className="text-navy-900 font-bold">{res.fileSizeMb || 2.5} MB</strong>
                    </span>
                    <span>
                      {isRtl ? 'الصيغة:' : 'Format:'}{' '}
                      <strong className="text-navy-900 font-bold">{res.fileType || 'PDF'}</strong>
                    </span>
                  </div>
                </div>

                {/* Hyperlinked Bottom Action Banner */}
                <div className="pt-5 mt-4">
                  {isPaid && !isPurchased ? (
                    <div className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-navy-900 group-hover:bg-brand-800 text-white flex items-center justify-center gap-2 shadow-sm transition-colors">
                      <Lock className="w-3.5 h-3.5 text-gold-400" />
                      <span>{isRtl ? `شراء وتحميل فوري ($${price})` : `Purchase & Download ($${price})`}</span>
                    </div>
                  ) : (
                    <div className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-brand-700 group-hover:bg-brand-800 text-white flex items-center justify-center gap-2 shadow-sm transition-colors">
                      <ArrowDownToLine className="w-4 h-4 text-gold-300" />
                      <span>{isRtl ? 'تحميل مباشر للملف (PDF)' : 'Direct Download'}</span>
                    </div>
                  )}

                  <span className="text-[11px] text-center text-navy-500 block mt-2 font-medium">
                    {isPaid && !isPurchased
                      ? isRtl
                        ? '⚡ اضغط على الكارت لفتح خيارات الشراء والدفع'
                        : '⚡ Click card to open payment checkout'
                      : isRtl
                      ? `✓ اضغط في أي مكان لتحميل الملف (${res.downloads || 0} تحميل سابق)`
                      : `✓ Click card to download (${(res.downloads || 0).toLocaleString()} downloads)`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PURCHASE MODAL FOR PAID RESOURCES */}
      {selectedPaidResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white rounded-3xl border border-surface-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in zoom-in-95"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-extrabold text-navy-950 text-base">
                    {isRtl ? 'شراء مادة تعليمية رقمية' : 'Purchase Digital Resource'}
                  </h3>
                  <p className="text-[11px] text-navy-500">
                    {isRtl ? selectedPaidResource.titleAr || selectedPaidResource.title : selectedPaidResource.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPaidResource(null)}
                className="w-8 h-8 rounded-full bg-surface-muted hover:bg-surface-elevated text-navy-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price Banner */}
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-navy-600 block">{isRtl ? 'سعر الملف الرقمي:' : 'Resource Price:'}</span>
                <span className="text-2xl font-black text-brand-900">
                  ${selectedPaidResource.price || 10} {selectedPaidResource.currency || 'USD'}
                </span>
              </div>
              <div className="text-end text-xs text-navy-600 font-bold">
                <span className="block">{selectedPaidResource.category}</span>
                <span className="text-navy-400 font-mono text-[11px]">
                  {selectedPaidResource.fileType} • {selectedPaidResource.fileSizeMb} MB
                </span>
              </div>
            </div>

            {/* Payment Options Header */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-extrabold text-navy-900 block">
                {isRtl ? 'اختر طريقة الدفع المناسبة لإتمام الشراء والتحميل الفوري:' : 'Select your payment method:'}
              </span>

              {/* 1. Shehnawi Egyptian Wallets & InstaPay */}
              <ShehnawiCheckoutButton
                itemId={selectedPaidResource.id}
                itemType="RESOURCE"
                itemTitle={isRtl ? selectedPaidResource.titleAr || selectedPaidResource.title : selectedPaidResource.title}
                amount={selectedPaidResource.price || 10}
                locale={locale}
                onSuccess={() => {
                  setPurchasedResourceIds((prev) => [...prev, selectedPaidResource.id]);
                  handleResourceCardClick(selectedPaidResource);
                  setSelectedPaidResource(null);
                }}
              />

              {/* 2. PayPal International Checkout */}
              <PayPalCheckoutButton
                itemId={selectedPaidResource.id}
                itemType="RESOURCE"
                itemTitle={isRtl ? selectedPaidResource.titleAr || selectedPaidResource.title : selectedPaidResource.title}
                amount={selectedPaidResource.price || 10}
                currency={selectedPaidResource.currency || 'USD'}
                onSuccess={() => {
                  setPurchasedResourceIds((prev) => [...prev, selectedPaidResource.id]);
                  handleResourceCardClick(selectedPaidResource);
                  setSelectedPaidResource(null);
                }}
              />

              {/* 3. Custom Payment Methods (Western Union, Wise, Tab Tab...) */}
              <CustomPaymentCheckoutButton
                itemId={selectedPaidResource.id}
                itemType="RESOURCE"
                itemTitle={isRtl ? selectedPaidResource.titleAr || selectedPaidResource.title : selectedPaidResource.title}
                amount={selectedPaidResource.price || 10}
                currency={selectedPaidResource.currency || 'USD'}
                locale={locale}
                onSuccess={() => {
                  setPurchasedResourceIds((prev) => [...prev, selectedPaidResource.id]);
                  handleResourceCardClick(selectedPaidResource);
                  setSelectedPaidResource(null);
                }}
              />
            </div>

            <div className="pt-2 text-center border-t border-surface-borderSubtle">
              <span className="text-[11px] text-navy-500">
                🔒 {isRtl ? 'تحميل مباشر فوري بمجرد تأكيد الدفع' : 'Instant download upon payment confirmation'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
