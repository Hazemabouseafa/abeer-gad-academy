import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import {
  getCourses,
  getSlots,
  getResources,
  getTransactions,
  getStudents,
  getSiteSettings,
} from '@/lib/data-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const startTime = Date.now();

  // 1. Check Local Persistent Store
  let storeHealth: {
    status: 'HEALTHY' | 'ERROR';
    writable: boolean;
    coursesCount: number;
    slotsCount: number;
    resourcesCount: number;
    transactionsCount: number;
    studentsCount: number;
    error?: string;
  } = {
    status: 'HEALTHY',
    writable: false,
    coursesCount: 0,
    slotsCount: 0,
    resourcesCount: 0,
    transactionsCount: 0,
    studentsCount: 0,
  };

  try {
    const dataDir = path.join(process.cwd(), 'data');
    const storeFile = path.join(dataDir, 'academy-store.json');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Test write permission with a tiny temporary check
    const testFile = path.join(dataDir, `.write-test-${Date.now()}`);
    fs.writeFileSync(testFile, 'ok', 'utf8');
    fs.unlinkSync(testFile);
    storeHealth.writable = true;

    storeHealth.coursesCount = getCourses().length;
    storeHealth.slotsCount = getSlots().length;
    storeHealth.resourcesCount = getResources().length;
    storeHealth.transactionsCount = getTransactions().length;
    storeHealth.studentsCount = getStudents().length;
  } catch (err: unknown) {
    storeHealth.status = 'ERROR';
    storeHealth.error = err instanceof Error ? err.message : String(err);
  }

  // 2. Check Uploads Directory
  let uploadsHealth: {
    status: 'HEALTHY' | 'ERROR';
    writable: boolean;
    path: string;
    error?: string;
  } = {
    status: 'HEALTHY',
    writable: false,
    path: 'public/uploads',
  };

  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const testUpload = path.join(uploadsDir, `.test-${Date.now()}`);
    fs.writeFileSync(testUpload, 'ok', 'utf8');
    fs.unlinkSync(testUpload);
    uploadsHealth.writable = true;
  } catch (err: unknown) {
    uploadsHealth.status = 'ERROR';
    uploadsHealth.error = err instanceof Error ? err.message : String(err);
  }

  // 3. Check PostgreSQL / Prisma
  const hasDbUrl = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());
  let postgresHealth: {
    configured: boolean;
    status: 'CONNECTED' | 'STANDALONE_FALLBACK' | 'UNREACHABLE';
    latencyMs?: number;
    message: string;
  } = {
    configured: hasDbUrl,
    status: 'STANDALONE_FALLBACK',
    message: hasDbUrl
      ? 'PostgreSQL configured, validating connection...'
      : 'Standalone Persistent File Mode active (Ideal for Coolify volume storage).',
  };

  if (hasDbUrl) {
    const dbStart = Date.now();
    try {
      // Fast ping query
      await prisma.$queryRaw`SELECT 1`;
      postgresHealth.status = 'CONNECTED';
      postgresHealth.latencyMs = Date.now() - dbStart;
      postgresHealth.message = 'PostgreSQL connected and responsive.';
    } catch (err: unknown) {
      postgresHealth.status = 'UNREACHABLE';
      postgresHealth.message = err instanceof Error ? err.message : 'Database ping failed';
    }
  }

  // 4. Overall status
  const overallHealthy = storeHealth.status === 'HEALTHY' && uploadsHealth.status === 'HEALTHY';

  return NextResponse.json({
    success: true,
    status: overallHealthy ? 'ALL_SYSTEMS_OPERATIONAL' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    executionTimeMs: Date.now() - startTime,
    components: {
      primaryDataStore: storeHealth,
      uploadsStorage: uploadsHealth,
      postgresDatabase: postgresHealth,
    },
    recommendations: {
      coolifyPersistentStorage: 'Ensure /app/data and /app/public/uploads are mounted in Coolify Storages tab.',
      environment: process.env.NODE_ENV || 'development',
    },
  });
}
