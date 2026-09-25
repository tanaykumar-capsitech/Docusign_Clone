using backend.Settings;
using Microsoft.Extensions.Options;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace backend.Services
{
    public class EmailService
    {
        private readonly EmailSettings emailSettings;

        public EmailService(IOptions<EmailSettings> settings)
        {
            emailSettings = settings.Value;
        }

        public async Task SendMail(string toEmail, string redirectUrlId)
        {
            var email = new MimeMessage();

            email.From.Add(MailboxAddress.Parse(emailSettings.From));
            email.To.Add(MailboxAddress.Parse(toEmail));

            email.Subject = "E-signature required";

            email.Body = new BodyBuilder
            {
                HtmlBody = $"""
                <html>
                    <body>
                        <p>Hello,</p>

                        <p>You have a document waiting for your signature.</p>

                        <p>
                            <a href="http://localhost:5173/serviceDetails/{redirectUrlId}">Click here</a>
                            to view and sign the document.
                        </p>

                        <p>Thank you.</p>
                    </body>
                </html>
                """
            }.ToMessageBody();

            using SmtpClient client = new SmtpClient();

            Console.WriteLine("1. SendEmail started");

            await client.ConnectAsync(
                emailSettings.Host, 
                emailSettings.Port, 
                SecureSocketOptions.StartTls
            );

            Console.WriteLine("2. Conneceted");

            await client.AuthenticateAsync(
                emailSettings.Username, 
                emailSettings.Password
            );

            Console.WriteLine("3. Authenticated");

            await client.SendAsync(email);

            await client.DisconnectAsync(true);

            Console.WriteLine("4. Sent");
        }
    }
}
