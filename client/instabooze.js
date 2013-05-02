Products = new Meteor.Collection("products");
Orders = new Meteor.Collection("orders");

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
    Template.footer.cartItems = function() {
        itemlist=[];
        _.each(Session.get("cart"), function(item) {
            for (var i=0;i<item.qty;i++) {
                itemlist.push(item.item.name);
            };
        });
        return itemlist;
    };

    Template.cart.events({
         'click .order.add' : function (e) {
            e.preventDefault();
            updateCart(this.item._id, 1);
        }
    });

    Template.checkout.events({
        'click .stripeButton' : function(){
            var stripeLibraries = $('<script src="https://checkout.stripe.com/v2/checkout.js"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>');
            $("body").append(stripeLibraries);

            var token = function(res){
                var $input = $('<input type=hidden name=stripeToken />').val(res.id);
                $('form').append($input).submit();
            };

            StripeCheckout.open({
                key:         'pk_loOkfFjY7S9v0FNnphUKIHKHXhkz8',
                // address:     true,
                amount:      Math.round(getOrderTotal() * 100),
                name:        'InstaBooze',
                description: getStripeDescription(),
                panelLabel:  'Pay',
                image: "/marketplace.png",
                token:       token
            });
            return false;
        },
        'click input[type="checkbox"]' : function(event){
            var checkboxes = $('input[type="checkbox"]').length;
            var checked = $("input:checked" ).length;
            if (checked === checkboxes) {
                $("input[type='text']").prop('disabled', false);
                console.log("enable");
            } else {
                $("input[type='text']").prop('disabled', true);
                console.log("disable all");
            };
        }

    });

    Template.cart.events({
        'click .order.remove' : function (e) {
            e.preventDefault();
            updateCart(this.item._id, -1);
        }
    });

    Template.cart.cartItems = function() {
        return getCartItems();
    };

    Template.checkout.cartItems = function() {
        return getCartItems();
    };

    Template.checkout.subtotal = function() {
        return getCartTotal();
    };

    var getNumItemsInCart = function() {
        var qty = 0;
        _.each(Session.get("cart"), function(item) {
            qty += item.qty;
        });
        return qty;
    };
    Template.checkout.deliveryCost = function() {
        qty = getNumItemsInCart();
        if (qty == 0)
            return 0.0;
        if (qty > 3)
            return 10.0;
        return 5.0;
    };

    Template.checkout.taxCost = function() {
        var taxRate = 0.1025;
        var taxAmount = (Template.checkout.subtotal() + Template.checkout.deliveryCost()) * taxRate;
        return Math.round(taxAmount * 100) / 100;
    };

    var getOrderTotal = function() {
        var unrounded = Template.checkout.subtotal() + Template.checkout.deliveryCost() + Template.checkout.taxCost();
        return Math.round(unrounded * 100) / 100;

    };
    Template.checkout.orderTotal = getOrderTotal;

    var getStripeDescription = function() {
        var amount = getOrderTotal().toString();
        var items = getNumItemsInCart();
        return items + " Items ($" + amount + ")";
    };

    var getCartItems = function() {
        return _.values(Session.get("cart"));
    };

    var getCartTotal = function() {
        sum = 0;
        _.each(Session.get("cart"), function(cartItem) {
            sum += cartItem.item.price * cartItem.qty;
        });
        return Math.round(sum * 100) / 100;
    }

    Template.footer.orderTotal = function() {
        return getCartTotal();
    }

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
