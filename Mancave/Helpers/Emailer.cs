using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Mancave.Models;
using System.Net.Mail;
 
namespace Mancave.Helpers
{
    public static class Emailer
    {
        public static bool SendMail(string subject, string body, string fromAddress, string fromName, string toAddress, out Result scr)
        {
            scr = new Result();

            //Prepare email
            MailMessage message = new MailMessage();
            message.From = new MailAddress(fromAddress, fromName);
            message.To.Add(toAddress);
            message.Subject = subject;
            message.Body = body;
            message.IsBodyHtml = true;

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
                scr.Success = true;
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