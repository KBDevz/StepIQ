import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const JUNCTION_API_KEY = Deno.env.get('JUNCTION_API_KEY') ?? '';
const JUNCTION_BASE_URL = Deno.env.get('JUNCTION_BASE_URL') ?? 'https://api.sandbox.us.junction.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { junction_user_id } = await req.json();
    if (!junction_user_id) {
      return new Response(JSON.stringify({ error: 'Missing junction_user_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Query last 5 minutes of HR data
    const now = new Date();
    const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const startDate = fiveMinAgo.toISOString().split('T')[0];
    const endDate = now.toISOString().split('T')[0];

    const hrRes = await fetch(
      `${JUNCTION_BASE_URL}/v2/timeseries/${junction_user_id}/heartrate/grouped?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: { 'x-vital-api-key': JUNCTION_API_KEY },
      },
    );

    if (!hrRes.ok) {
      const err = await hrRes.text();
      return new Response(JSON.stringify({ error: 'Failed to fetch HR data', details: err }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const hrData = await hrRes.json();

    // Extract the most recent HR sample
    let latestHR: number | null = null;
    let latestTimestamp: string | null = null;

    if (hrData.groups && Array.isArray(hrData.groups)) {
      for (const group of hrData.groups) {
        if (group.data && Array.isArray(group.data)) {
          for (const sample of group.data) {
            if (sample.timestamp && sample.value) {
              if (!latestTimestamp || sample.timestamp > latestTimestamp) {
                latestTimestamp = sample.timestamp;
                latestHR = Math.round(sample.value);
              }
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({
      hr: latestHR,
      timestamp: latestTimestamp,
      source: 'wearable',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal error', details: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
