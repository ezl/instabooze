$(document).ready(function() {
    console.log("hi. this is loading.");
    $('.showCheckout').live("click", function(event) {
        Session.set("step", "checkout");
        console.log(Session.get("step"));
    });
    $('.showCart').live("click", function(event) {
        Session.set("step", "products");
        console.log(Session.get("step"));
    });
});

