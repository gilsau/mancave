using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Dynamic;

namespace Mancave.MancaveServices
{
    public class ServiceCallResult
    {
        public int Id { get; set; }
        public bool Success { get; set; }
        public string MessageForLog { get; set; }
        public string MessageForUser { get; set; }
        public dynamic DynObject { get; set; }

        public ServiceCallResult()
        {
            Success = false;
            Id = 0;
            MessageForLog = string.Empty;
            MessageForUser = string.Empty;
            DynObject = null;
        }
    }
}
