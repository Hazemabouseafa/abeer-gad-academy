// PayPal REST API Integration Utility for ABEER GAD Academy
// Handles sandbox & production environments with clean verification & dynamic Admin Settings

import { getSiteSettings } from './data-store';

export function getPayPalConfig() {
  try {
    const settings = getSiteSettings();
    const clientId = (settings.paypalClientId || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '')
      .replace(/['"]/g, '')
      .trim();
    const clientSecret = (settings.paypalClientSecret || process.env.PAYPAL_CLIENT_SECRET || '')
      .replace(/['"]/g, '')
      .trim();
    const rawMode = (settings.paypalMode || process.env.PAYPAL_MODE || 'live')
      .replace(/['"]/g, '')
      .trim()
      .toLowerCase();
    const mode: 'live' | 'sandbox' = rawMode === 'sandbox' ? 'sandbox' : 'live';
    const apiBase = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    return { clientId, clientSecret, mode, apiBase };
  } catch {
    const rawMode = (process.env.PAYPAL_MODE || 'live').replace(/['"]/g, '').trim().toLowerCase();
    const mode: 'live' | 'sandbox' = rawMode === 'sandbox' ? 'sandbox' : 'live';
    return {
      clientId: (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '').replace(/['"]/g, '').trim(),
      clientSecret: (process.env.PAYPAL_CLIENT_SECRET || '').replace(/['"]/g, '').trim(),
      mode,
      apiBase: mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com',
    };
  }
}

const getPayPalApiBase = () => getPayPalConfig().apiBase;

/**
 * Generate PayPal OAuth2 Client Access Token
 */
export async function getPayPalAccessToken(): Promise<string | null> {
  const { clientId, clientSecret, apiBase } = getPayPalConfig();

  if (!clientId || !clientSecret || clientId === 'test_client_id') {
    return null; // Signals sandbox simulation mode
  }

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch(`${apiBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      console.error('Failed to authenticate with PayPal API:', await response.text());
      return null;
    }

    const data = await response.json();
    return data.access_token as string;
  } catch (error) {
    console.error('PayPal OAuth error:', error);
    return null;
  }
}

/**
 * Verify PayPal Credentials directly (used by Admin Dashboard Test Connection button)
 */
export async function verifyPayPalCredentials(
  customClientId?: string,
  customClientSecret?: string,
  customMode?: 'live' | 'sandbox'
): Promise<{ valid: boolean; mode: string; appId?: string; error?: string }> {
  const config = getPayPalConfig();
  const clientId = (customClientId ?? config.clientId).replace(/['"]/g, '').trim();
  const clientSecret = (customClientSecret ?? config.clientSecret).replace(/['"]/g, '').trim();
  const mode = customMode ?? config.mode;
  const apiBase = mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

  if (!clientId || !clientSecret) {
    return {
      valid: false,
      mode,
      error: 'يرجى إدخال كل من Client ID و Secret Key.',
    };
  }

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch(`${apiBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        valid: false,
        mode,
        error: `فشل المصادقة مع خوادم PayPal (${mode.toUpperCase()}): تأكد من صحة المفاتيح ومطابقتها للوضع المختار. (${errText})`,
      };
    }

    const data = await response.json();
    return {
      valid: Boolean(data.access_token),
      mode,
      appId: data.app_id,
    };
  } catch (err) {
    return {
      valid: false,
      mode,
      error: err instanceof Error ? err.message : 'حدث خطأ أثناء الاتصال بخوادم PayPal.',
    };
  }
}

/**
 * Create a PayPal Order
 */
export async function createPayPalOrder({
  amount,
  currency = 'USD',
  description,
  customId,
}: {
  amount: number | string;
  currency?: string;
  description: string;
  customId?: string;
}) {
  const accessToken = await getPayPalAccessToken();

  // If live credentials are not set, return simulated sandbox order
  if (!accessToken) {
    return {
      id: `SIM_PAYPAL_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: 'CREATED',
      simulated: true,
      amount: String(amount),
      currency,
    };
  }

  const apiBase = getPayPalApiBase();
  const response = await fetch(`${apiBase}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: customId,
          description: description.substring(0, 127),
          amount: {
            currency_code: currency,
            value: Number(amount).toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: 'ABEER GAD Academy',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`PayPal Order Creation Failed: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

/**
 * Capture payment for an approved order
 */
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();

  // If order was simulated
  if (!accessToken || orderId.startsWith('SIM_PAYPAL_')) {
    return {
      id: orderId,
      status: 'COMPLETED',
      simulated: true,
      captureId: `SIM_CAP_${Date.now()}`,
    };
  }

  const apiBase = getPayPalApiBase();
  const response = await fetch(
    `${apiBase}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`PayPal Capture Failed: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}
