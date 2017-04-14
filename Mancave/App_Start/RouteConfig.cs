using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Mancave
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Mancave",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "mancave", action = "index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Messages",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "messages", action = "index", id = UrlParameter.Optional }
            );
            
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "account", action = "login", id = UrlParameter.Optional }
            );
        }
    }
}