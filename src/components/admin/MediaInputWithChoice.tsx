'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Sparkles,
  HardDrive,
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

interface StorageStatus {
  usedMb: number;
  maxMb: number;
  usedGb: number;
  maxGb: number;
  percentage: number;
  isExceeded: boolean;
}

/**
 * Client-Side Smart Image Compression without visual quality loss.
 * Scales dimensions to maximum 2200px and converts to WebP at quality 0.85,
 * typically cutting file size by 70% to 90%.
 */
async function compressImageFile(file: File): Promise<{
  fileToUpload: File;
  originalMb: number;
  compressedMb: number;
  savedPercent: number;
  wasCompressed: boolean;
}> {
  const originalMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));

  // Only compress raster images; skip SVG, GIF, non-images
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return {
      fileToUpload: file,
      originalMb,
      compressedMb: originalMb,
      savedPercent: 0,
      wasCompressed: false,
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 2200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({
            fileToUpload: file,
            originalMb,
            compressedMb: originalMb,
            savedPercent: 0,
            wasCompressed: false,
          });
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Compress to high-quality WebP at 0.85 quality
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              return resolve({
                fileToUpload: file,
                originalMb,
                compressedMb: originalMb,
                savedPercent: 0,
                wasCompressed: false,
              });
            }

            const newName = file.name.replace(/\.[^.]+$/, '') + '.webp';
            const compressedFile = new File([blob], newName, { type: 'image/webp' });
            const compressedMb = parseFloat((blob.size / (1024 * 1024)).toFixed(2));
            const savedPercent = Math.round(((file.size - blob.size) / file.size) * 100);

            resolve({
              fileToUpload: compressedFile,
              originalMb,
              compressedMb,
              savedPercent,
              wasCompressed: true,
            });
          },
          'image/webp',
          0.85
        );
      };

      img.onerror = () => {
        resolve({
          fileToUpload: file,
          originalMb,
          compressedMb: originalMb,
          savedPercent: 0,
          wasCompressed: false,
        });
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve({
        fileToUpload: file,
        originalMb,
        compressedMb: originalMb,
        savedPercent: 0,
        wasCompressed: false,
      });
    };

    reader.readAsDataURL(file);
  });
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
  const [mode, setMode] = useState<'UPLOAD' | 'LINK'>(
    value && value.startsWith('/uploads/') ? 'UPLOAD' : 'LINK'
  );

  // Upload & Progress States
  const [uploadPhase, setUploadPhase] = useState<'IDLE' | 'COMPRESSING' | 'UPLOADING' | 'DONE' | 'ERROR'>('IDLE');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedMb, setUploadedMb] = useState(0);
  const [totalMb, setTotalMb] = useState(0);
  const [compressionInfo, setCompressionInfo] = useState<{
    originalMb: number;
    compressedMb: number;
    savedPercent: number;
  } | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [serverStorage, setServerStorage] = useState<StorageStatus | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch current server storage usage
  const fetchStorageUsage = async () => {
    try {
      const res = await fetch('/api/admin/upload');
      const data = await res.json();
      if (data.success) {
        setServerStorage({
          usedMb: data.usedMb,
          maxMb: data.maxMb,
          usedGb: data.usedGb,
          maxGb: data.maxGb,
          percentage: data.percentage,
          isExceeded: data.isExceeded,
        });
      }
    } catch {
      // silent fallback
    }
  };

  useEffect(() => {
    fetchStorageUsage();
  }, []);

  const handleFileUpload = async (rawFile: File) => {
    setUploadError(null);
    setCompressionInfo(null);
    setUploadProgress(0);

    // 1. Client-Side Compression Phase (Lossless perception)
    let fileToUpload = rawFile;
    if (rawFile.type.startsWith('image/')) {
      setUploadPhase('COMPRESSING');
      try {
        const comp = await compressImageFile(rawFile);
        fileToUpload = comp.fileToUpload;
        if (comp.wasCompressed) {
          setCompressionInfo({
            originalMb: comp.originalMb,
            compressedMb: comp.compressedMb,
            savedPercent: comp.savedPercent,
          });
        }
      } catch (compErr) {
        console.warn('Compression skipped, using original file:', compErr);
      }
    }

    // 2. Upload Phase with Real-Time Progress Counter via XMLHttpRequest
    setUploadPhase('UPLOADING');
    const finalSizeMb = parseFloat((fileToUpload.size / (1024 * 1024)).toFixed(2));
    setTotalMb(finalSizeMb);

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('category', category);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload', true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(percent);
        setUploadedMb(parseFloat((e.loaded / (1024 * 1024)).toFixed(2)));
        setTotalMb(parseFloat((e.total / (1024 * 1024)).toFixed(2)));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.success && data.url) {
          setUploadPhase('DONE');
          setUploadProgress(100);
          setUploadedFileName(fileToUpload.name);
          onChange(data.url, {
            sizeMb: data.fileSizeMb || finalSizeMb,
            fileType: data.fileType || fileToUpload.type,
          });
          fetchStorageUsage(); // Update storage usage
        } else {
          setUploadPhase('ERROR');
          // Exact error from server when 5GB limit is hit
          setUploadError(data.error || (isRtl ? 'فشل رفع الملف إلى السيرفر' : 'Failed to upload file'));
          fetchStorageUsage();
        }
      } catch {
        setUploadPhase('ERROR');
        setUploadError(isRtl ? 'حدث خطأ في قراءة استجابة السيرفر' : 'Invalid server response');
      }
    };

    xhr.onerror = () => {
      setUploadPhase('ERROR');
      setUploadError(isRtl ? 'حدث خطأ في الاتصال بالسيرفر أثناء الرفع' : 'Network error during upload');
    };

    xhr.send(formData);
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
    Boolean(value && value.match(/\.(jpeg|jpg|png|gif|webp|svg)($|\?)/i));
  const isVideo =
    category === 'videos' ||
    Boolean(value && (value.includes('youtube.com') || value.includes('youtu.be') || value.includes('vimeo.com') || value.match(/\.(mp4|webm)($|\?)/i)));
  const isAudio =
    category === 'audio' ||
    Boolean(value && value.match(/\.(mp3|wav|ogg|m4a)($|\?)/i));

  const isUploading = uploadPhase === 'COMPRESSING' || uploadPhase === 'UPLOADING';

  return (
    <div className="space-y-2.5 text-xs">
      {/* Header & Mode Switcher */}
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

      {/* Mode 1: Server Direct Upload with Compression & Progress Bar */}
      {mode === 'UPLOAD' && (
        <div className="space-y-2">
          {/* Server 5 GB Storage Indicator */}
          {serverStorage && (
            <div className="p-2.5 rounded-xl bg-surface-muted/60 border border-surface-borderSubtle flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-navy-700">
                <HardDrive className={`w-3.5 h-3.5 ${serverStorage.isExceeded ? 'text-red-600' : 'text-emerald-700'}`} />
                <span>
                  {isRtl ? 'مساحة تخزين السيرفر المستخدمة:' : 'Server Storage Used:'}{' '}
                  <strong className="font-mono">
                    {serverStorage.usedMb < 1000
                      ? `${serverStorage.usedMb} MB`
                      : `${serverStorage.usedGb} GB`}{' '}
                    / {serverStorage.maxGb} GB
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-surface-border rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      serverStorage.isExceeded
                        ? 'bg-red-600'
                        : serverStorage.percentage > 85
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${Math.min(serverStorage.percentage, 100)}%` }}
                  />
                </div>
                <span className="font-bold text-[10px] text-navy-600 font-mono">
                  {serverStorage.percentage}%
                </span>
              </div>
            </div>
          )}

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`p-4 rounded-2xl border-2 border-dashed text-center transition-all ${
              isUploading
                ? 'border-brand-400 bg-brand-50/50 cursor-wait'
                : 'border-brand-200 hover:border-brand-500 bg-brand-50/20 hover:bg-brand-50/40 cursor-pointer'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              disabled={isUploading}
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            {/* LIVE PROGRESS COUNTER & ANIMATED BAR */}
            {isUploading ? (
              <div className="space-y-2.5 py-2 max-w-md mx-auto">
                <div className="flex items-center justify-between text-xs font-bold text-navy-900">
                  <span className="flex items-center gap-1.5 text-brand-800">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-brand-600" />
                    <span>
                      {uploadPhase === 'COMPRESSING'
                        ? isRtl
                          ? 'جاري ضغط الملف وتحسين الجودة تلقائياً...'
                          : 'Compressing and optimizing file...'
                        : isRtl
                        ? `جاري الرفع إلى السيرفر: ${uploadProgress}%`
                        : `Uploading to server: ${uploadProgress}%`}
                    </span>
                  </span>
                  <span className="font-mono text-emerald-700 font-black text-sm">
                    {uploadProgress}%
                  </span>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full bg-surface-muted rounded-full h-3 overflow-hidden border border-surface-border shadow-inner relative">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 via-emerald-600 to-brand-700 transition-all duration-150 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-navy-500">
                  <span>
                    {isRtl ? 'تم رفع:' : 'Uploaded:'} {uploadedMb} MB / {totalMb} MB
                  </span>
                  {compressionInfo && (
                    <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>
                        {isRtl
                          ? `وفّر الضغط ${compressionInfo.savedPercent}% من الحجم`
                          : `Saved ${compressionInfo.savedPercent}% space`}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 space-y-1.5 text-navy-600">
                <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shadow-sm">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-navy-800">
                  {isRtl ? 'انقر لاختيار ملف من جهازك أو اسحبه هنا' : 'Click to browse or drag file here'}
                </div>
                <div className="text-[10px] text-navy-500">
                  {accept ? `${isRtl ? 'الملفات المدعومة:' : 'Supported:'} ${accept}` : 'JPG, PNG, MP4, MP3, PDF'}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 pt-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>
                    {isRtl
                      ? 'ميزة الضغط الذكي مفعّلة تلقائياً لتقليل استهلاك مساحة السيرفر'
                      : 'Automatic smart compression active to save server space'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* COMPRESSION SAVINGS BADGE ON SUCCESS */}
          {compressionInfo && uploadPhase === 'DONE' && (
            <div className="flex items-center justify-between text-[11px] p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 animate-in fade-in">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {isRtl
                    ? `تم ضغط الملف بنجاح من ${compressionInfo.originalMb} MB إلى ${compressionInfo.compressedMb} MB`
                    : `Compressed from ${compressionInfo.originalMb} MB to ${compressionInfo.compressedMb} MB`}
                </span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black font-mono">
                -{compressionInfo.savedPercent}%
              </span>
            </div>
          )}

          {/* ERROR ALERT (e.g. 5 GB Storage Exceeded) */}
          {uploadError && (
            <div className="flex items-start gap-2 text-red-700 text-xs bg-red-50 p-3 rounded-2xl border-2 border-red-300 shadow-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-black block text-sm">{uploadError}</span>
                <span className="text-[11px] text-red-600 block">
                  {isRtl
                    ? 'الحد الأقصى المسموح به لرفع الملفات على السيرفر هو 5 جيجابايت. يُرجى مراجعة الملفات أو التواصل مع الدعم.'
                    : 'The total storage limit is 5 GB. Please contact the administrator.'}
                </span>
              </div>
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
                setCompressionInfo(null);
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
