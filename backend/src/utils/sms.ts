const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_FROM_NUMBER;

const orangeClientId = process.env.ORANGE_CLIENT_ID;
const orangeClientSecret = process.env.ORANGE_CLIENT_SECRET;
const orangeSender = process.env.ORANGE_SENDER_ADDRESS || 'Mecanova';

let twilioClient: any = null;
if (twilioAccountSid && twilioAuthToken) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(twilioAccountSid, twilioAuthToken);
  } catch { }
}

let orangeToken: { access_token: string; expires_at: number } | null = null;

async function getOrangeToken(): Promise<string | null> {
  if (orangeToken && orangeToken.expires_at > Date.now()) return orangeToken.access_token;
  if (!orangeClientId || !orangeClientSecret) return null;
  try {
    const res = await fetch('https://api.orange.com/oauth/v3/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${orangeClientId}:${orangeClientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const data = await res.json() as any;
    if (data.access_token) {
      orangeToken = { access_token: data.access_token, expires_at: Date.now() + (data.expires_in || 3600) * 1000 };
      return data.access_token;
    }
  } catch { }
  return null;
}

async function sendViaOrange(phone: string, message: string): Promise<boolean> {
  const token = await getOrangeToken();
  if (!token) return false;
  try {
    const res = await fetch(`https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B${orangeSender}/requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        outboundSMSMessageRequest: {
          address: `tel:${phone}`,
          senderAddress: `tel:+${orangeSender}`,
          outboundSMSTextMessage: { message },
        },
      }),
    });
    return res.ok;
  } catch { return false; }
}

async function sendViaTwilio(phone: string, message: string): Promise<boolean> {
  if (!twilioClient || !twilioFrom) return false;
  try {
    await twilioClient.messages.create({ body: message, from: twilioFrom, to: phone });
    return true;
  } catch (err) {
    console.error('[SMS] Twilio error:', err);
    return false;
  }
}

export async function sendSms(phone: string, message: string): Promise<void> {
  if (await sendViaOrange(phone, message)) return;
  if (await sendViaTwilio(phone, message)) return;
  console.log(`[DEV] SMS to ${phone}: ${message}`);
}
