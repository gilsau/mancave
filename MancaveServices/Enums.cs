using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mancave.MancaveServices
{
    public enum StatusType
    {
        Failed = 1,
        Invited = 2,
        New = 3,
        Offline = 4,
        Online = 5,
        Read = 6,
        Sent = 7,
        Unread = 8,
        Active = 9
    }

    public enum CommType
    {
        Email = 1,
        InternalMessage = 2
    }

    public enum ActionType
    {
        Invitation = 1,
        None = 2
    }

    public enum ReceiverType
    {
        To = 1
    }

    public enum PrivacyType
    {
        Friends = 1,
        Public = 2
    }

}
