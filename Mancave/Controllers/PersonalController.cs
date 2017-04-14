using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using Mancave.MancaveServices;

namespace Mancave.Controllers
{
    public class PersonalController : Controller
    {
        public ActionResult Partner()
        {
            return View();
        }

        [HttpGet]
        public ActionResult FavSites(int del=0, int lid=0)
        {
            if (del > 0)
            {
                MancaveEntities db = new MancaveEntities();
                Account acctCurrent = (Account)Session["User"];
                AccountFavSite siteToRem = db.AccountFavSites.SingleOrDefault(s => s.Id == lid);

                //Remove skill from account
                db.AccountFavSites.Remove(siteToRem);
                db.SaveChanges();

                //Get updated account
                acctCurrent = db.Accounts.SingleOrDefault(a => a.Id == acctCurrent.Id);
                Session["User"] = acctCurrent;

                ViewBag.Msg = "Link: " + siteToRem.FavSite + " has been removed.";
            }

            return View();
        }

        [HttpPost]
        public ActionResult FavSites(string FavSite="")
        {
            if (!string.IsNullOrEmpty(FavSite))
            {
                AccountSvc acctSvc = new AccountSvc();
                Account acctCurrent = (Account)Session["User"];

                AccountFavSite site = new AccountFavSite();
                site.AccountId = acctCurrent.Id;
                site.FavSite = FavSite;
                acctCurrent.AccountFavSites.Add(site);

                ViewBag.Msg = "Link: " + FavSite + " was added successfully. It will be visible when people visit your profile page.";

                ServiceCallResult scr;
                Session["User"] = acctSvc.UpdateAccount(acctCurrent, out scr);
            }

            return View();
        }

        [HttpGet]
        public ActionResult Resume(int del=0, int sid=0)
        {
            if (del > 0)
            {
                MancaveEntities db = new MancaveEntities();
                Account acctCurrent = (Account)Session["User"];
                AccountSkill skillToRem = db.AccountSkills.SingleOrDefault(ak => ak.Id == sid);

                //Remove skill from account
                db.AccountSkills.Remove(skillToRem);
                db.SaveChanges();

                //Get updated account
                acctCurrent = db.Accounts.SingleOrDefault(a => a.Id == acctCurrent.Id);
                Session["User"] = acctCurrent;

                ViewBag.Msg = "Skill: " + skillToRem.Skill + " has been removed.";
            }

            return View();
        }

        [HttpPost]
        public ActionResult Resume(HttpPostedFileBase ResumeFile, string Skill="", int Years=0, int LastUsed=0)
        {
            AccountSvc acctSvc = new AccountSvc();
            Account acctCurrent = (Account)Session["User"];

            //Resume upload
            if (ResumeFile != null)
            {
                if (ResumeFile.ContentLength > 0)
                {
                    string resumeFilename = string.Format("resume_{0}.pdf", acctCurrent.Email.Replace('@', '_')).ToLower();

                    ResumeFile.SaveAs(Server.MapPath("~/resumes/") + Path.GetFileName(resumeFilename));
                    acctCurrent.ResumeFileName = resumeFilename.ToLower();

                    ViewBag.Msg = "Your resume was uploaded successfully. It will be visible when people visit your profile page.";
                }
            }
            else{
                AccountSkill acctSkill = new AccountSkill();
                acctSkill.AccountId = acctCurrent.Id;
                acctSkill.Skill = Skill;
                acctSkill.Years = Years;
                acctSkill.LastUsed = LastUsed;
                acctCurrent.AccountSkills.Add(acctSkill);

                ViewBag.Msg = "Skill: " + Skill + " was added successfully. It will be visible when people visit your profile page.";
            }

            ServiceCallResult scr;
            Session["User"] = acctSvc.UpdateAccount(acctCurrent, out scr);

            return View();
        }

        public ActionResult FileCabinet()
        {
            return View();
        }

        public ActionResult Reports()
        {
            return View();
        }

        public ActionResult Messages()
        {
            return View();
        }

        public ActionResult Account()
        {
            return View();
        }

        public ActionResult Shortcuts()
        {
            return View();
        }
    }


}
