Products = new Meteor.Collection("products");
Orders = new Meteor.Collection("orders");

getDeliveryAmount = function() {
    var deliveryAmount = 5;
    return deliveryAmount;
};

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

    Meteor.Router.add({
        '/': 'landing',
        '/cart': 'cart',
        '/checkout': 'checkout',
        '/thankyou': 'thankyou',
    });


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
        return getCartItems();
    };

    Template.checkout.cartItems = function() {
        return getCartItems();
    };

    Template.stripe.stripeDescription = function() {
        var amount = (Math.round(getCartTotal()) * 100 / 100).toString();
        var items = getCartItems().length;
        return items + " Items ($" + amount + ")";
    };

    Template.stripe.stripeAmount = function() {
        return Math.round((getCartTotal()) * 100).toString();
    };

    var getCartItems = function() {
        return _.values(Session.get("cart"));
    };

    var getCartTotal = function() {
        sum = 0;
        sum += getDeliveryAmount();
        _.each(Session.get("cart"), function(cartItem) {
            sum += cartItem.item.price * cartItem.qty;
        });
        return Math.round(sum * 100) / 100;
    }

    Template.footer.orderTotal = function() {
        return getCartTotal();
    }

    Template.checkout.rendered = function() {
        stripeSnippet = [
        '  <script',
        '    src="https://checkout.stripe.com/v2/checkout.js" class="stripe-button"',
        //'    data-key="pk_loOkfFjY7S9v0FNnphUKIHKHXhkz8"',
        //'    data-amount="2000"',
        //'    data-name="Demo Site"',
        //'    data-description="2 widgets ($20.00)"',
        //'    data-image="/128x128.png">',
        '  </script>',
        ].join("");
        $("body").append(stripeSnippet);
    };

    Template.checkout.cart_repr = function() {
        var cart = {};
        _.each(getCartItems(), function(item) {
            if (item.qty) {
                console.log(item);
                cart[item.item._id] = item.qty;
            };
        });
        cartString = JSON.stringify(cart);
        console.log(cartString);
        return cartString;

    };
}
