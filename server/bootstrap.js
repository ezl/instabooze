// Products = new Meteor.Collection("products");

// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
    if (Products.find().count() === 0) {
        var data = [
            {name: "Ketel One",
             price: "21.99",
             description: "Premium Vodka. 750 mL.",
             order: 1,
            },
            {name: "Jack Daniels",
             price: "22.99",
             description: "Whiskey. 750 mL.",
             order: 2,
            },
            {name: "Miller Light",
             price: "13.99",
             description: "Beer. 24-pack of 12oz cans",
             order: 8,
            },
            {name: "Jose Cuervo Gold",
             price: "13.99",
             description: "Tequila. 750 mL.",
             order: 9,
            },
            {name: "Captain Morgan",
             price: "16.99",
             description: "Spiced Rum. 750 mL.",
             order: 10,
            },
        ];

        for (var i = 0; i < data.length; i++) {
            var product_id = Products.insert({
                name        : data[i].name,
                price       : data[i].price,
                description : data[i].description,
                order       : data[i].order,
            });
        }
    }
});

