using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using System.IO;
using DotNetOpenAuth.AspNet;
using Microsoft.Web.WebPages.OAuth;
using WebMatrix.WebData;
using Mancave.Filters;
using Mancave.Models;
using Mancave.Helpers;
using Mancave.MancaveServices;

namespace Mancave.Controllers
{
    public class AccountController : Controller
    {
        AccountSvc acctSvc = new AccountSvc();

        [HttpPost]
        public JsonResult GetStatus(string users)
        {
            //Return list
            List<Object> returnStatuses = new List<Object>();

            //If user has friends to get statuses
            if (users.Length > 0)
            {
                string[] userIds = users.Split(',');

                //Loop thru list sent in, and get status for each user
                ServiceCallResult scr;
                for (int u = 0; u < userIds.Count(); u++)
                {
                    //User id to search for
                    int userId = int.Parse(userIds[u]);

                    //Get user status
                    Status statusFound = StatusSvc.GetAccountStatus(userId, out scr);

                    //User found, add their status to return list
                    if (statusFound != null)
                    {
                        returnStatuses.Add(new { AccountId = userId, StatusColor = statusFound.Color, StatusText = statusFound.Name });
                    }
                }
            }

            return Json(returnStatuses);
        }

        [HttpGet]
        public ActionResult Calendar(int AccountId = 0, int Month = 0, int Year = 0)
        {
            ViewBag.Month = Month;
            ViewBag.Year = Year;

            return PartialView("Calendar");
        }

        [HttpGet]
        public ActionResult Login(int logout = 0)
        {
            if (logout == 1)
            {
                Session.Abandon();
            }

            return View();
        }

        [HttpPost]
        public ActionResult Login(LoginUser user)
        {
            ServiceCallResult scr = new ServiceCallResult();
            
            Account acct = acctSvc.AuthenticateUser(user.Email, user.Password, ((HashSet<AccountStatus>)HttpContext.Application["AccountStatus"]), out scr);

            if (acct != null)
            {
                Session["User"] = acct;

                //If it's wife's email
                if (scr.DynObject == "restricted")
                {
                    Session["Restricted"] = true;
                }

                return RedirectToAction("../mancave");
            }
            else
            {
                Session["User"] = null;
                TempData["Error"] = "Login failed. Please try again.";
                return View();
            }
        }

        [HttpPost]
        public ActionResult SignUp(SignUpUser user)
        {
            ServiceCallResult scr;

            //Check for duplicate, with his email
            Account acctDuplicate = acctSvc.GetAccountByEmail(user.Email, out scr);
            if (acctDuplicate != null)
            {
                TempData["Error"] = "This email: " + user.Email + ", is already in use. Please choose a different email.";
            }
            
            //Check for duplicate, with her email
            if(!string.IsNullOrEmpty(user.HerEmail)){
                acctDuplicate = acctSvc.GetAccountByEmail(user.HerEmail, out scr);

                if (acctDuplicate != null)
                {
                    TempData["Error"] = "This email: " + user.HerEmail + ", is already in use. Please choose a different email.";
                }
            }

            //Emails are not duplicates, so continue with signup
            if (acctDuplicate == null)
            {
                Account acctAdded = acctSvc.AddAccount(user.Email, user.HerEmail, out scr);

                //Successful add
                if (scr.Success)
                {

                    //Send email verification
                    Result result = new Result();

                    string server = Request.ServerVariables["server_name"];
                    string port = ":" + Request.ServerVariables["server_port"];
                    string baseAddress = server + port;

                    //Send email to her
                    if (!string.IsNullOrEmpty(user.HerEmail))
                    {
                        Emailer.SendMail("Welcome to Mancave! Verify your email address.", "Our records show that you signed up your husband for a mancave.<br/><br/>Your temporary password is: " + acctAdded.HerPassword + "<br/><br/>If this is a valid request, please verify your email by clicking on the link below:<br/><br/><a href=\"http://" + baseAddress + "/account/verifyemail?token=" + acctAdded.HerToken.ToString() + "\">http://" + baseAddress + "/account/verifyemail?token=" + acctAdded.HerToken.ToString() + "</a>", "admin@Mancave.com", "Mancave Admin", user.HerEmail, out result);

                        if (result.Success)
                        {
                            TempData["Msg"] = "Thank you for signing up with Mancave. An email verification was sent to the wife's email for verification. Please check your email and follow instructions.";
                        }
                        else
                        {
                            TempData["Msg"] = string.Format("There was a problem sending a verification email. (host:{0}, uid:{1}, pwd:{2})", Properties.Settings.Default.SMTP_Host, Properties.Settings.Default.SMTP_Username, Properties.Settings.Default.SMTP_Password);
                        }
                    }

                    //Send email to him
                    else
                    {
                        Emailer.SendMail("Welcome to Mancave! Verify your email address.", "Our records show that your email was used to sign up for an account at Mancave.<br/><br/>Your temporary password is: " + acctAdded.Password + "<br/><br/>If this is a valid registration, please verify your email by clicking on the link below:<br/><br/><a href=\"http://" + baseAddress + "/account/verifyemail?token=" + acctAdded.Token.ToString() + "\">http://" + baseAddress + "/account/verifyemail?token=" + acctAdded.Token.ToString() + "</a>", "admin@Mancave.com", "Mancave Admin", user.Email, out result);

                        if (result.Success)
                        {
                            TempData["Msg"] = "Thank you for signing up with Mancave. An email verification was sent to your email for verification. Please check your email and follow instructions.";
                        }
                        else
                        {
                            TempData["Msg"] = string.Format("There was a problem sending a verification email. (host:{0}, uid:{1}, pwd:{2})", Properties.Settings.Default.SMTP_Host, Properties.Settings.Default.SMTP_Username, Properties.Settings.Default.SMTP_Password);
                        }
                    }
                }

                //Add failed
                else
                {
                    TempData["Msg"] = scr.MessageForUser;
                }
            }
            
            return RedirectToAction("login");
        }

