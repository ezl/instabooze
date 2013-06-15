Products = new Meteor.Collection("products");

Products.allow({
  insert: function(){
    return false;
  },
  update: function(){
    return false;
  },
  remove: function(){
    return false;
  }
});