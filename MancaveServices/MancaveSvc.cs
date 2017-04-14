using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Mancave.MancaveServices
{
    public class MancaveSvc
    {
        private MancaveEntities db;
        
        public MancaveSvc()
        {
            db = new MancaveEntities();
        }

        public AccountPost PostComment(string comment, string photoFilename, string videoUrl, int mancaveAcctId, int postedByAcctId, int privacy, int parentPostId, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();
            AccountPost ap = new AccountPost();
            Account acctCurrent = (Account) HttpContext.Current.Session["User"];

            ap.AccountId = mancaveAcctId;
            ap.PostedByAccountId = postedByAcctId;
            ap.Comment = comment;

            if (parentPostId > 0)
            {
                ap.ParentAccountPostId = parentPostId;
            }

            ap.PhotoFile = photoFilename;
            ap.VideoUrl = videoUrl;
            ap.PrivacyId = privacy == 0 ? 1 : privacy;
            ap.Created = DateTime.Now;

            ap = db.AccountPosts.Add(ap);
            db.SaveChanges();

            return ap;
        }

        public List<AccountPost> GetPostingsByMancave(int accountId, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            List<AccountPost> postings = null;
            try
            {
                postings = db.AccountPosts.Where(p => p.AccountId == accountId && p.ParentAccountPostId == null).OrderByDescending(p => p.Created).ToList();
            }
            catch (Exception ex)
            {
                scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was an error retrieving posting for this mancave.";
            }

            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return postings;
        }

        public List<AccountPost> GetCommentsByPosting(int postingId, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            List<AccountPost> comments = null;
            try
            {
                comments = db.AccountPosts.Where(p => p.ParentAccountPostId == postingId).OrderBy(p => p.Created).ToList();
            }
            catch (Exception ex)
            {
                scr.MessageForLog = scr.MessageForLog = string.Format("MESSAGE:{0} --- INNER-EXCEPTION:{1} --- SOURCE:{2} --- STACK-TRACE:{3}", ex.Message, ex.InnerException, ex.Source, ex.StackTrace);
                scr.MessageForUser = "There was an error retrieving posting for this mancave.";
            }

            //Log errors
            if (!scr.Success) LogSvc.LogError(scr.MessageForLog);

            return comments;
        }
    }
}
