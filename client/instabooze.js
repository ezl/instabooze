Products = new Meteor.Collection("products");

Meteor.startup(function() {
    cart = {}
    Meteor.subscribe('products', function () {
        Products.find().forEach(function(product) {
            cart[product._id] = {
                item: product,
                qty: 0,
            };
        });
        Session.set('cart', cart);
    });
    Session.set("step", "products");
});

var updateCart = function(itemID, delta) {
    // Get the shopping cart
    var cart = Session.get("cart");

    // Update item quantity
    cart[itemID].qty += delta;
    cart[itemID].qty = Math.max(cart[itemID].qty, 0);

    // Save the cart back to the session
    Session.set("cart", cart);
};

if (Meteor.isClient) {
    Template.cart.cartItems = function () {
        return _.values(Session.get("cart"));
    };
    Template.cart.events({
         'click .order.add' : function () {
            updateCart(this.item._id, 1);
        }
    });
    Template.cart.events({
        'click .order.remove' : function () {
            updateCart(this.item._id, -1);
        }
    });
    Template.cart.cartItems = function() {
        return _.values(Session.get("cart"));
    };
    Template.footer.orderTotal = function() {
        sum = 0;
        _.each(Session.get("cart"), function(cartItem) {
            sum += cartItem.item.price * cartItem.qty;
        });
        return sum;
    }
Template.cart.events = {
    'click .showCheckout': function(e, t) {
        Session.set('step', 'checkout');
        console.log(Session.get("step"));
    }
};
 
Template.checkout.events = {
    'click .showCart': function(e, t) {
        Session.set('step', 'products');
        console.log(Session.get("step"));
    }
};
    Template.main.helpers({
        isProductPage: function() {
            console.log("isproductpage template helper running");
            return Session.get("step") == "products";
        }
    });
}
