//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Mancave.MancaveServices
{
    using System;
    using System.Collections.Generic;
    
    public partial class AccountCalendarEvent
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string EventName { get; set; }
        public string EventDescription { get; set; }
        public System.DateTime EventDate { get; set; }
        public Nullable<bool> Deleted { get; set; }
    
        public virtual Account Account { get; set; }
    }
}