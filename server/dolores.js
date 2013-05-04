Meteor.Router.add('/checkout', 'POST', function() {
    var post = this.request.body;
    // console.log("POST REQUEST:", post);
    var cart = JSON.parse(post.cart);
    var cartTotal = 0;
    var orderText = "";

    //
    // Make sure the total value is correctly calculated.  Avoid possible
    // hacks on the frontend affect the value we charge the user.
    //
    var total_qty = 0;
    _.each(_.keys(cart), function(id) {
        product = Products.findOne({_id: id});
        qty = cart[id];
        total_qty += cart[id];
        orderText += qty + '\t' + product.price + '\t' + product.name + '\n';
        cartTotal += qty * product.price;
    });
    var deliveryAmount = 5; // getDeliveryAmount() can't be found;
    if (total_qty > 3)
        deliveryAmount = 10;
    var tax = 10.25 / 100;

    cartTotal += deliveryAmount;
    cartTotal *= 1 + tax;

    orderText += cartTotal + " Total";
    var stripeChargeAmount = parseInt(cartTotal * 100);
    //console.log(stripeChargeAmount);
    var deliveryInformation = [
        'Name          : ' + post.name,
        'Address       : ' + post.address,
        'Unit          : ' + '',
        'Email         : ' + post.email,
        'Cell Phone    : ' + post.cell,
        'Delivery Info : ' + '\n' + orderText,
    ].join('\n');
    process.env.MAIL_URL = "smtp://localhost/";
    Email.send({
        to: "ericzliu@gmail.com",
        from: "instabooze@instabooze.net",
        subject: "Your order",
        text: deliveryInformation
    });
    //console.log(deliveryInformation);

    return [302, {"Location": "/thankyou"}, "/thankyou"];
});

