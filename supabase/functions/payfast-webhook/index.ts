import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";
import * as crypto from "https://deno.land/std@0.208.0/crypto/mod.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const payfastMerchantId = Deno.env.get("PAYFAST_MERCHANT_ID");
const payfastMerchantKey = Deno.env.get("PAYFAST_MERCHANT_KEY");

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

// Calculate PayFast MD5 signature
async function calculateSignature(data: Record<string, string>): Promise<string> {
  const sorted: Record<string, string> = {};
  Object.keys(data)
    .sort()
    .forEach((key) => {
      sorted[key] = data[key];
    });

  let string = "";
  for (const key in sorted) {
    string += `${key}=${sorted[key]}&`;
  }
  string += `passphrase=${payfastMerchantKey}`;

  const encoder = new TextEncoder();
  const data_view = encoder.encode(string);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data_view);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const formData = await req.formData();
    const data: Record<string, string> = {};
    const signature = formData.get("signature") as string;

    // Extract form data
    formData.forEach((value, key) => {
      if (key !== "signature") {
        data[key] = value as string;
      }
    });

    // Verify signature
    const calculatedSignature = await calculateSignature(data);
    if (calculatedSignature !== signature) {
      console.error("Invalid PayFast signature");
      return new Response("Invalid signature", { status: 400 });
    }

    const appointmentId = data.custom_str1;
    const payfastReference = data.pf_payment_id;
    const amountGross = parseFloat(data.amount_gross);
    const paymentStatus = data.payment_status;

    // Update appointment based on payment status
    if (paymentStatus === "COMPLETE") {
      const { error: updateError } = await supabase
        .from("appointments")
        .update({
          status: "paid",
          payfast_reference: payfastReference,
          paid_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);

      if (updateError) {
        console.error("Error updating appointment:", updateError);
        return new Response("Error updating appointment", { status: 500 });
      }

      // Log payment
      await supabase.from("payment_logs").insert({
        appointment_id: appointmentId,
        payfast_reference: payfastReference,
        amount: amountGross,
        currency: "ZAR",
        status: "success",
        response_data: data,
      });

      // Send confirmation email
      await sendConfirmationEmail(appointmentId);
    } else if (paymentStatus === "FAILED") {
      const { error: updateError } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId);

      if (updateError) {
        console.error("Error updating appointment:", updateError);
      }

      // Log failed payment
      await supabase.from("payment_logs").insert({
        appointment_id: appointmentId,
        payfast_reference: payfastReference,
        amount: amountGross,
        currency: "ZAR",
        status: "failed",
        response_data: data,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Internal server error", { status: 500 });
  }
});

async function sendConfirmationEmail(appointmentId: string) {
  try {
    // Get appointment details
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("*, services(name)")
      .eq("id", appointmentId)
      .single();

    if (fetchError || !appointment) {
      console.error("Error fetching appointment:", fetchError);
      return;
    }

    // Here you would integrate with an email service like SendGrid or Resend
    // For now, we log the email that would be sent
    console.log(`Confirmation email would be sent to ${appointment.client_email}`);

    // Log the email attempt
    await supabase.from("email_logs").insert({
      appointment_id: appointmentId,
      email_type: "confirmation",
      recipient_email: appointment.client_email,
      sent_at: new Date().toISOString(),
      status: "sent",
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}
