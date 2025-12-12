import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYNCPAYMENTS_BASE_URL = 'https://api.syncpayments.com.br';

// Cache for token
let cachedToken: { token: string; expiresAt: Date } | null = null;

async function getAuthToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && new Date() < cachedToken.expiresAt) {
    console.log('Using cached auth token');
    return cachedToken.token;
  }

  const clientId = Deno.env.get('SYNCPAYMENTS_CLIENT_ID');
  const clientSecret = Deno.env.get('SYNCPAYMENTS_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error('Missing SyncPayments credentials');
  }

  console.log('Requesting new auth token from SyncPayments...');

  const response = await fetch(`${SYNCPAYMENTS_BASE_URL}/api/partner/v1/auth-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Auth error:', errorText);
    throw new Error(`Authentication failed: ${response.status}`);
  }

  const data = await response.json();
  console.log('Auth successful, token expires in:', data.expires_in, 'seconds');

  // Cache the token (subtract 60 seconds for safety margin)
  cachedToken = {
    token: data.access_token,
    expiresAt: new Date(Date.now() + (data.expires_in - 60) * 1000),
  };

  return data.access_token;
}

async function createPixPayment(amount: number, userId: string, userName: string, userPhone: string): Promise<{ pix_code: string; identifier: string }> {
  const token = await getAuthToken();

  console.log('Creating PIX payment for amount:', amount);

  const response = await fetch(`${SYNCPAYMENTS_BASE_URL}/api/partner/v1/cash-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount: amount,
      description: `Depósito BolaCup - ${userName}`,
      webhook_url: 'https://ahxcjdpgnodesgxqksss.supabase.co/functions/v1/pix-webhook',
      client: {
        name: userName,
        cpf: '00000000000', // Placeholder - ideally collect from user
        email: `${userPhone}@bolacup.app`,
        phone: userPhone.replace(/\D/g, ''),
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Create payment error:', errorText);
    throw new Error(`Failed to create payment: ${response.status}`);
  }

  const data = await response.json();
  console.log('Payment created successfully, identifier:', data.identifier);

  return {
    pix_code: data.pix_code,
    identifier: data.identifier,
  };
}

async function checkPaymentStatus(identifier: string): Promise<{ status: string; amount: number }> {
  const token = await getAuthToken();

  console.log('Checking payment status for identifier:', identifier);

  const response = await fetch(`${SYNCPAYMENTS_BASE_URL}/api/partner/v1/transaction/${identifier}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Check status error:', errorText);
    throw new Error(`Failed to check status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Payment status:', data.data?.status);

  return {
    status: data.data?.status || 'unknown',
    amount: data.data?.amount || 0,
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, amount, userId, userName, userPhone, identifier } = await req.json();

    console.log('PIX Payment action:', action);

    if (action === 'create') {
      if (!amount || !userId || !userName || !userPhone) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: amount, userId, userName, userPhone' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await createPixPayment(amount, userId, userName, userPhone);
      
      return new Response(
        JSON.stringify({ success: true, ...result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'check-status') {
      if (!identifier) {
        return new Response(
          JSON.stringify({ error: 'Missing identifier' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await checkPaymentStatus(identifier);
      
      return new Response(
        JSON.stringify({ success: true, ...result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use "create" or "check-status"' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('PIX Payment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
