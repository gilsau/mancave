using System;
using System.Web;
using System.Linq;
using System.Collections.Generic;


namespace Mancave.MancaveServices
{
    public static class StatusSvc
    {
        private static MancaveEntities db = new MancaveEntities();

        public static HashSet<AccountStatus> GetAllAccountStatuses(out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            HashSet<AccountStatus> statuses = null;
            try
            {
                statuses = new HashSet<AccountStatus>(
                    from a in db.Accounts
                    select new AccountStatus() { AccountId = a.Id, Status = a.Status });

                scr.Success = true;
            }
            catch (Exception ex)
            {
                scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was a problem getting account statuses.";
            }

            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return statuses;
        }

        public static Status GetAccountStatus(int accountId, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            Status status = null;
            try
            {
                status = ((HashSet<AccountStatus>)HttpContext.Current.Application["AccountStatus"]).Where(stat => stat.AccountId == accountId).FirstOrDefault().Status;
                scr.Success = true;
            }
            catch (Exception ex)
            {
                scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was a problem getting a list of statuss.";
            }

            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return status;
        }

        public static bool UpdateAccountStatus(int accountId, StatusType statusType, HashSet<AccountStatus> appStatuses, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            MancaveEntities db = new MancaveEntities();

            try
            {
                //Save in database
                db.Accounts.Single(a => a.Id == accountId).StatusId = (int)statusType;
                db.SaveChanges();
                
                //Update in Application object
                appStatuses.Where(stat => stat.AccountId == accountId).FirstOrDefault().Status = db.Accounts.Single(a => a.Id == accountId).Status;
                
                scr.Success = true;
            }
            catch (Exception ex)
            {
                scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was a problem updating the status.";
            }

            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return scr.Success;
        }
    }
}