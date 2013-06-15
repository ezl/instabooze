Template.failwhale.events({
  
  'click #fail-signup-button': function(e, t) {
    
    e.preventDefault();
    
    var emailAddress = t.find("#fail-signup-email").value;
    
    if (emailAddress) {
      
      
      
    } else {
      alert("Woah there, Joker. Make sure to enter an email address.");
    }
    
  }
  
});