using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Mancave.Models;

namespace Mancave.Helpers
{
    public static class Uploader
    {
        public static void UploadFile(HttpPostedFileBase file, string folder, string prefix, string userEmail, out Result result, bool photoFile=false)
        {
            result = new Result();

            prefix = !photoFile ? prefix + "_" : prefix;
            string[] fileParts = file.FileName.Split('.');
            string extension = fileParts[fileParts.Length - 1];
            string filenameRoot = !photoFile ? userEmail.Replace('@', '_') : Guid.NewGuid().ToString();
            string filename = string.Format("{0}{1}.{2}", prefix, filenameRoot, extension).ToLower();

            try
            {
                file.SaveAs(HttpContext.Current.Server.MapPath(string.Format("~/{0}/{1}", folder, filename)));
                result.DynObject = filename;
                result.Success = true;
            }
            catch(Exception ex)
            {
                result.MessageForUser = "There was an error uploading the file.";
                result.MessageForLog = ex.Message;
                LogSvc.LogError(ex.Message);

                throw ex;
            }
        }
    }
}