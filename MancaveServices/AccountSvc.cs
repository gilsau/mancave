using System;
using System.Web;
using System.Linq;
using System.Data.Entity.Validation;
using System.Collections.Generic;
using System.Web.Security;

namespace Mancave.MancaveServices
{
    public class AccountSvc
    {
        private MancaveEntities db;
        
        public AccountSvc()
        {
            db = new MancaveEntities();
        }

        public IList<Account> SearchAccounts(out ServiceCallResult scr, string Firstname="", string Lastname="", string Email="", string Phone="", string City="", int StateId=0, string Zipcode="", int CountryId=0, string[] Professions=null)
        {
            scr = new ServiceCallResult();

            IList<Account> accts = null;
            try
            {
                accts = (from a in db.Accounts
                        select a).ToList();

                //Search by firstname
                if(!string.IsNullOrEmpty(Firstname))
                {
                    accts = accts.Where(a => a.FirstName.ToLower().Trim().Contains(Firstname.ToLower().Trim())).ToList();
                }
                //Search by lastname
                if (!string.IsNullOrEmpty(Lastname))
                {
                    accts = accts.Where(a => a.LastName.ToLower().Trim().Contains(Lastname.ToLower().Trim())).ToList();
                }
                //Search by email
                if (!string.IsNullOrEmpty(Email))
                {
                    accts = accts.Where(a => a.Email.ToLower().Trim() == Email.ToLower().Trim()).ToList();
                }
                //Search by city
                if (!string.IsNullOrEmpty(City))
                {
                    accts = accts.Where(a => a.City.ToLower().Trim() == City.ToLower().Trim()).ToList();
                }
                //Search by state
                if (StateId > 0)
                {
                    accts = accts.Where(a => a.StateId == StateId).ToList();
                }
                //Search by zipcode
                if (!string.IsNullOrEmpty(Zipcode))
                {
                    accts = accts.Where(a => a.Zipcode.Trim() == Zipcode.Trim()).ToList();
                }
                //Search by country
                if (CountryId > 0)
                {
                    accts = accts.Where(a => a.CountryId == CountryId).ToList();
                }
                
                scr.Success = true;
            }
            catch (Exception ex)
            {
                scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was a problem getting a list of accounts.";
            }

            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return accts;
        }

        public Account GetAccountById(int accountId, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            Account acct = null;
            try
            {
                acct = (from a in db.Accounts
                            .Include("Status")
                        where a.Id == accountId
                        select a).FirstOrDefault();

                if (acct != null)
                {
                    scr.Success = true;
                }
                else
                {
                    scr.MessageForUser = string.Format("We were unable to find an account with id: {}.", accountId);
                }
            }
            catch (Exception ex)
            {
                scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was an error finding the account.";
            }

            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return acct;
        }

        public bool LogOutCurrentUser(int accountId, HashSet<AccountStatus> appStatuses, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            //Update status to OFFLINE
            StatusSvc.UpdateAccountStatus(accountId, StatusType.Offline, appStatuses, out scr);
            
            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return scr.Success;
        }

        public Account AuthenticateUser(string email, string password, HashSet<AccountStatus> appStatuses, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            Account acct = null;
            try
            {
                //Find account
                acct = db.Accounts.SingleOrDefault(a => a.Email.ToLower().Trim() == email.ToLower().Trim() && a.Password == password);

                if (acct == null)
                {
                    acct = db.Accounts.SingleOrDefault(a => a.HerEmail.ToLower().Trim() == email.ToLower().Trim() && a.HerPassword == password);

                    scr.DynObject = "restricted";
                }
                
                if (acct != null)
                {
                    //Update status to ONLINE
                    ServiceCallResult scr1 = new ServiceCallResult();
                    StatusSvc.UpdateAccountStatus(acct.Id, StatusType.Online, appStatuses, out scr1);

                    //Add Online status object to account object
                    acct.Status = db.Status.Single(s => s.Id == (int)StatusType.Online);
                
                    scr.Success = true;
                }
                else
                {
                    scr.MessageForUser = "Username/Password combination is invalid. Please try again.";
                }
            }
            catch (Exception ex)
            {
                scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was a problem logging in. Please try again.";
            }

            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return acct;
        }

        public Account GetAccountByEmail(string email, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            Account acct = null;
            try
            {
                acct = db.Accounts.SingleOrDefault(a => (a.Email.ToLower().Trim() == email.ToLower().Trim()));

                if (acct == null)
                {
                    acct = db.Accounts.SingleOrDefault(a => (a.HerEmail.ToLower().Trim() == email.ToLower().Trim()));

                    scr.DynObject = "restricted";
                }

                if (acct != null)
                {
                    scr.Success = true;
                }
                else
                {
                    scr.MessageForUser = "Could not find user with this email.";
                }
            }
            catch (Exception ex)
            {
                scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "Could not find user with this email.";
            }

            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return acct;
        }

