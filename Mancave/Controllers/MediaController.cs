using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Web.Mvc;
using Mancave.MancaveServices;

namespace Mancave.Controllers
{
    public class MediaController : Controller
    {
        [HttpGet]
        public ActionResult Radio()
        {
            return View();
        }

        [HttpGet]
        public ActionResult RadioPlayer()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Radio(string RadioEmbedCode, int RadioPosition=0)
        {
            MancaveEntities db = new MancaveEntities();
            Account acctCurrent = (Account)Session["User"];

            //Update user in database
            Account acctToUpdate = db.Accounts.SingleOrDefault(a => a.Id == acctCurrent.Id);
            acctToUpdate.RadioEmbedCode = RadioEmbedCode;
            acctToUpdate.RadioPosition = RadioPosition;
            db.SaveChanges();

            //Get updated session user
            Session["User"] = db.Accounts.SingleOrDefault(a => a.Id == acctCurrent.Id);

            ViewBag.Msg = "Your radio player's embed html code has been saved!";

            return View();
        }

        [HttpGet]
        public ActionResult Photos(int del = 0, int lid = 0)
        {
            if (del > 0)
            {
                MancaveEntities db = new MancaveEntities();
                Account acctCurrent = (Account)Session["User"];
                AccountPhoto photoToRem = db.AccountPhotoes.SingleOrDefault(s => s.Id == lid);

                //Remove skill from account
                db.AccountPhotoes.Remove(photoToRem);
                db.SaveChanges();

                //Get updated account
                acctCurrent = db.Accounts.SingleOrDefault(a => a.Id == acctCurrent.Id);
                Session["User"] = acctCurrent;

                ViewBag.Msg = "Photo: " + photoToRem.Name + " has been removed.";
            }

            return View();
        }

        [HttpPost]
        public ActionResult Photos(string albumName = "", int albumId = 0, string photoName = "", string photoDescription = "", HttpPostedFileBase PhotoFile = null)
        {
            AccountSvc acctSvc = new AccountSvc();
            Account acctCurrent = (Account)Session["User"];
            MancaveEntities db = new MancaveEntities();

            //Add new Album
            if (!string.IsNullOrEmpty(albumName))
            {
                Album album = new Album();
                album.Name = albumName;
                db.Albums.Add(album);
                db.SaveChanges();
            }

            //Save photo
            string photoFilename = string.Empty;
            string photoFilenameFull = string.Empty;
            if (PhotoFile != null)
            {
                if (PhotoFile.ContentLength > 0)
                {
                    Guid photoGuid = Guid.NewGuid();
                    string extension = PhotoFile.FileName.Split('.').Max();
                    photoFilename = string.Format("{0}.{1}", photoGuid, extension);
                    photoFilenameFull = Server.MapPath(string.Format("~/photos/{0}", photoFilename));
                    PhotoFile.SaveAs(photoFilenameFull);

                    AccountPhoto photo = new AccountPhoto();
                    photo.AccountId = acctCurrent.Id;
                    photo.AlbumId = albumId;
                    photo.Name = photoName;
                    photo.Description = photoDescription;
                    photo.PhotoFile = photoFilename;
                    db.AccountPhotoes.Add(photo);

                    db.SaveChanges();

                    ViewBag.Msg = "Your photo was uploaded successfully.";

                    //Get updated user account
                    Session["User"] = (from a in db.Accounts
                                       where a.Id == acctCurrent.Id
                                       select a)
                                       .Include("AccountPhotoes.Album")
                                       .SingleOrDefault();
                }
            }

            return View();
        }

        [HttpGet]
        public ActionResult Videos(int del = 0, int lid = 0)
        {
            if (del > 0)
            {
                MancaveEntities db = new MancaveEntities();
                Account acctCurrent = (Account)Session["User"];
                AccountVideo siteToRem = db.AccountVideos.SingleOrDefault(s => s.Id == lid);

                //Remove skill from account
                db.AccountVideos.Remove(siteToRem);
                db.SaveChanges();

                //Get updated account
                acctCurrent = db.Accounts.SingleOrDefault(a => a.Id == acctCurrent.Id);
                Session["User"] = acctCurrent;

                ViewBag.Msg = "Video Url: " + siteToRem.Url + " has been removed.";
            }

            return View();
        }

        [HttpPost]
        public ActionResult Videos(string albumName="", int albumId=0, string videoName="", string videoDescription="", string videoUrl = "")
        {
            Account acctCurrent = (Account)Session["User"];
            MancaveEntities db = new MancaveEntities();

            if (!string.IsNullOrEmpty(albumName))
            {
                Album album = new Album();
                album.Name = albumName;
                db.Albums.Add(album);
                db.SaveChanges();
            }
            
            if (!string.IsNullOrEmpty(videoUrl))
            {
                AccountVideo video = new AccountVideo();
                video.AccountId = acctCurrent.Id;
                video.AlbumId = albumId;
                video.Name = videoName;
                video.Description = videoDescription;
                video.Url = videoUrl;
                db.AccountVideos.Add(video);
                db.SaveChanges();

                ViewBag.Msg = "Video Url: " + videoUrl + " was added successfully. It will be visible when people visit your profile page.";

                //Get updated user account
                Session["User"] = (from a in db.Accounts
                                   where a.Id == acctCurrent.Id
                                   select a)
                                       .Include("AccountVideos.Album")
                                       .SingleOrDefault();
            }

            return View();
        }

        public ActionResult MusicFiles()
        {
            return View();
        }

        public ActionResult MediaSites()
        {
            return View();
        }

    }
}
