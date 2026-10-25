'use client';

import { useEffect, useRef } from 'react';
import { X, Play } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string;
  instructor?: string;
}

export function VideoModal({
  isOpen,
  onClose,
  title,
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ', // default demo stream
  instructor = 'Ustadha Abeer Gad',
}: VideoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (dialog.open) {
        dialog.close();
        document.body.style.overflow = '';
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="backdrop:bg-navy-950/40 backdrop:backdrop-blur-sm p-0 rounded-2xl border border-surface-border bg-white shadow-card-elevated max-w-3xl w-[92vw] overflow-hidden m-auto z-50 animate-fadeIn"
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-borderSubtle bg-[#FAF8F5]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-navy-900 line-clamp-1">
              {title}
            </h3>
            <span className="text-[11px] text-navy-500">{instructor}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-navy-500 hover:text-navy-900 hover:bg-surface-muted transition-colors"
          aria-label="Close video player"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="aspect-video w-full bg-navy-950 relative flex items-center justify-center">
        {/* Responsive Video Container */}
        <iframe
          src="https://www.youtube-nocookie.com/embed/1vR_s4ZpBfc?autoplay=1"
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      <div className="p-4 bg-white flex items-center justify-between text-xs text-navy-600 border-t border-surface-borderSubtle">
        <span>ABEER GAD Academy HD Streaming Player</span>
        <span className="badge-light text-[11px]">Certified Lesson Preview</span>
      </div>
    </dialog>
  );
}
