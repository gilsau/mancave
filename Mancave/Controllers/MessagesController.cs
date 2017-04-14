using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Mancave.MancaveServices;

namespace Mancave.Controllers
{
    public class MessagesController : Controller
    {
        [HttpPost]
        public JsonResult SendFriendRequest(int FriendId)
        {
            ServiceCallResult scr = new ServiceCallResult();

            Account acctCurrent = (Account)Session["User"];

            Communication comm = new Communication();
            comm.FromAcctId = acctCurrent.Id;
            comm.ToAcctId = FriendId;

            Communication commSent = CommSvc.SendCommunication(comm, ActionType.Invitation, out scr);

            return Json(scr);
        }
        
        [HttpPost]
        public ActionResult Get(bool leftPanel, Guid? conversationId, int msgType, bool newMessages)
        {
            //Leftpanel Messages & Notifications
            if (leftPanel)
            {
                //Regular Messages
                if (msgType == 1)
                {
                    ServiceCallResult scrConvos;
                    IEnumerable<Conversation> convos = CommSvc.GetMyConversations(newMessages, 5, out scrConvos);
                    return PartialView("~/Views/Messages/LeftPanelMsgDropDown.cshtml", convos);
                }

                //Notes
                else if (msgType == 2)
                {
                    ServiceCallResult scrNotes;
                    IEnumerable<Communication> notes = CommSvc.GetMyNotifications(5, out scrNotes);
                    return PartialView("~/Views/Messages/LeftPanelNotesDropDown.cshtml", notes);
                }
            }

            //Messages page, Conversation Panel
            ViewBag.CurrentConvoId = conversationId;
            ServiceCallResult scrMsgs;
            IList<Communication> msgs = CommSvc.GetMessagesByConversationId(conversationId, newMessages, out scrMsgs).OrderBy(m => m.LastUpdated).ToList();
            return PartialView("~/Views/Messages/ConversationPanel.cshtml", msgs);
        }

        [HttpGet]
        public ActionResult Index()
        {
            Account acctCurrent = (Account)Session["User"];

            //Get conversations
            IList<Communication> convos = new List<Communication>();

            return View(convos);
        }

        [HttpGet]
        public ActionResult Notifications(int id=0, int fromId=0, int toId=0, int accept=0)
        {
            Account acctCurrent = (Account)Session["User"];

            //Update Communication (accept/deny friend request)
            if (id > 0 && fromId > 0 && toId > 0)
            {
                MancaveEntities db = new MancaveEntities();

                //Update status on notification
                Communication comm = db.Communications.SingleOrDefault(c => c.Id == id);
                comm.StatusToId = (int)StatusType.Read;
                db.SaveChanges();

                //Add friend to both accounts
                if (accept == 1)
                {
                    Account acctFrom = db.Accounts.SingleOrDefault(a => a.Id == fromId);
                    Account acctTo = db.Accounts.SingleOrDefault(a => a.Id == toId);

                    AccountFriend af1 = new AccountFriend();
                    af1.AccountId = fromId;
                    af1.FriendId = toId;
                    acctFrom.AccountFriends.Add(af1);

                    AccountFriend af2 = new AccountFriend();
                    af2.AccountId = toId;
                    af2.FriendId = fromId;
                    acctTo.AccountFriends.Add(af2);

                    db.SaveChanges();
                }
            }

            return View();
        }

        [HttpPost]
        public JsonResult SendMessage(MessageInfo info)
        {
            Account acctCurrent = (Account)Session["User"];

            ServiceCallResult scrAddMessage = new ServiceCallResult();

            //Create new conversation
            Communication comm = new Communication();
            comm.FromAcctId = acctCurrent.Id;
            comm.ToAcctId = info.ToAcctId;
            comm.ConversationId = (info.ConversationId != Guid.Empty) ? info.ConversationId : Guid.NewGuid();
            comm.MessageTo = info.Message;

            //Add message to database
            ServiceCallResult scr;
            CommSvc.SendCommunication(comm, ActionType.None, out scr);

            return Json(scr);
        }

        public class MessageInfo
        {
            public int FromAcctId { get; set; }
            public int ToAcctId { get; set; }
            public Guid ConversationId { get; set; }
            public string Message { get; set; }
        }
    }
}
