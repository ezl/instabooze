Products = new Meteor.Collection("products");
Orders = new Meteor.Collection("orders");

var siteIsOpen = function() {
    var openDays = ["Thursday", "Friday", "Saturday"];
    var openHours = [12,13,14,15,16,17,18,19,20,21,22];
    var todaysDayName = Date.today().getDayName();
    if (_.indexOf(openDays, todaysDayName) == -1) {
        return false;
    }

    // OK, boozefiend, you passed the day test.  lets see if the hours are good...
    var d = new Date();
    var hour = d.getHours();
    if (_.indexOf(openHours, hour) == -1) {
        return false;
    }
    return true;
}

Meteor.startup(function() {
    Session.set('openforbusiness', siteIsOpen());
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


// HELPER FUNCTIONS

    var updateCart = function(itemID, delta) {
        // Get the shopping cart
        var cart = Session.get("cart");

        // Update item quantity
        cart[itemID].qty += delta;
        cart[itemID].qty = Math.max(cart[itemID].qty, 0);

        // Save the cart back to the session
        Session.set("cart", cart);
    };

    var getNumItemsInCart = function() {
        var qty = 0;
        _.each(Session.get("cart"), function(item) {
            qty += item.qty;
        });
        return qty;
    };

    var getOrderTotal = function() {
        var unrounded = parseFloat(Template.checkout.subtotal()) + parseFloat(Template.checkout.deliveryCost()) + parseFloat(Template.checkout.taxCost());
        return parseFloat(Math.round(unrounded * 100) / 100).toFixed(2);
    };

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

// END HELPDER FUNCTIONS

if (Meteor.isClient) {

    Meteor.Router.add({
        '/': {
            as: 'landing',
            to: function() {
                if (Session.get('openforbusiness')) {
                    return 'landing';
                } else {
                    return 'closed';
                }
            }
        },


        '/cart': {
            as: 'cart',
            to: function() {
                if (Session.get('openforbusiness')) {
                    return 'cart';
                } else {
                    return 'closed';
                }
            }
        },

        '/checkout': {
            as: 'checkout',
            to: function() {
                if (Session.get('openforbusiness')) {
                    return 'checkout';
                } else {
                    return 'closed';
                }
            }
        },
        

        '/closed': 'closed',

        '/thankyou': 'thankyou',
        '/delivery-zone-and-hours': 'delivery-zone-and-hours',
        '/fees': 'fees',
    });

    Template.header.page = function() {
        return Meteor.Router.page();
    };

    Template.header.pageIsCart = function() {
        return Meteor.Router.page() === "cart";
    };

    Template.header.pageIsCheckout = function() {
        return Meteor.Router.page() === "checkout";
    }; // these just feel really dumb...

    Template.footer.subtotal = function() {
        return parseFloat(getCartTotal()).toFixed(2);
    }

    Template.footer.orderedItems = function() {
        itemlist=[];
        _.each(Session.get("cart"), function(item) {
            for (var i=0;i<item.qty;i++) {
                itemlist.push(item.item.name);
            };
        });
        return itemlist;
    };

    Template.cart.cartItems = function() {
        return getCartItems();
    };

    Template.checkout.orderedItems = Template.footer.orderedItems; // i hate this. f me.

    Template.checkout.cartItems = function() {
        return getCartItems();
    };

    Template.checkout.subtotal = Template.footer.subtotal

    Template.checkout.deliveryCost = function() {
        qty = getNumItemsInCart();
        if (qty == 0)
            return 0.0;
        if (qty > 3)
            return 10.0;
        return 5.0;
    };

    Template.checkout.taxCost = function() {
        var taxRate = 0.1050;
        var subtotal = Template.checkout.subtotal();
        var deliveryCost = Template.checkout.deliveryCost();
        var taxAmount = (parseFloat(subtotal) + deliveryCost) * taxRate;
        return parseFloat(Math.round(taxAmount * 100) / 100).toFixed(2);
    };

    Template.checkout.orderTotal = getOrderTotal;

    Template.checkout.cart_repr = function() {
        var cart = {};
        _.each(getCartItems(), function(item) {
            if (item.qty) {
                cart[item.item._id] = item.qty;
            };
        });
        cartString = JSON.stringify(cart);
        return cartString;
    };

    // EVENTS EVENTS EVENTS

    Template.cart.events({
         'click .order.add' : function (e) {
            e.preventDefault();
            updateCart(this.item._id, 1);
        }
    });

    Template.cart.events({
        'click .order.remove' : function (e) {
            e.preventDefault();
            updateCart(this.item._id, -1);
        }
    });

    Template.checkout.rendered = function() {
        var stripeLibraries = $('<script src="https://checkout.stripe.com/v2/checkout.js"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>');
        $("body").append(stripeLibraries);
    };

    Template.checkout.events({
        'click #verify-age': function(e, t) {
            e.preventDefault();

            var $this = $(e.target);

            $this.parent().slideUp();

            $(".loc-check").slideDown();

        },
        'click #verify-loc': function(e, t) {
            e.preventDefault();

            var $this = $(e.target);

            $this.parent().slideUp();

            $("#order-form").slideDown();

        },
        'click .stripeButton' : function(){
            $('#spinner').show().delay(3000).fadeOut()

            var token = function(res){
                var $input = $('<input type=hidden name=stripeToken />').val(res.id);
                $('form').append($input).submit();
            };

            // http://stackoverflow.com/questions/16198480/using-stripe-payment-form-in-meteor
            StripeCheckout.open({
                // key:         'pk_live_Jd7gUj9oEVcEAaNobds40dxq',
                key:         'pk_test_EhEkcAl2o9ccwevq8I1Mx4Ft',
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
    });


/*
    Meteor.Router.filters({
        'checkCartHasItems': function(page) {
            if (getNumItemsInCart() > 0) {
                return page;
            } else {
                return 'cart';
            }
        }
    });

    Meteor.Router.filter('checkCartHasItems', {only: 'checkout'});
*/
}
