Meteor.publish('products', function () {
  return Products.find();
});

Meteor.publish('orders', function () {
  return Orders.find();
});