        [HttpPost]
        public string SendPassword(string email)
        {
            // Generate a new 7-character password with 1 non-alphanumeric character.
            string password = Membership.GeneratePassword(7, 1);

            //Find account
            ServiceCallResult scr;
            Account acctFound = acctSvc.GetAccountByEmail(email, out scr);
            if (acctFound != null)
            {
                if (scr.DynObject == "restricted")
                {
                    acctFound.HerPassword = password;
                }
                else
                {
                    acctFound.Password = password;
                }

                acctSvc.UpdateAccount(acctFound, out scr);

                string server = Request.ServerVariables["server_name"];
                string port = ":" + Request.ServerVariables["server_port"];
                string baseAddress = server + port;

                Result result = new Result();
                Emailer.SendMail("Mancave Password Reset", "Hi " + acctFound.DisplayName + ",<br/><br/>There was a request made to reset your password. Here is the temporary password set for your account: " + password + "<br/><br/>Login in with this temporary password, then go to your Profile to change it.<br/><br/><a href=\"http://" + baseAddress + "/account/login\">http://" + baseAddress + "/account/login</a>", "admin@kudotree.com", "Mancave Admin", email, out result);

                return "ok";
            }
            else
            {
                return "The email provided could not be found. Please signup below, it's FREE!";
            }
        }

        [HttpGet]
        public ActionResult VerifyEmail(Guid token)
        {
            ServiceCallResult scr;
            Account acct = acctSvc.VerifyEmail(token, out scr);

            string server = Request.ServerVariables["server_name"];
            string port = ":" + Request.ServerVariables["server_port"];
            string baseAddress = server + port;

            //Send email verification
            Result result = new Result();

            if (acct != null)
            {
                //If it's wife's email
                if (scr.DynObject == "restricted")
                {
                    //Send husband his email
                    Emailer.SendMail("Welcome to Mancave! Verify your email address.", "Your wife has signed you up for an account at Mancave.<br/><br/>Your temporary password is: " + acct.Password + "<br/><br/>If this is a valid registration, please verify your email by clicking on the link below:<br/><br/><a href=\"http://" + baseAddress + "/account/verifyemail?token=" + acct.Token.ToString() + "\">http://" + baseAddress + "/account/verifyemail?token=" + acct.Token.ToString() + "</a>", "admin@Mancave.com", "Mancave Admin", acct.Email, out result);

                    Session["Restricted"] = true;
                }
                else
                {
                    Session["Restricted"] = null;
                }

                Session["User"] = acct;
                TempData["verify"] = 1;
                TempData["edit"] = 1;
                
                return RedirectToAction("Profile");
            }
            else
            {
                Session["User"] = null;
                TempData["Error"] = scr.MessageForUser;
                
                return RedirectToAction("Login");
            }
        }

