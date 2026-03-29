// Supabase Edge Function: notify-low-stock
// Sends a "Low Stock Alert" email via Resend when inventory drops below threshold.
//
// Deploy: This function is automatically deployed by Lovable.
// Secrets required (set in Supabase Dashboard > Settings > Edge Functions):
//   - RESEND_API_KEY: Your Resend API key from https://resend.com/api-keys

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

    // Retrieve Resend API key
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY secret is not configured");
    }

    const adminEmail = settings.admin_phone; // field reused for admin email

    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Inventory Alerts <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `⚠️ Low Stock Alert: ${record.product_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #dc2626; margin-bottom: 16px;">⚠️ Low Stock Alert</h2>
            <p style="color: #374151; font-size: 16px;">A product in your inventory has dropped below the alert threshold.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background: #f9fafb;">
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Product</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; color: #111827;">${record.product_name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;">SKU</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; color: #111827;">${record.sku}</td>
              </tr>
              <tr style="background: #f9fafb;">
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Current Quantity</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; color: #dc2626; font-weight: 700;">${record.quantity}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Threshold</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; color: #111827;">${settings.alert_threshold}</td>
              </tr>
            </table>
            <p style="color: #6b7280; font-size: 14px;">Please restock this item as soon as possible.</p>
          </div>
        `,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(`Resend API error [${response.status}]:`, JSON.stringify(result));
      throw new Error(`Resend API call failed [${response.status}]: ${JSON.stringify(result)}`);
    }

    console.log("Email alert sent successfully:", JSON.stringify(result));

    return new Response(JSON.stringify({ success: true, email: result }), {
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
