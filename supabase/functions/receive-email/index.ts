import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

interface EmailWebhookPayload {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  sender_name?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const payload: EmailWebhookPayload = await req.json();
    console.log("Received email webhook:", payload);

    const { to, from, subject, text, html, sender_name } = payload;

    // Extract email address from "Name <email@domain.com>" format
    const extractEmail = (emailString: string) => {
      if (!emailString || typeof emailString !== 'string') return null;
      const match = emailString.match(/<([^>]+)>/);
      if (match && match[1]) return match[1];
      return emailString.trim();
    };

    const recipientEmail = extractEmail(to);
    const senderEmail = extractEmail(from);

    console.log("Parsed recipient:", recipientEmail);
    console.log("Parsed sender:", senderEmail);

    // Check if the recipient email exists in our temp_emails table and is active
    const { data: tempEmail, error: findError } = await supabase
      .from('temp_emails')
      .select('id')
      .eq('email_address', recipientEmail)
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .maybeSingle();

    if (findError) {
      console.error("Error finding temp email:", findError);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!tempEmail) {
      console.log("No active temp email found for:", recipientEmail);
      return new Response(JSON.stringify({ message: "Email not found or expired" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Save the email message
    const { data, error: insertError } = await supabase
      .from('temp_email_messages')
      .insert([{
        temp_email_id: tempEmail.id,
        sender_email: senderEmail,
        sender_name: sender_name || null,
        subject: subject || "Brak tematu",
        body_text: text || null,
        body_html: html || null,
      }])
      .select()
      .single();

    if (insertError) {
      console.error("Error saving email message:", insertError);
      return new Response(JSON.stringify({ error: "Failed to save email" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Email saved successfully:", data);

    return new Response(JSON.stringify({ 
      message: "Email received and saved successfully",
      id: data.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error processing email webhook:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});