        [HttpGet]
        public ActionResult Profile(int edit=0)
        {
            if (edit == 1)
            {
                TempData["edit"] = true;
            }

            ViewBag.States = StateSvc.GetAllStates();
            ViewBag.Countries = CountrySvc.GetAllCountries();
            return View();
        }

        [HttpPost]
        public ActionResult Profile(ProfileUser user)
        {
            Account acctCurrent = (Account)Session["User"];

            ServiceCallResult scr;
            Account acctToUpdate = acctSvc.GetAccountById(user.Id, out scr);

            //Profle Pic
            if (user.ProfilePic != null)
            {
                if (user.ProfilePic.ContentLength > 0)
                {
                    Result result;
                    
                    //Upload file
                    Uploader.UploadFile(user.ProfilePic, "profilepics", "profile_pic", user.Email, out result);

                    //Save in database
                    if (result.Success && result.DynObject != null)
                    {
                        acctToUpdate.ProfilePic = result.DynObject;
                    }
                }
            }

            //Other info
            if (Session["Restricted"] != null)
            {
                acctToUpdate.HerEmail = user.HerEmail;
                acctToUpdate.HerPassword = (!string.IsNullOrEmpty(user.HerPassword)) ? user.HerPassword : acctToUpdate.HerPassword;
            }
            else
            {
                acctToUpdate.FirstName = user.FirstName;
                acctToUpdate.LastName = user.LastName;
                acctToUpdate.DisplayName = user.DisplayName;
                acctToUpdate.Email = user.Email;
                acctToUpdate.Password = (!string.IsNullOrEmpty(user.Password)) ? user.Password : acctToUpdate.Password;
                acctToUpdate.WifesPageUrl = user.WifesPageUrl;
                acctToUpdate.WifesPageTitle = user.WifesPageTitle;
                acctToUpdate.City = user.City;

                if (user.StateId > 0)
                {
                    acctToUpdate.StateId = user.StateId;
                }
                if (user.CountryId > 0)
                {
                    acctToUpdate.CountryId = user.CountryId;
                }
                acctToUpdate.Zipcode = user.Zipcode;
            }
            
            //Save
            Account acctJustAdded = acctSvc.UpdateAccount(acctToUpdate, out scr);

            //Prepare vars to return
            Session["User"] = acctJustAdded;
            
            ViewBag.States = StateSvc.GetAllStates();
            ViewBag.Countries = CountrySvc.GetAllCountries();
            
            return View();
        }

        [HttpPost]
        public ActionResult UpdateBackImg(HttpPostedFileBase BackImgFile)
        {
            Account acctCurrent = (Account)Session["User"];

            //Background Image
            if (BackImgFile != null)
            {
                if (BackImgFile.ContentLength > 0)
                {
                    Result result;

                    //Upload file
                    Uploader.UploadFile(BackImgFile, "backimgs", "back_img", acctCurrent.Email, out result);

                    //Save in database
                    if (result.Success && result.DynObject != null)
                    {
                        acctCurrent.BackgroundImage = result.DynObject;
                    }
                }
            }

            ServiceCallResult scr;
            acctSvc.UpdateAccount(acctCurrent, out scr);

            return View("Profile");
        }

        [HttpPost]
        public ActionResult UpdateProfilePic(HttpPostedFileBase ProfilePic)
        {
            Account acctCurrent = (Account)Session["User"];

            //Background Image
            if (ProfilePic != null)
            {
                if (ProfilePic.ContentLength > 0)
                {
                    Result result;

                    //Upload file
                    Uploader.UploadFile(ProfilePic, "profilepics", "profile_pic", acctCurrent.Email, out result);

                    //Save in database
                    if (result.Success && result.DynObject != null)
                    {
                        acctCurrent.ProfilePic = result.DynObject;
                    }
                }
            }

            ServiceCallResult scr;
            acctSvc.UpdateAccount(acctCurrent, out scr);

            return View("Profile");
        }

