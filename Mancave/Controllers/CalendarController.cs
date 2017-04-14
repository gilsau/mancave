using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Mancave.MancaveServices;

namespace Mancave.Controllers
{
    public class CalendarController : Controller
    {
        [HttpGet]
        public ActionResult Index(int id=0, int del=0)
        {
            Account acctCurrent = (Account)Session["User"];

            if (del > 0 && id > 0)
            {
                MancaveEntities db = new MancaveEntities();
                AccountCalendarEvent e = db.AccountCalendarEvents.SingleOrDefault(ae => ae.Id == id);
                db.AccountCalendarEvents.Remove(e);
                db.SaveChanges();

                Session["User"] = db.Accounts.SingleOrDefault(a => a.Id == acctCurrent.Id);

                ViewBag.Msg = string.Format("Event {0} has been successfully removed.", e.EventName);
            }

            return View();
        }

        [HttpPost]
        public ActionResult Index(CalendarEvent info)
        {
            MancaveEntities db = new MancaveEntities();
            Account acctCurrent = (Account)Session["User"];

            string[] arrTime = info.EventTime.Split(':');
            int hour = int.Parse(arrTime[0]);
            int min = int.Parse(arrTime[1]);

            AccountCalendarEvent e = new AccountCalendarEvent();
            e.AccountId = acctCurrent.Id;
            e.EventDate = new DateTime(info.EventYear, info.EventMonth, info.EventDay, hour, min, 0);
            e.EventName = info.EventName;
            e.EventDescription = info.EventDescription;

            db.AccountCalendarEvents.Add(e);
            db.SaveChanges();

            Session["User"] = db.Accounts.SingleOrDefault(a => a.Id == acctCurrent.Id);

            return View();
        }
    }

    public class CalendarEvent
    {
        public int EventDay { get; set; }
        public int EventMonth { get; set; }
        public int EventYear { get; set; }
        public string EventTime { get; set; }
        public string EventName { get; set; }
        public string EventDescription { get; set; }
    }
}
