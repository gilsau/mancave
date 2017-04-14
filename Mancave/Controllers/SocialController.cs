using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Mancave.MancaveServices;

namespace Mancave.Controllers
{
    public class SocialController : Controller
    {
        //
        // GET: /Social/

        [HttpGet]
        public ActionResult Friends(int id=0, int remove=0)
        {
            MancaveEntities db = new MancaveEntities();
            Account acctCurrent = (Account)Session["User"];

            //Remove a friend
            if (id > 0 && remove == 1)
            {
                db.AccountFriends.Remove(db.AccountFriends.SingleOrDefault(af => af.AccountId == acctCurrent.Id && af.FriendId == id));
                db.AccountFriends.Remove(db.AccountFriends.SingleOrDefault(af => af.AccountId == id && af.FriendId == acctCurrent.Id));
                db.SaveChanges();

                //Get updated session user
                Session["User"] = db.Accounts.SingleOrDefault(a => a.Id == acctCurrent.Id);
            }
            
            return View();
        }

        public ActionResult Chats()
        {
            return View();
        }
        
        public ActionResult Groups()
        {
            return View();
        }

        public ActionResult Events()
        {
            return View();
        }

        public ActionResult SocialSites()
        {
            return View();
        }
    }
}
