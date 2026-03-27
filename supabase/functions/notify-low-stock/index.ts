// Supabase Edge Function: notify-low-stock
// Sends a WhatsApp "Low Stock Alert" via Meta Graph API when inventory drops below threshold.
//
// Deploy: This function is automatically deployed by Lovable.
// Secrets required (set in Supabase Dashboard > Settings > Edge Functions):
//   - WHATSAPP_TOKEN: Meta WhatsApp Business API bearer token
//   - PHONE_NUMBER_ID: Your WhatsApp Business phone number ID from Meta

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InventoryPayload {
  id: string;
  product_name: string;
  sku: string;
  quantity: number;
  user_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record } = (await req.json()) as { record: InventoryPayload };

    if (!record) {
      return new Response(JSON.stringify({ error: "No record provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a service-role Supabase client to read settings
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch alert settings for the product owner
    const { data: settings, error: settingsError } = await supabase
      .from("app_settings")
      .select("*")
      .eq("user_id", record.user_id)
      .single();

    if (settingsError || !settings) {
      console.log("No settings found for user, skipping alert.");
      return new Response(JSON.stringify({ skipped: true, reason: "no_settings" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if alerts are enabled and quantity is at or below threshold
    if (!settings.alerts_enabled || record.quantity > settings.alert_threshold) {
      console.log(
        `Alert skipped: enabled=${settings.alerts_enabled}, qty=${record.quantity}, threshold=${settings.alert_threshold}`
      );
      return new Response(JSON.stringify({ skipped: true, reason: "not_triggered" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Retrieve WhatsApp API credentials from secrets
    const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN");
    if (!WHATSAPP_TOKEN) {
      throw new Error("WHATSAPP_TOKEN secret is not configured");
    }

    const PHONE_NUMBER_ID = Deno.env.get("PHONE_NUMBER_ID");
    if (!PHONE_NUMBER_ID) {
      throw new Error("PHONE_NUMBER_ID secret is not configured");
    }

    // Format phone number: remove any non-digit chars except leading +
    const adminPhone = settings.admin_phone.replace(/[^\d]/g, "");

    // Send WhatsApp template message via Meta Graph API
    const whatsappUrl = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

    const response = await fetch(whatsappUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: adminPhone,
        type: "template",
        template: {
          name: "low_stock_alert",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: record.product_name },
                { type: "text", text: record.sku },
                { type: "text", text: String(record.quantity) },
              ],
            },
          ],
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(`WhatsApp API error [${response.status}]:`, JSON.stringify(result));
      throw new Error(`WhatsApp API call failed [${response.status}]: ${JSON.stringify(result)}`);
    }

    console.log("WhatsApp alert sent successfully:", JSON.stringify(result));

    return new Response(JSON.stringify({ success: true, whatsapp: result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("notify-low-stock error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
