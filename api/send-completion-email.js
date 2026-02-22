const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, orderNumber, hasFile, hasText } = req.body;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `Your Order is Ready! - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: white; padding: 30px; text-align: center; border-radius: 8px;">
            <h1 style="margin: 0;">✅ Your Order is Complete!</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 8px; margin-top: 20px;">
            <p>Great news! Your humanized content is ready.</p>
            
            <div style="background: #e8f5e9; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #27ae60;">
              <h2 style="color: #27ae60; margin-top: 0;">Order #${orderNumber}</h2>
              <p><strong>✓ Quality checked</strong></p>
              <p><strong>✓ 0% AI detection guaranteed</strong></p>
              <p><strong>✓ Fact-checked and verified</strong></p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.SITE_URL || "http://localhost:3003"}/order-completed/${orderNumber}" 
                 style="display: inline-block; background: #50ADB5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                View & Download Your Content
              </a>
            </div>
            
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <strong>Need a revision?</strong> Reply to this email within 7 days.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
