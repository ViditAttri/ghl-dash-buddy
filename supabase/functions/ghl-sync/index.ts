import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GHL_API_KEY = Deno.env.get('GHL_API_KEY');
    const GHL_LOCATION_ID = Deno.env.get('GHL_LOCATION_ID');

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      throw new Error('GHL credentials not configured');
    }

    const { action, data } = await req.json();

    const baseUrl = 'https://services.leadconnectorhq.com';
    const headers = {
      'Authorization': `Bearer ${GHL_API_KEY}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    };

    let response;
    let result;

    switch (action) {
      case 'get_contacts':
        response = await fetch(`${baseUrl}/contacts/?locationId=${GHL_LOCATION_ID}&limit=${data?.limit || 20}`, {
          method: 'GET',
          headers,
        });
        result = await response.json();
        break;

      case 'get_appointments':
        const startDate = data?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = data?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        response = await fetch(`${baseUrl}/calendars/events?locationId=${GHL_LOCATION_ID}&startTime=${startDate}&endTime=${endDate}`, {
          method: 'GET',
          headers,
        });
        result = await response.json();
        break;

      case 'get_pipelines':
        response = await fetch(`${baseUrl}/opportunities/pipelines?locationId=${GHL_LOCATION_ID}`, {
          method: 'GET',
          headers,
        });
        result = await response.json();
        break;

      case 'get_opportunities':
        response = await fetch(`${baseUrl}/opportunities/search?locationId=${GHL_LOCATION_ID}&limit=${data?.limit || 20}`, {
          method: 'GET',
          headers,
        });
        result = await response.json();
        break;

      case 'get_stats':
        // Fetch contacts count
        const contactsRes = await fetch(`${baseUrl}/contacts/?locationId=${GHL_LOCATION_ID}&limit=1`, {
          method: 'GET',
          headers,
        });
        const contactsData = await contactsRes.json();

        // Fetch opportunities
        const oppsRes = await fetch(`${baseUrl}/opportunities/search?locationId=${GHL_LOCATION_ID}&limit=100`, {
          method: 'GET',
          headers,
        });
        const oppsData = await oppsRes.json();

        // Fetch appointments
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const appointmentsRes = await fetch(`${baseUrl}/calendars/events?locationId=${GHL_LOCATION_ID}&startTime=${thirtyDaysAgo}&endTime=${thirtyDaysLater}`, {
          method: 'GET',
          headers,
        });
        const appointmentsData = await appointmentsRes.json();

        // Calculate stats from opportunities
        const opportunities = oppsData.opportunities || [];
        const totalValue = opportunities.reduce((sum: number, opp: any) => sum + (opp.monetaryValue || 0), 0);
        const wonOpps = opportunities.filter((opp: any) => opp.status === 'won');
        const conversionRate = opportunities.length > 0 ? (wonOpps.length / opportunities.length) * 100 : 0;

        result = {
          totalContacts: contactsData.meta?.total || 0,
          totalOpportunities: opportunities.length,
          totalValue,
          conversionRate: conversionRate.toFixed(1),
          recentContacts: (contactsData.contacts || []).slice(0, 5),
          pipelineData: opportunities,
          appointments: appointmentsData.events || [],
        };
        break;

      case 'test_connection':
        response = await fetch(`${baseUrl}/locations/${GHL_LOCATION_ID}`, {
          method: 'GET',
          headers,
        });
        result = await response.json();
        
        if (response.ok) {
          result = { success: true, location: result };
        } else {
          throw new Error(result.message || 'Connection failed');
        }
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log(`GHL API ${action} completed successfully`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('GHL API Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
