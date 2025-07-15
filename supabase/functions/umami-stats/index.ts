import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    let startAt: string | null = null
    let endAt: string | null = null

    if (req.method === 'GET') {
      // Try to get from query params
      const { searchParams } = new URL(req.url)
      startAt = searchParams.get('startAt')
      endAt = searchParams.get('endAt')
    } else if (req.method === 'POST') {
      // Try to get from body
      const body = await req.json()
      startAt = body.startAt?.toString()
      endAt = body.endAt?.toString()
    }

    if (!startAt || !endAt) {
      return new Response(
        JSON.stringify({ error: 'Missing startAt or endAt parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const umamiUrl = `https://cloud.umami.is/api/websites/526d3380-1be8-4c29-bea9-27f3e76e887d/stats?startAt=${startAt}&endAt=${endAt}`
    
    const response = await fetch(umamiUrl, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer api_jNEKWAood5u6XadDpIhbBbh7ayAeECY8'
      }
    })

    if (!response.ok) {
      console.error('Umami API error:', response.status, response.statusText)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch Umami data' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    
    return new Response(
      JSON.stringify(data),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error fetching Umami stats:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})