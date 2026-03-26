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

  const { orderId } = req.body;

  try {
    const accessToken = await getPayPalAccessToken();

    const captureResponse = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (captureResponse.data.status === "COMPLETED") {
      return res.status(200).json({
        success: true,
        paymentId: captureResponse.data.id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }
  } catch (error) {
    console.error(
      "PayPal capture error:",
      error.response?.data || error.message,
    );
    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
}
