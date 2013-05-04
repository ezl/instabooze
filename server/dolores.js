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

    orderText += "Total" + '\t' + parseFloat(cartTotal).toFixed(2);

    // Form validation -- need a valid email address and phone number.

    var stripeChargeAmount = parseInt(cartTotal * 100);
    //console.log(stripeChargeAmount);
    // We need to actually charge the card on stripe...

    // is there a valid stripe token? if not, kick out.
    // is the email address valid? if not, kick out.
    // in the front end, ensure that there is an address, the email and phone number are valid

    // customer.io? or something to ask them the next day to rate experience and share?


    var deliveryInformation = [
        'Name          : ' + post.name,
        'Address       : ' + post.address,
        'Unit          : ' + post.unit,
        'Email         : ' + post.email,
        'Cell Phone    : ' + post.cell,
        'Instructions  : ' + post.instructions + '\n',
        'Order Informaion : ' + '\n\n' + orderText,
    ].join('\n');

    var emailBody = [
        'Howdy,',
        '',
        'Your InstaBooze order was processed without a hitch! Someone should be there with your order in about 45 minutes.',
        '',
        'Please make sure you are available via the phone number so our delivery team can find you quickly when they arrive. Also, please be sure to have a valid, government-issued ID that indicates you are 21 or older and can legally buy alcoholic beverages.',
        '',
        'Stay safe and please remember to drink responsibly.',
        '',
        'Your Order Details',
        '==================',
        deliveryInformation,
    ].join('\n');

    var fromField = "instabooze@instabooze.net";
    var toField = ["eric@instabooze.net", "chromano@gmail.com", post.email];

    // process.env.MAIL_URL = "smtp://localhost/";
    Email.send({
        to: toField,
        from: fromField,
        subject: "Instabooze order confirmation",
        text: emailBody,
    });
    //console.log(deliveryInformation);

    return [302, {"Location": "/thankyou"}, "/thankyou"];
});

