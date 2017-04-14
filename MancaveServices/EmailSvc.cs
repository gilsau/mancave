using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mancave.MancaveServices
{
    public static class EmailSvc
    {
        public static bool SendMail(string subject, string body, string from, string to, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            //Prepare email
            System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage(from, to, subject, body);
            message.Priority = System.Net.Mail.MailPriority.Normal;

            System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient();
            client.Host = Properties.Settings.Default.SMTP_Host;

            //THIS NEXT FOUR LINES ARE IN CASE YOU NEED MORE CONTROL OVER SPECIFICS AND CANNOT USE THE web.config FILE OPTION
            //PASSWORD SHOULD BE SEEN AS A SECURITY RISK SO USING ENCRIPTION WOULD BE IDEAL - THESE ARE ALL HANDLED BY web.config INCLUDING THE client.Credentials LINE. SWEET STUFF IMHO.
            System.Net.NetworkCredential netwrkCrd = new System.Net.NetworkCredential();
            netwrkCrd.UserName = Properties.Settings.Default.SMTP_Username;
            netwrkCrd.Password = Properties.Settings.Default.SMTP_Password;
            client.Credentials = netwrkCrd;

            //Send email
            try
            {
                client.Send(message);
            }
            catch (Exception ex)
            {
                scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was a problem sending email.";
            }

            //Log error
            if (!string.IsNullOrEmpty(scr.MessageForLog)) LogSvc.LogError(scr.MessageForLog);

            return scr.Success;
        }
    }
}
