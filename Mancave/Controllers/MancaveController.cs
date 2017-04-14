using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Mancave.MancaveServices;
using Mancave.Helpers;
using Mancave.Models;

namespace Mancave.Controllers
{
    public class MancaveController : Controller
    {
        MancaveSvc mcaveSvc = new MancaveSvc();
        AccountSvc acctSvc = new AccountSvc();

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Post(postInfo info)
        {
            ServiceCallResult scr;
            Account acctCurrent = (Account)Session["User"];

            //Background Image
            string photoFilename = string.Empty;
            if (info.Photo != null)
            {
                if (info.Photo.ContentLength > 0)
                {
                    Result result;

                    //Upload file
                    Uploader.UploadFile(info.Photo, "photos", string.Empty, acctCurrent.Email, out result, true);

                    //Save in database
                    if (result.Success && result.DynObject != null)
                    {
                        photoFilename = result.DynObject;
                    }
                }
            }

            //Save in database
            mcaveSvc.PostComment(info.Comment, photoFilename, string.Empty, info.MancaveAccountId, info.PostedByAccountId, info.Privacy, info.ParentAccountPostId, out scr);

            //Return account for this mancave
            Account acctMancave = acctSvc.GetAccountById((info.MancaveAccountId == acctCurrent.Id) ? acctCurrent.Id : info.MancaveAccountId, out scr);
            return PartialView("Mancave", acctMancave);
        }

        [HttpGet]
        public ActionResult Search(string keyword)
        {
            MancaveEntities db = new MancaveEntities();

            keyword = keyword.Trim().ToLower();

            //Search people
            List<Account> accounts = db.Accounts.Where(a => a.DisplayName.ToLower().Contains(keyword) || a.FirstName.ToLower().Contains(keyword) || a.LastName.ToLower().Contains(keyword) || a.City.ToLower().Contains(keyword) || a.State.Name.ToLower().Contains(keyword) || a.Country.Name.ToLower().Contains(keyword)).ToList();

            //Search topics
            List<Forum> forums = db.Fora.Where(f => f.Name.ToLower().Contains(keyword)).ToList();
            List<Topic> topics = db.Topics.Where(t => t.Name.ToLower().Contains(keyword)).ToList();
            List<ForumMessage> msgs = db.ForumMessages.Where(fm => fm.Message.Contains(keyword)).ToList();
            
            //Search skills
            List<AccountSkill> skills = db.AccountSkills.Where(s => s.Skill.ToLower().Contains(keyword)).ToList();

            ViewBag.People = accounts;
            ViewBag.Forums = forums;
            ViewBag.Topics = topics;
            ViewBag.Messages = msgs;
            ViewBag.Skills = skills;

            return View();
        }

        [HttpPost]
        public ActionResult UpdateTiles(UpdateTilesForm info)
        {
            Account acctCurrent = (Account)Session["User"];
            MancaveEntities db = new MancaveEntities();

            Account acctToUpdate = db.Accounts.SingleOrDefault(a => a.Id == acctCurrent.Id);

            //Tile 1
            acctToUpdate.MancaveTile1Name = info.MancaveTile1.Split('|')[0];
            acctToUpdate.MancaveTile1Img = info.MancaveTile1.Split('|')[1];
            acctToUpdate.MancaveTile1Url = info.MancaveTile1.Split('|')[2];

            //Tile 2
            acctToUpdate.MancaveTile2Name = info.MancaveTile2.Split('|')[0];
            acctToUpdate.MancaveTile2Img = info.MancaveTile2.Split('|')[1];
            acctToUpdate.MancaveTile2Url = info.MancaveTile2.Split('|')[2];

            //Tile 3
            acctToUpdate.MancaveTile3Name = info.MancaveTile3.Split('|')[0];
            acctToUpdate.MancaveTile3Img = info.MancaveTile3.Split('|')[1];
            acctToUpdate.MancaveTile3Url = info.MancaveTile3.Split('|')[2];

            //Tile 4
            acctToUpdate.MancaveTile4Name = info.MancaveTile4.Split('|')[0];
            acctToUpdate.MancaveTile4Img = info.MancaveTile4.Split('|')[1];
            acctToUpdate.MancaveTile4Url = info.MancaveTile4.Split('|')[2];

            //Tile 5
            acctToUpdate.MancaveTile5Name = info.MancaveTile5.Split('|')[0];
            acctToUpdate.MancaveTile5Img = info.MancaveTile5.Split('|')[1];
            acctToUpdate.MancaveTile5Url = info.MancaveTile5.Split('|')[2];

            //Tile 6
            acctToUpdate.MancaveTile6Name = info.MancaveTile6.Split('|')[0];
            acctToUpdate.MancaveTile6Img = info.MancaveTile6.Split('|')[1];
            acctToUpdate.MancaveTile6Url = info.MancaveTile6.Split('|')[2];

            db.SaveChanges();

            Session["User"] = db.Accounts.SingleOrDefault(a => a.Id == acctCurrent.Id);

            return RedirectToAction("../Mancave/");
        }
    }

    public class postInfo
    {
        public string Comment { get; set; }
        public string VideoUrl { get; set; }
        public HttpPostedFileBase Photo { get; set; }
        public int Privacy { get; set; }
        public int MancaveAccountId { get; set; }
        public int PostedByAccountId { get; set; }
        public int ParentAccountPostId { get; set; }
    }
}
