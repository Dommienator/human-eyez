const axios = require("axios");

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.REACT_APP_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await axios.post(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    },
  );

  return response.data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount } = req.body;

  try {
    const accessToken = await getPayPalAccessToken();

    const orderResponse = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toFixed(2),
            },
          },
        ],
        application_context: {
          return_url: `${process.env.SITE_URL || "https://human-eyez.vercel.app"}/payment-success`,
          cancel_url: `${process.env.SITE_URL || "https://human-eyez.vercel.app"}/payment`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const approveLink = orderResponse.data.links.find(
      (link) => link.rel === "approve",
    );

    return res.status(200).json({
      success: true,
      orderId: orderResponse.data.id,
      approveUrl: approveLink.href,
    });
  } catch (error) {
    console.error("PayPal error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
}
