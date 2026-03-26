const axios = require("axios");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    // Get access token
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`,
    ).toString("base64");

    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    );

    const accessToken = tokenResponse.data.access_token;

    // Generate timestamp and password
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`,
    ).toString("base64");

    // Query transaction status
    const statusResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: id,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const resultCode = statusResponse.data.ResultCode;

    if (resultCode === "0") {
      return res.status(200).json({ status: "completed" });
    } else if (resultCode === "1032") {
      return res.status(200).json({ status: "cancelled" });
    } else {
      return res.status(200).json({ status: "pending" });
    }
  } catch (error) {
    console.error("Status check error:", error.response?.data || error.message);
    return res.status(200).json({ status: "pending" });
  }
}
