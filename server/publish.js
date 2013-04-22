Products = new Meteor.Collection("products");

Meteor.publish('products', function () {
  return Products.find();
});
