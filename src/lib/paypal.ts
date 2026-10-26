// PayPal REST API Integration Utility for ABEER GAD Academy
// Handles sandbox & production environments with clean verification

const getPayPalApiBase = () => {
  const mode = (process.env.PAYPAL_MODE || 'live').replace(/['"]/g, '').trim().toLowerCase();
  return mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
};

/**
 * Generate PayPal OAuth2 Client Access Token
 */
export async function getPayPalAccessToken(): Promise<string | null> {
  const clientId = (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '').replace(/['"]/g, '').trim();
  const clientSecret = (process.env.PAYPAL_CLIENT_SECRET || '').replace(/['"]/g, '').trim();

  if (!clientId || !clientSecret || clientId === 'test_client_id') {
    return null; // Signals sandbox simulation mode
  }

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const apiBase = getPayPalApiBase();
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
