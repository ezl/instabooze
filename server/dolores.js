Meteor.Router.add('/checkout', 'POST', function() {
    var post = this.request.body;
    console.log("POST REQUEST:", post);
    var cart = JSON.parse(post.cart);
    var subTotal = 0;
    var orderText = "";
    // var stripeToken = JSON.parse(post.stripeToken);

    //
    // Make sure the total value is correctly calculated.  Avoid possible
    // hacks on the frontend affect the value we charge the user.
    //
    var total_qty = 0;
    _.each(_.keys(cart), function(id) {
        product = Products.findOne({_id: id});
        qty = cart[id];
        total_qty += cart[id];
        orderText += qty + '\t' + parseFloat(product.price * qty).toFixed(2) + '\t' + product.name + ' (' + product.price + ')' + '\n';
        subTotal += qty * product.price;
    });

    var deliveryAmount = 5; // getDeliveryAmount() can't be found;
    if (total_qty > 3)
        deliveryAmount = 10;

    var taxRate = 10.5 / 100;
    cartTotal = subTotal + deliveryAmount;
    var tax = cartTotal * taxRate;
    cartTotal += tax;

    orderText += "--------------------------" + '\n';
    orderText += "Subtotal" + '\t' + parseFloat(subTotal).toFixed(2) + '\n';
    orderText += "Delivery" + '\t' + parseFloat(deliveryAmount).toFixed(2) + '\n';
    orderText += "Tax" + '\t' + parseFloat(tax).toFixed(2) + '\n';
    orderText += "==========================" + '\n';
    orderText += "Total" + '\t' + parseFloat(cartTotal).toFixed(2) + '\n';

    // Form validation -- need a valid email address and phone number.

    var stripeChargeAmount = parseInt(cartTotal * 100);
    var stripeSecretKey = 'sk_live_ewB9zfLKSGSoyCNkvKEx7Hf2';

    var Stripe = StripeAPI(stripeSecretKey);

    //console.log(stripeChargeAmount);
    // We need to actually charge the card on stripe...

    // is there a valid stripe token? if not, kick out.
    // is the email address valid? if not, kick out.
    // in the front end, ensure that there is an address, the email and phone number are valid

    var orderID = Date.now() + post.email;

    console.log(" *** Before charging stripe");
    Stripe.charges.create({
        amount: stripeChargeAmount,
        currency: "USD",
        description: orderID + post.email,
        card: {
            number: "4242424242424242",
            exp_month: "03",
            exp_year: "2014"
        }
    }, function (err, res) {
        console.log(err, res);
    });
    console.log(" *** After charging stripe");

    // customer.io? or something to ask them the next day to rate experience and share?


    var deliveryInformation = [
        'Name          : ' + post.name,
        'Address       : ' + post.address,
        'Unit          : ' + post.unit,
        'Email         : ' + post.email,
        'Cell Phone    : ' + post.cell,
        '\nAny Additional Delivery Instructions:\n' + post.instructions + '\n\n',
        'Order ID      : ' + orderID + '\n',
        'Order Information :' + '\n\n' + orderText,
    ].join('\n');

    var emailBody = [
        '==DELIVERY CONFIRMATION FOR INSTABOOZE==',
        '',
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
    var recipients = ["orders@instabooze.net", post.email];

    recipients.forEach(function(recipient) {
        console.log("sending an email to: " + recipient);
        // process.env.MAIL_URL = "smtp://localhost/";
        Email.send({
            to: recipient,
            from: fromField,
            subject: "Instabooze order confirmation",
            text: emailBody,
        });
        //console.log(deliveryInformation);
    });

    return [302, {"Location": "/thankyou"}, "/thankyou"];
});

