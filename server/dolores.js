
Meteor.Router.add('/checkout', 'POST', function() {
    var post = this.request.body;
    console.log(post.cart);
    var cart = JSON.parse(post.cart);
    console.log(cart, cart[0], cart[0].id);

    console.log("POST REQUEST:", post);
    console.log(post.name);
    return [302, {"Location": "/thankyou"}, "/thankyou"];
});

