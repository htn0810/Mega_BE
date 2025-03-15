import { env } from "@configs/environments";
import { InternalServerError } from "@exceptions/InternalServerError";
const brevo = require("@getbrevo/brevo");

class BrevoProvider {
  private apiInstance;
  private apiKey;
  constructor() {
    this.apiInstance = new brevo.TransactionalEmailsApi();
    this.apiKey = this.apiInstance.authentications["apiKey"];
    this.apiKey.apiKey = env.BREVO_API_KEY;
  }

  async sendEmail(recipientEmails: string[], subject: string, content: string) {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = content;
    sendSmtpEmail.sender = {
      name: env.ADMIN_EMAIL_NAME,
      email: env.ADMIN_EMAIL_ADDRESS,
    };

    sendSmtpEmail.to = recipientEmails.map((email) => ({ email }));

    return this.apiInstance.sendTransacEmail(sendSmtpEmail);
  }
}

const brevoProvider = new BrevoProvider();

export default brevoProvider;
