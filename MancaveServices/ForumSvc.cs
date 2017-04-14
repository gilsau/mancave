using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Mancave.MancaveServices
{
    public class ForumSvc
    {
        private MancaveEntities db;
        
        public ForumSvc()
        {
            db = new MancaveEntities();
        }

        public Forum CreateForum(string name, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            Forum forum = new Forum();
            forum.Name = name;
            forum.OwnerAccountId = ((Account)HttpContext.Current.Session["User"]).Id;
            forum.Created = DateTime.Now;

            db.Fora.Add(forum);
            db.SaveChanges();

            return forum;
        }

        public Topic AddTopic(string name, int forumId, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            Topic topic = new Topic();
            topic.Name = name;
            topic.ForumId = forumId;
            topic.OwnerAccountId = ((Account)HttpContext.Current.Session["User"]).Id;
            topic.Created = DateTime.Now;

            db.Topics.Add(topic);
            db.SaveChanges();

            return topic;
        }

        public ForumMessage AddForumMsg(string comment, int topicId, HttpPostedFileBase photoFile, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            //Save photo
            string photoFilename = string.Empty;
            string photoFilenameFull = string.Empty;
            if(photoFile != null)
            {
                Guid photoGuid = Guid.NewGuid();
                string extension = photoFile.FileName.Split('.').Max();
                photoFilename = string.Format("{0}.{1}", photoGuid, extension);
                photoFilenameFull = HttpContext.Current.Server.MapPath(string.Format("~/photos/{0}", photoFilename));
                photoFile.SaveAs(photoFilenameFull);
            }

            ForumMessage msg = new ForumMessage();
            msg.Message = comment;
            msg.PhotoFile = photoFilename;
            msg.TopicId = topicId;
            msg.OwnerAccountId = ((Account)HttpContext.Current.Session["User"]).Id;
            msg.Created = DateTime.Now;

            db.ForumMessages.Add(msg);
            db.SaveChanges();

            return msg;
        }

        public Forum GetForumById(int forumId, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            Forum forum = db.Fora.SingleOrDefault(f => f.Id == forumId);

            return forum;
        }

        public List<Forum> GetForums(out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            List<Forum> forums = db.Fora.ToList();
            
            return forums;
        }

        public Topic GetTopicById(int topicId, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            Topic topic = db.Topics.SingleOrDefault(t => t.Id == topicId);

            return topic;
        }


        public List<Topic> GetTopics(int forumId, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            List<Topic> topics = db.Topics.Where(t => t.ForumId == forumId).ToList();

            return topics;
        }

        public List<ForumMessage> GetForumMsgs(int topicId, out ServiceCallResult scr)
        {
            scr = new ServiceCallResult();

            List<ForumMessage> msgs = db.ForumMessages.Where(m => m.TopicId == topicId).ToList();

            return msgs;
        }
    }
}
