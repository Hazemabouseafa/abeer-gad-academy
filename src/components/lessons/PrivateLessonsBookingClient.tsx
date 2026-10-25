'use client';

import React from 'react';
import { FullInteractiveCalendar } from './FullInteractiveCalendar';

interface PrivateLessonsBookingClientProps {
  currentLocale: string;
  initialSlotId?: string;
  initialDate?: string;
}

export function PrivateLessonsBookingClient({
  currentLocale,
  initialSlotId,
}: PrivateLessonsBookingClientProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <FullInteractiveCalendar
        currentLocale={currentLocale}
        initialSlotId={initialSlotId}
      />
    </div>
  );
}
