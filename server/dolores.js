
Meteor.Router.add('/checkout', 'POST', function() {
    // console.log(Session);
    console.log("POST REQUEST", this.params, this.request.body);
    // I want to either 1) redirect to a template "post payment";
    // 2) redirect to checkout page, but it doesn't work...
    // returning a string will make that string the response, not
    // the template, gotta figure this.
    return [302, {"Location": "/thankyou"}, "/thankyou"];
});

