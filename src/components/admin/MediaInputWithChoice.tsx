'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  FileText,
  Video,
  Music,
  Image as ImageIcon,
  X,
  ExternalLink,
} from 'lucide-react';

interface MediaInputWithChoiceProps {
  label: string;
  value: string;
  onChange: (url: string, fileMeta?: { sizeMb: number; fileType: string }) => void;
  category?: 'thumbnails' | 'videos' | 'audio' | 'resources' | 'general';
  accept?: string;
  placeholder?: string;
  isRtl?: boolean;
  required?: boolean;
  helperText?: string;
}

export function MediaInputWithChoice({
  label,
  value,
  onChange,
  category = 'general',
  accept,
  placeholder = 'https://...',
  isRtl = true,
  required = false,
  helperText,
}: MediaInputWithChoiceProps) {
  // Determine initial mode based on whether the value starts with /uploads/ or http
  const [mode, setMode] = useState<'UPLOAD' | 'LINK'>(
    value && value.startsWith('/uploads/') ? 'UPLOAD' : 'LINK'
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setUploadedFileName(file.name);
        onChange(data.url, {
          sizeMb: data.fileSizeMb || 0,
          fileType: data.fileType || file.type,
        });
      } else {
        setUploadError(data.error || (isRtl ? 'فشل رفع الملف إلى السيرفر' : 'Failed to upload file'));
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(isRtl ? 'حدث خطأ أثناء الاتصال بالسيرفر' : 'Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const isServerUpload = value && value.startsWith('/uploads/');
  const isImage =
    category === 'thumbnails' ||
    value.match(/\.(jpeg|jpg|png|gif|webp|svg)($|\?)/i);
  const isVideo =
    category === 'videos' ||
    value.includes('youtube.com') ||
    value.includes('youtu.be') ||
    value.includes('vimeo.com') ||
    value.match(/\.(mp4|webm)($|\?)/i);
  const isAudio =
    category === 'audio' ||
    value.match(/\.(mp3|wav|ogg|m4a)($|\?)/i);

  return (
    <div className="space-y-2 text-xs">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="font-bold text-navy-800 flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>

        {/* 2-Option Selector Pill */}
        <div className="inline-flex rounded-xl p-0.5 bg-surface-muted border border-surface-border">
          <button
            type="button"
            onClick={() => setMode('UPLOAD')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              mode === 'UPLOAD'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'text-navy-600 hover:text-navy-950'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isRtl ? 'رفع على السيرفر' : 'Upload to Server'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('LINK')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              mode === 'LINK'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'text-navy-600 hover:text-navy-950'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{isRtl ? 'وضع رابط خارجي' : 'External Link'}</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Server Direct Upload */}
      {mode === 'UPLOAD' && (
        <div className="space-y-2">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-4 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
              uploading
                ? 'border-brand-400 bg-brand-50/50 cursor-wait'
                : 'border-brand-200 hover:border-brand-500 bg-brand-50/20 hover:bg-brand-50/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            {uploading ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
                <div className="w-6 h-6 border-2 border-brand-700 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-brand-900">
                  {isRtl ? 'جاري رفع الملف وحفظه على السيرفر...' : 'Uploading file to server...'}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 space-y-1.5 text-navy-600">
                <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-navy-800">
                  {isRtl ? 'انقر لاختيار ملف من جهازك أو اسحبه هنا' : 'Click to browse or drag file here'}
                </div>
                <div className="text-[10px] text-navy-400">
                  {accept ? `${isRtl ? 'الملفات المدعومة:' : 'Supported:'} ${accept}` : 'JPG, PNG, MP4, MP3, PDF'}
                </div>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="flex items-center gap-1.5 text-red-600 text-[11px] bg-red-50 p-2 rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: External Link Input */}
      {mode === 'LINK' && (
        <div className="relative">
          <input
            type="text"
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 ps-9 pe-9 rounded-xl border border-surface-border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <LinkIcon className="w-4 h-4 text-navy-400 absolute start-3 top-2.5" />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-navy-400 hover:text-navy-700 absolute end-3 top-2.5"
              title={isRtl ? 'مسح الرابط' : 'Clear'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Active Value Status & Preview Box */}
      {value && (
        <div className="p-3 bg-white rounded-xl border border-surface-border flex items-center justify-between gap-3 shadow-card-subtle">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              {isServerUpload ? (
                <UploadCloud className="w-4 h-4" />
              ) : isVideo ? (
                <Video className="w-4 h-4" />
              ) : isAudio ? (
                <Music className="w-4 h-4" />
              ) : isImage ? (
                <ImageIcon className="w-4 h-4" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-navy-100 text-navy-700">
                  {isServerUpload ? (isRtl ? 'ملف مرفوع على السيرفر' : 'Server Upload') : (isRtl ? 'رابط خارجي' : 'External Link')}
                </span>
                {uploadedFileName && (
                  <span className="text-xs font-semibold text-navy-900 truncate">
                    {uploadedFileName}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-navy-500 truncate" title={value}>
                {value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-surface-border text-navy-600 hover:text-brand-700 hover:bg-surface-muted transition-colors"
              title={isRtl ? 'فتح ومعاينة في نافذة جديدة' : 'Open in new tab'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setUploadedFileName(null);
              }}
              className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
              title={isRtl ? 'حذف الملف' : 'Remove'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {helperText && <p className="text-[11px] text-navy-400">{helperText}</p>}
    </div>
  );
}
