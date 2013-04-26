
Meteor.Router.add('/checkout', 'POST', function() {
    var post = this.request.body;
    console.log("POST REQUEST:", post);
    var cart = JSON.parse(post.cart);
    var cartTotal = 0;
    var orderText = "";
    _.each(_.keys(cart), function(id) {
        product = Products.findOne({_id: id });
        // console.log(product, product.name, product.price);
        qty = cart[id];
        // console.log(qty);
        orderText += qty + '\t' + product.price + '\t' + product.name + '\n';
        cartTotal += qty * product.price;
    });
    var deliveryAmount = 5; // getDeliveryAmount() can't be found;
    cartTotal += deliveryAmount;
    orderText += cartTotal + " Total";
    var stripeChargeAmount = Math.round(cartTotal * 100);
    console.log(orderText);
    console.log(stripeChargeAmount);
    var deliveryInformation = [
        'Name          : ' + post.name,
        'Address       : ' + post.address,
        'Unit          : ' + '',
        'Email         : ' + post.email,
        'Cell Phone    : ' + post.cell,
        'Delivery Info : ' + '',
    ].join('\n');
    console.log(deliveryInformation);

    return [302, {"Location": "/thankyou"}, "/thankyou"];
});

