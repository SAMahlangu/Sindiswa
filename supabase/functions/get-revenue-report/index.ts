import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const reqData = await req.json();
    const { startDate, endDate } = reqData;

    if (!startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: "Missing startDate or endDate" }),
        { status: 400 }
      );
    }

    // Get paid appointments in date range
    const { data: appointments, error: fetchError } = await supabase
      .from("appointments")
      .select(
        `
        id,
        deposit_amount,
        paid_at,
        created_at,
        services (
          name,
          price
        )
      `
      )
      .eq("status", "paid")
      .gte("paid_at", startDate)
      .lte("paid_at", endDate)
      .order("paid_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching appointments:", fetchError);
      return new Response("Error fetching revenue data", { status: 500 });
    }

    // Calculate revenue summary
    const totalRevenue = appointments!.reduce(
      (sum, apt) => sum + apt.deposit_amount,
      0
    );
    const totalBookings = appointments!.length;

    // Group by date
    const revenueByDate: Record<string, number> = {};
    appointments!.forEach((apt) => {
      const date = apt.paid_at?.split("T")[0] || "";
      if (date) {
        revenueByDate[date] = (revenueByDate[date] || 0) + apt.deposit_amount;
      }
    });

    // Group by service
    const revenueByService: Record<string, number> = {};

    appointments!.forEach((apt) => {
      const serviceName = apt.services?.name || "Unknown";
      revenueByService[serviceName] =
        (revenueByService[serviceName] || 0) + apt.deposit_amount;
    });

    return new Response(
      JSON.stringify({
        totalRevenue: totalRevenue.toFixed(2),
        totalBookings,
        averageBookingValue: (totalRevenue / totalBookings).toFixed(2),
        revenueByDate,
        revenueByService,
        dateRange: { startDate, endDate },
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Revenue report error:", error);
    return new Response("Internal server error", { status: 500 });
  }
});
