const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
);

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderNumber } = req.query;

  if (!orderNumber) {
    return res.status(400).json({ error: "Order number required" });
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Track order error:", error);
    return res.status(500).json({ error: error.message });
  }
};