        [HttpPost]
        public JsonResult UpdateWebsite(UpdateWebsiteForm info)
        {
            Account acctCurrent = (Account)Session["User"];

            acctCurrent.HeaderBackColor1 = info.HeaderBackColor1;
            acctCurrent.HeaderBackColor2 = info.HeaderBackColor2;
            acctCurrent.HeaderFontColor = info.HeaderFontColor;

            acctCurrent.LeftPanelBackColor1 = info.LeftPanelBackColor1;
            acctCurrent.LeftPanelBackColor2 = info.LeftPanelBackColor2;
            acctCurrent.LeftPanelFontColor = info.LeftPanelFontColor;

            acctCurrent.RightPanelBackColor1 = info.RightPanelBackColor1;
            acctCurrent.RightPanelBackColor2 = info.RightPanelBackColor2;
            acctCurrent.RightPanelFontColor = info.RightPanelFontColor;

            acctCurrent.MainPanelBackImgTransparency = info.MainPanelBackImgTransparency;
            acctCurrent.MainPanelPanelsTransparency = info.MainPanelPanelsTransparency;
            acctCurrent.MainPanelFontColor = info.MainPanelFontColor;

            ServiceCallResult scr;
            acctCurrent = acctSvc.UpdateAccount(acctCurrent, out scr);

            Session["User"] = acctCurrent;

            return Json(scr);
        }

        [HttpPost]
        public ActionResult AddCalendarEvent(string CalendarDescription, int CalendarEventDay, int CalendarEventMonth, int CalendarEventYear)
        {
            MancaveEntities db = new MancaveEntities();
            Account acctCurrent = (Account)Session["User"];

            AccountCalendarEvent e = db.AccountCalendarEvents.SingleOrDefault(ce => ce.EventDate.Day == CalendarEventDay && ce.EventDate.Month == CalendarEventMonth && ce.EventDate.Year == CalendarEventYear && ce.AccountId == acctCurrent.Id);

            if (e == null)
            {
                e = new AccountCalendarEvent();
            }

            e.AccountId = acctCurrent.Id;
            e.EventDescription = CalendarDescription;
            e.EventDate = new DateTime(CalendarEventYear, CalendarEventMonth, CalendarEventDay);

            db.AccountCalendarEvents.Add(e);

            db.SaveChanges();

            Session["User"] = db.Accounts.SingleOrDefault(a => a.Id == acctCurrent.Id);

            return RedirectToAction("../Mancave/");
        }
    }

    public class UpdateTilesForm
    {
        public string MancaveTile1 { get; set; }
        public string MancaveTile2 { get; set; }
        public string MancaveTile3 { get; set; }
        public string MancaveTile4 { get; set; }
        public string MancaveTile5 { get; set; }
        public string MancaveTile6 { get; set; }
    }

    public class UpdateWebsiteForm
    {
        public string HeaderBackColor1 { get; set; }
        public string HeaderBackColor2 { get; set; }
        public string HeaderFontColor { get; set; }
        public string LeftPanelBackColor1 { get; set; }
        public string LeftPanelBackColor2 { get; set; }
        public string LeftPanelFontColor { get; set; }
        public string RightPanelBackColor1 { get; set; }
        public string RightPanelBackColor2 { get; set; }
        public string RightPanelFontColor { get; set; }
        public int MainPanelBackImgTransparency { get; set; }
        public int MainPanelPanelsTransparency { get; set; }
        public string MainPanelFontColor { get; set; }
    }

    public class ProfileUser
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string HerEmail { get; set; }
        public string HerPassword { get; set; }
        public int Gender { get; set; }
        public string City { get; set; }
        public int StateId { get; set; }
        public string Zipcode { get; set; }
        public int CountryId { get; set; }
        public HttpPostedFileBase ProfilePic { get; set; }
        public string ProfileUrl { get; set; }
        public string WifesPageTitle { get; set; }
        public string WifesPageUrl { get; set; }
    }

    public class LoginUser
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class SignUpUser
    {
        public string Email { get; set; }
        public string HerEmail { get; set; }
    }
}
