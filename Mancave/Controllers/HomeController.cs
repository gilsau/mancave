using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Mancave.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public ActionResult Index(int logout = 0)
        {
            if (logout == 1) Session.Abandon();

            return View();
        }
        
        public ActionResult About()
        {
            

            return View();
        }

        public ActionResult Contact()
        {
            

            return View();
        }

        public ActionResult SiteMap()
        {
            

            return View();
        }
        
        public ActionResult Terms()
        {
            

            return View();
        }

        public ActionResult Faqs()
        {
            

            return View();
        }
    }
}
