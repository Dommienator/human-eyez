const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phoneNumber, amount, orderNumber } = req.body;

  try {
    // Get OAuth token
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`,
    ).toString("base64");

    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      },
    );

    const accessToken = tokenResponse.data.access_token;

    // Format phone number (remove leading 0, add 254)
    const formattedPhone = phoneNumber.startsWith("0")
      ? "254" + phoneNumber.slice(1)
      : phoneNumber;

    // Generate timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`,
    ).toString("base64");

    // STK Push request
    const stkResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: orderNumber,
        TransactionDesc: `HumanEyez Order ${orderNumber}`,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    res.status(200).json({
      success: true,
      message: "STK Push sent",
      data: stkResponse.data,
    });
  } catch (error) {
    console.error("M-Pesa error:", error.response?.data || error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.errorMessage || error.message,
    });
  }
}
