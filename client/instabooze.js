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
        return _.values(Session.get("cart"));
    };

    Template.footer.orderTotal = function() {
        sum = 0;
        _.each(Session.get("cart"), function(cartItem) {
            sum += cartItem.item.price * cartItem.qty;
        });
        return sum;
    }

    Template.checkout.rendered = function() {
        // Check this out.  This fuck is crazy.  If I left line 56 it works, but line 55 breaks, notic
        // it does the same thing, basically this.find... you go
        // console.log(this.find(".stripe-checkout-container"));
        // this.find("body");
        //var foo = this.find(".stripe-checkout-container");
        //console.log(foo);
        //console.log("hi. this is a console.log. no errors.");
        stripeSnippet = [
        '<form action="" method="POST">',
        '  <script',
        '    src="https://checkout.stripe.com/v2/checkout.js" class="stripe-button"',
        '    data-key="pk_loOkfFjY7S9v0FNnphUKIHKHXhkz8"',
        '    data-amount="2000"',
        '    data-name="Demo Site"',
        '    data-description="2 widgets ($20.00)"',
        '    data-image="/128x128.png">',
        '  </script>',
        '</form>',
        ].join("");
        $("body").append(stripeSnippet);
    };
}
