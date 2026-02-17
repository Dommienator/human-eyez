const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const orderData = req.body;

  try {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 100000);
    const orderNumber = `HE${new Date().getFullYear()}${random}${String(timestamp).slice(-6)}`;

    const { data, error } = await supabase
      .from("orders")
      .insert([{ ...orderData, order_number: orderNumber }])
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ error: error.message });
  }
};
