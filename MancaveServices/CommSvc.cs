using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mancave.MancaveServices
{
    public static class CommSvc
    {
        private static MancaveEntities db = new MancaveEntities();

        public static Communication GetMostRecentMessageByConversationId(Guid? conversationId, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            Account acctCurrent = (Account)HttpContext.Current.Session["User"];

            Communication comm = null;
            try
            {
                //Get messages for this conversation, to update their status to READ, omit message I've sent to other person
                comm = (from c in db.Communications
                        .Include("Account")
                        .Include("Account1")
                        where c.ConversationId == conversationId
                        select c).OrderByDescending(c => c.LastUpdated).Take(1).First();
                
                scr.Success = true;
            }
            catch (Exception ex)
            {
                scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was a problem getting the most recent message for the conversation.";
            }

            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return comm;
        }

        public static IList<Communication> GetMessagesByConversationId(Guid? conversationId, bool newMessages, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            Account acctCurrent = (Account)HttpContext.Current.Session["User"];

            IList<Communication> comms = null;
            try
            {
                //Get messages for this conversation
                if (newMessages)
                {
                    comms = (from c in db.Communications
                             .Include("Account")
                             .Include("Account1")
                             where c.ConversationId == conversationId
                             && c.ToAcctId == acctCurrent.Id
                             && c.StatusToId == (int)StatusType.New
                             select c).ToList();
                }
                else
                {
                    comms = (from c in db.Communications
                             .Include("Account")
                             .Include("Account1")
                             where c.ConversationId == conversationId
                             select c).ToList();
                }

                //Update status
                foreach (Communication comm in comms)
                {
                    comm.StatusToId = (int)StatusType.Read;
                }
                db.SaveChanges();

                scr.Success = true;
            }
            catch (Exception ex)
            {
                scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was a problem getting a list of messages.";
            }

            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return comms;
        }

        public static IEnumerable<Conversation> GetMyConversations(bool newMessages, int howMany, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            Account acctCurrent = (Account)HttpContext.Current.Session["User"];

            IEnumerable<Conversation> convos = null;
            try
            {
                //Leftpanel
                if (newMessages)
                {
                    convos = (from c in db.Communications
                              .Include("Account")
                              .Include("Account1")
                              where c.ActionId == (int)ActionType.None
                              && (c.ToAcctId == acctCurrent.Id)
                              && c.StatusToId == (int)StatusType.New
                              group c by c.ConversationId into g
                              select new Conversation() { Id = g.Key, LastUpdated = g.Max(c => c.LastUpdated), Props = g })
                        .OrderByDescending(g => g.LastUpdated);
                }

                //Messages page
                else
                {
                    convos = (from c in db.Communications
                              .Include("Account")
                              .Include("Account1")
                              where c.ActionId == (int)ActionType.None
                              && (c.ToAcctId == acctCurrent.Id || c.FromAcctId == acctCurrent.Id)
                              group c by c.ConversationId into g
                              select new Conversation() { Id = g.Key, LastUpdated = g.Max(c => c.LastUpdated), Props = g })
                        .OrderByDescending(g => g.LastUpdated);
                }

                if (howMany > 0)
                {
                    convos = convos.Take(howMany);
                }

                scr.Success = true;
            }
            catch (Exception ex)
            {
                scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was a problem getting the conversation list.";
            }

            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return convos;
        }

        public static IEnumerable<Communication> GetMyNotifications(int howMany, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            Account acctCurrent = (Account)HttpContext.Current.Session["User"];

            IEnumerable<Communication> notes = null;
            try
            {
                IEnumerable<Communication> invites = (from c in db.Communications
                                                      .Include("Account")
                                                      where c.ActionId == (int)ActionType.Invitation
                                                      && c.StatusToId == (int)StatusType.New
                                                      && (c.ToAcctId == acctCurrent.Id)
                                                      select c);

                notes = invites.OrderByDescending(c => c.LastUpdated).Take(howMany);
            }
            catch (Exception ex)
            {
                scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was a problem getting the notifications.";
            }

            if (howMany > 0)
            {
                notes = notes.Take(howMany);
            }

            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return notes;
        }

        public static Communication SendCommunication(Communication comm, ActionType actionType, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            AccountSvc acctSvc = new AccountSvc();
            Account acctCurrent = (Account)((comm.FromAcctId > 0) ? acctSvc.GetAccountById(comm.FromAcctId, out scr) : HttpContext.Current.Session["User"]);

            ServiceCallResult scrTo;
            Account acctTo = acctSvc.GetAccountById(comm.ToAcctId, out scrTo);

            //Add communication to database
            comm.ActionId = (int)actionType;
            comm.StatusToId = (int)StatusType.New;
            comm.Archived = false;
            comm.Created = DateTime.Now;
            comm.CreatedBy = string.Format("{0} {1}", acctCurrent.FirstName, acctCurrent.LastName);
            comm.LastUpdated = DateTime.Now;
            comm.LastUpdatedBy = string.Format("{0} {1}", acctCurrent.FirstName, acctCurrent.LastName);

            switch (actionType)
            {
                #region Invitation
                case ActionType.Invitation:

                    comm.MessageTo = Properties.Settings.Default.CommInvIntMsg;
                    db.Communications.Add(comm);
                    db.SaveChanges();

                    break;
                #endregion

                #region None
                case ActionType.None:

                    //Add message to conversation
                    if (comm.ConversationId != null)
                    {
                        //Add new message to conversation
                        db.Communications.Add(comm);
                        db.SaveChanges();

                        scr.Success = true;
                    }

                    break;
                #endregion
            }

            return comm;
        }
    }

    public class Conversation
    {
        public Guid? Id { get; set; }
        public DateTime LastUpdated { get; set; }
        public IGrouping<Guid?, Communication> Props { get; set; }
    }
}
