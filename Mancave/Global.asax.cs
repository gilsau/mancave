using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Mancave.MancaveServices;

namespace Mancave
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            //WebApiConfig.Register(GlobalConfiguration.Configuration);
            //FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            //BundleConfig.RegisterBundles(BundleTable.Bundles);
            //AuthConfig.RegisterAuth();

            //Cache Account Status
            ServiceCallResult scr;
            Application["AccountStatus"] = StatusSvc.GetAllAccountStatuses(out scr);
        }

        protected void Session_OnEnd(object sender, EventArgs e)
        {
            AccountSvc acctSvc = new AccountSvc();
            ServiceCallResult scr;
            acctSvc.LogOutCurrentUser(((Account)Session["User"]).Id, ((HashSet<AccountStatus>)Application["AccountStatus"]), out scr);
        }
    }
}