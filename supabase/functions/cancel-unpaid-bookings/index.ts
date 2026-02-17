import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

serve(async (req: Request) => {
  // Verify the request is from cron (optional - add auth header check here)
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Get current timestamp
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Find pending appointments older than 1 hour
    const { data: pendingAppointments, error: fetchError } = await supabase
      .from("appointments")
      .select("id")
      .eq("status", "pending")
      .lt("created_at", oneHourAgo.toISOString());

    if (fetchError) {
      console.error("Error fetching pending appointments:", fetchError);
      return new Response("Error fetching appointments", { status: 500 });
    }

    console.log(
      `Found ${pendingAppointments?.length || 0} appointments to cancel`
    );

    // Cancel unpaid appointments
    if (pendingAppointments && pendingAppointments.length > 0) {
      const appointmentIds = pendingAppointments.map((apt) => apt.id);

      const { error: updateError } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .in("id", appointmentIds);

      if (updateError) {
        console.error("Error cancelling appointments:", updateError);
        return new Response("Error cancelling appointments", { status: 500 });
      }

      console.log(`Successfully cancelled ${appointmentIds.length} appointments`);

      return new Response(
        JSON.stringify({
          success: true,
          cancelledCount: appointmentIds.length,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(JSON.stringify({ success: true, cancelledCount: 0 }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Scheduled task error:", error);
    return new Response("Internal server error", { status: 500 });
  }
});
