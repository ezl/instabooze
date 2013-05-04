// Products = new Meteor.Collection("products");

// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
    if (Products.find().count() === 0) {
        var data = [
            {name: "Ketel One",
             price: "24.95",
             description: "Premium Vodka. 750 mL.",
             order: 1,
             image: '/images/logos/ketel_100x90.png',
            },
            {name: "Jack Daniels",
             price: "24.95",
             description: "Whiskey. 750 mL.",
             order: 2,
             image: '/images/logos/jack_100x90.png',
            },
            {name: "Miller Light",
             price: "14.95",
             description: "Beer. 24-pack of 12oz cans",
             order: 8,
             image: '/images/logos/miller_100x90.png',
            },
            {name: "Patron Silver",
             price: "41.95",
             description: "Tequila. 750 mL.",
             order: 9,
             image: '/images/logos/patron_100x90.png',
            },
            {name: "Jose Cuervo Gold",
             price: "15.95",
             description: "Tequila. 750 mL.",
             order: 9,
             image: '/images/logos/cuervo_100x90.png',
            },
            {name: "Captain Morgan",
             price: "17.95",
             description: "Spiced Rum. 750 mL.",
             order: 10,
             image: '/images/logos/captainmorgan_100x90.png',
            },
        ];

        for (var i = 0; i < data.length; i++) {
            var product_id = Products.insert({
                name        : data[i].name,
                price       : data[i].price,
                description : data[i].description,
                order       : data[i].order,
                image       : data[i].image,
            });
        }
    }
});

