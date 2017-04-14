using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Mancave.MancaveServices;

namespace Mancave.Controllers
{
    public class ManforumsController : Controller
    {
        ForumSvc forumSvc = new ForumSvc();
        
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Create(string Name)
        {
            ServiceCallResult scr;
            forumSvc.CreateForum(Name, out scr);

            int mineParam = Request.QueryString["mine"] != null ? 1 : 0;

            return RedirectToAction("Index", new { mine = mineParam });
        }

        [HttpPost]
        public ActionResult AddTopic(string Name, int ForumId)
        {
            ServiceCallResult scr;
            forumSvc.AddTopic(Name, ForumId, out scr);

            int mineParam = Request.QueryString["mine"] != null ? 1 : 0;

            return RedirectToAction("Index", new { fid = ForumId, mine = mineParam });
        }

        [HttpPost]
        public ActionResult PostMsg(string Comment, int TopicId, HttpPostedFileBase ForumMsgPhoto = null)
        {
            ServiceCallResult scr;
            forumSvc.AddForumMsg(Comment, TopicId, ForumMsgPhoto, out scr);

            int mineParam = Request.QueryString["mine"] != null ? 1 : 0;

            return RedirectToAction("Index", new { tid = TopicId, mine = mineParam });
        }
    }
}
