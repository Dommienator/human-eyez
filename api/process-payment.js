const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderNumber, paymentMethod, paymentDetails } = req.body;

  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "pending",
        payment_method: paymentMethod,
      })
      .eq("order_number", orderNumber)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ success: true, order: data });
  } catch (error) {
    console.error("Process payment error:", error);
    return res.status(500).json({ error: error.message });
  }
};
