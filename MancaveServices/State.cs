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
    
    public partial class State
    {
        public State()
        {
            this.Accounts = new HashSet<Account>();
        }
    
        public int Id { get; set; }
        public string Abbrev { get; set; }
        public string Name { get; set; }
    
        public virtual ICollection<Account> Accounts { get; set; }
    }
}