        public Account AddAccount(string email, string herEmail, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();
            Account acct = new Account();

            //Add account to database
            try
            {
                acct.Email = email;
                acct.Password = Membership.GeneratePassword(7, 1);

                if (!string.IsNullOrEmpty(herEmail))
                {
                    acct.HerEmail = herEmail;
                    acct.HerPassword = !string.IsNullOrEmpty(herEmail) ? Membership.GeneratePassword(7, 1) : string.Empty;
                    acct.HerToken = !string.IsNullOrEmpty(herEmail) ? Guid.NewGuid() : Guid.Empty;
                    acct.HerTokenExpired = false;
                }
                
                //Website Colors
                acct.HeaderBackColor1 = "black";
                acct.HeaderBackColor2 = "aliceblue";
                acct.HeaderFontColor = "white";
                
                acct.LeftPanelBackColor1 = "black";
                acct.LeftPanelBackColor2 = "aliceblue";
                acct.LeftPanelFontColor = "black";
                
                acct.RightPanelBackColor1 = "black";
                acct.RightPanelBackColor2 = "aliceblue";
                acct.RightPanelFontColor = "black";
                
                acct.MainPanelBackImgTransparency = 80;
                acct.MainPanelPanelsTransparency = 50;
                acct.MainPanelFontColor = "black";
                
                //Tiles
                acct.MancaveTile1Name = "Messages";
                acct.MancaveTile1Img = "tile-messages.png";
                acct.MancaveTile1Url = "/messages/index";

                acct.MancaveTile2Name = "Photos";
                acct.MancaveTile2Img = "tile-photos.png";
                acct.MancaveTile2Url = "/media/photos";

                acct.MancaveTile3Name = "Mgames";
                acct.MancaveTile3Img = "tile-games.png";
                acct.MancaveTile3Url = "/mangames";

                acct.MancaveTile4Name = "Mforums";
                acct.MancaveTile4Img = "tile-forums.png";
                acct.MancaveTile4Url = "/manforums";

                acct.MancaveTile5Name = "My Radio";
                acct.MancaveTile5Img = "tile-music.png";
                acct.MancaveTile5Url = "/media/radio";

                acct.MancaveTile6Name = "My Videos";
                acct.MancaveTile6Img = "tile-videos.png";
                acct.MancaveTile6Url = "/media/videos";

                acct.RadioPosition = 0;
                acct.ProfilePic = "default.jpg";
                acct.WifesPageTitle = "My Wife's Page";
                acct.Token = Guid.NewGuid();
                acct.TokenExpired = false;
                acct.StatusId = (int)StatusType.New;
                acct.Created = DateTime.Now;
                acct.CreatedBy = "signup";
                acct.LastUpdated = DateTime.Now;
                acct.LastUpdatedBy = "signup";
                acct = db.Accounts.Add(acct);
                db.SaveChanges();

                //Account just added
                acct = db.Accounts.SingleOrDefault(a => a.Email == email);

                db.SaveChanges();

                scr.Success = true;
            }
            catch (Exception ex)
            {
                scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was an error adding the account.";
            }
            
            //Log errors
            if(!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return acct;
        }

        public Account UpdateAccount(Account acct, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            Account acctUpd = null;
            
            try
            {
                Account acctCurrent = (Account)HttpContext.Current.Session["User"];

                acctUpd = db.Accounts.SingleOrDefault(a => a.Id == acct.Id);

                if (HttpContext.Current.Session["Restricted"] != null)
                {
                    acctUpd.HerEmail = acct.HerEmail;
                    acctUpd.HerPassword = !string.IsNullOrEmpty(acct.HerPassword) ? acct.HerPassword : acctUpd.HerPassword;
                }
                else
                {
                    //Website Colors
                    acctUpd.HeaderBackColor1 = acct.HeaderBackColor1;
                    acctUpd.HeaderBackColor2 = acct.HeaderBackColor2;
                    acctUpd.HeaderFontColor = acct.HeaderFontColor;

                    acctUpd.LeftPanelBackColor1 = acct.LeftPanelBackColor1;
                    acctUpd.LeftPanelBackColor2 = acct.LeftPanelBackColor2;
                    acctUpd.LeftPanelFontColor = acct.LeftPanelFontColor;

                    acctUpd.RightPanelBackColor1 = acct.RightPanelBackColor1;
                    acctUpd.RightPanelBackColor2 = acct.RightPanelBackColor2;
                    acctUpd.RightPanelFontColor = acct.RightPanelFontColor;

                    acctUpd.MainPanelBackImgTransparency = acct.MainPanelBackImgTransparency;
                    acctUpd.MainPanelPanelsTransparency = acct.MainPanelPanelsTransparency;
                    acctUpd.MainPanelFontColor = acct.MainPanelFontColor;

                    //Rest of account info
                    acctUpd.FirstName = acct.FirstName;
                    acctUpd.LastName = acct.LastName;
                    acctUpd.DisplayName = acct.DisplayName;
                    acctUpd.Email = acct.Email;
                    acctUpd.Password = !string.IsNullOrEmpty(acct.Password) ? acct.Password : acctUpd.Password;
                    acctUpd.City = acct.City;
                    acctUpd.StateId = acct.StateId;
                    acctUpd.Zipcode = acct.Zipcode;
                    acctUpd.CountryId = acct.CountryId;
                    acctUpd.ProfilePic = acct.ProfilePic;
                    acctUpd.WifesPageUrl = acct.WifesPageUrl;
                    acctUpd.WifesPageTitle = acct.WifesPageTitle;
                    acctUpd.BackgroundImage = acct.BackgroundImage;
                    acctUpd.ResumeFileName = acct.ResumeFileName;
                    acctUpd.StatusId = acct.StatusId;
                    acctUpd.LastUpdated = DateTime.Now;
                    acctUpd.LastUpdatedBy = string.Format("{0} {1}", acctCurrent.FirstName, acctCurrent.LastName);

                    //Remove all skills for this user
                    foreach (AccountSkill skill in db.AccountSkills.Where(ak => ak.AccountId == acctCurrent.Id))
                    {
                        db.AccountSkills.Remove(skill);
                    }

                    //Add skills for this user
                    foreach (AccountSkill skill in acct.AccountSkills)
                    {
                        AccountSkill akToAdd = new AccountSkill();
                        akToAdd.AccountId = acct.Id;
                        akToAdd.Skill = skill.Skill;
                        akToAdd.Years = skill.Years;
                        akToAdd.LastUsed = skill.LastUsed;

                        db.AccountSkills.Add(akToAdd);
                    }

                    //Remove all links for this user
                    foreach (AccountFavSite link in db.AccountFavSites.Where(s => s.AccountId == acctCurrent.Id))
                    {
                        db.AccountFavSites.Remove(link);
                    }

                    //Add links for this user
                    foreach (AccountFavSite link in acct.AccountFavSites)
                    {
                        AccountFavSite afToAdd = new AccountFavSite();
                        afToAdd.AccountId = acct.Id;
                        afToAdd.FavSite = link.FavSite;

                        db.AccountFavSites.Add(afToAdd);
                    }
                }

                db.SaveChanges();

                scr.Success = true;
            }
            catch (DbEntityValidationException vEx)
            {
                foreach (var eve in vEx.EntityValidationErrors)
                {
                    scr.MessageForLog += string.Format("\r\nEntity of type \"{0}\" in state \"{1}\" has the following validation errors:", eve.Entry.Entity.GetType().Name, eve.Entry.State);
                        
                    foreach (var ve in eve.ValidationErrors)
                    {
                        scr.MessageForLog += string.Format("\r\n- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                        scr.MessageForUser += string.Format("<hr/>{0}", ve.ErrorMessage);
                    }
                }
            }
            catch (Exception ex)
            {
                scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was a problem updating the account.";
            }
            

            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return acctUpd;
        }

        public Account VerifyEmail(Guid token, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();
            Account acct = new Account();

            //His token
            acct = db.Accounts.SingleOrDefault(a => (a.Token == token && a.TokenExpired == false) || (a.HerToken == token && a.HerTokenExpired == false));
            
            //Account found w/token
            if(acct != null){

                //Is this token hers? Then restrict access
                if (acct.HerToken == token)
                {
                    scr.DynObject = "restricted";
                }

                //Update token
                try
                {
                    if (acct.Token == token)
                    {
                        acct.TokenExpired = true;
                    }
                    else if(acct.HerToken == token)
                    {
                        acct.HerTokenExpired = true;
                    }

                    acct.StatusId = (int)StatusType.Active;
                    db.SaveChanges();
                }
                catch (Exception ex)
                {
                    scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                    scr.MessageForUser = "There was a problem verifying the account.";
                }
            }
            else
            {
                scr.MessageForLog = "Could not find token. It could be expired.";
                scr.MessageForUser = "There was a problem verifying the account. The email link might be expired.";
            }

            return acct;
        }
    }

    public class AccountStatus
    {
        public int AccountId { get; set; }
        public Status Status { get; set; }
    }

    public static class StateSvc
    {
        private static MancaveEntities db = new MancaveEntities();

        public static IList<State> GetAllStates()
        {
            return db.States.ToList();
        }
    }

    public static class CountrySvc
    {
        private static MancaveEntities db = new MancaveEntities();

        public static IList<Country> GetAllCountries()
        {
            return db.Countries.ToList();
        }
    }
}