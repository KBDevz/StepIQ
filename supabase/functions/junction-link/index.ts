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

    // Check if user already has a Junction user ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('junction_user_id')
      .eq('id', user.id)
      .single();

    let junctionUserId = profile?.junction_user_id;

    // Create Junction user if needed
    if (!junctionUserId) {
      const createRes = await fetch(`${JUNCTION_BASE_URL}/v2/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-vital-api-key': JUNCTION_API_KEY,
        },
        body: JSON.stringify({ client_user_id: user.id }),
      });

      if (!createRes.ok) {
        const err = await createRes.text();
        return new Response(JSON.stringify({ error: 'Failed to create Junction user', details: err }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const junctionUser = await createRes.json();
      junctionUserId = junctionUser.user_id;

      // Store Junction user ID in profile
      await supabase
        .from('profiles')
        .update({ junction_user_id: junctionUserId })
        .eq('id', user.id);
    }

    // Generate link token
    const tokenRes = await fetch(`${JUNCTION_BASE_URL}/v2/link/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vital-api-key': JUNCTION_API_KEY,
      },
      body: JSON.stringify({ user_id: junctionUserId }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      return new Response(JSON.stringify({ error: 'Failed to generate link token', details: err }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const tokenData = await tokenRes.json();

    return new Response(JSON.stringify({
      link_token: tokenData.link_token,
      junction_user_id: junctionUserId,
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
