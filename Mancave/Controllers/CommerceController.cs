using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Mancave.Controllers
{
    public class CommerceController : Controller
    {
        //
        // GET: /Commerce/

        public ActionResult Buy()
        {
            return View();
        }

        public ActionResult Sell()
        {
            return View();
        }

        public ActionResult Trade()
        {
            return View();
        }

        public ActionResult AuctionSites()
        {
            return View();
        }

        public ActionResult TradingSites()
        {
            return View();
        }
    }
}
