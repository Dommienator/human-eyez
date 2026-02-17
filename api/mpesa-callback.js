const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { Body } = req.body;

  if (Body.stkCallback.ResultCode === 0) {
    // Payment successful
    const accountReference = Body.stkCallback.CallbackMetadata.Item.find(
      (item) => item.Name === "AccountReference",
    ).Value;

    await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "pending",
        payment_method: "mpesa",
      })
      .eq("order_number", accountReference);

    console.log("M-Pesa payment confirmed:", accountReference);
  }

  res.status(200).json({ message: "Callback received" });
}
