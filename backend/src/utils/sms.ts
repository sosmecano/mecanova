import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendSms(phone: string, message: string): Promise<void> {
  if (client && fromNumber) {
    try {
      await client.messages.create({
        body: message,
        from: fromNumber,
        to: phone,
      });
      return;
    } catch (err) {
      console.error('[SMS] Twilio error:', err);
    }
  }
  console.log(`[DEV] SMS to ${phone}: ${message}`);
}
