// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
    if (Products.find().count() === 0) {
        var data = [
            {name: "Bacardi Rum",
             price: "19.99",
             description: "Superior White Rum. 750 mL.",
             order: 1,
             image: '/images/logos/bacardi_100x90.png',
            },
            {name: "Jack Daniels",
             price: "25.99",
             description: "Tennessee Whiskey. 750 mL. Nothing says 'I love America' more than Jack.",
             order: 2,
             image: '/images/logos/jack_100x90.png',
            },
            {name: "Absolut Vodka",
             price: "21.99",
             description: "Premium Vodka. 750 mL.",
             order: 3,
             image: '/images/logos/absolut_100x90.png',
            },
            {name: "Ketel One",
             price: "24.99",
             description: "Super Premium Vodka. 750 mL.",
             order: 4,
             image: '/images/logos/ketel_100x90.png',
            },
            {name: "Captain Morgan",
             price: "21.99",
             description: "Spiced Rum. 750 mL.",
             order: 5,
             image: '/images/logos/captainmorgan_100x90.png',
            },
            {name: "Jose Cuervo Silver",
             price: "15.99",
             description: "Tequila. 750 mL.",
             order: 6,
             image: '/images/logos/cuervo_100x90.png',
            },
            {name: "Pabst Blue Ribbon",
             price: "5.99",
             description: "A classic American Pilsner. 6-pack of 12oz cans",
             order: 7,
             image: '/images/logos/pbr_100x90.png',
            },
            {name: "312 Urban Wheat",
             price: "8.99",
             description: "Goose Island American Pale Wheat Ale. 6 bottles.",
             order: 8,
             image: '/images/logos/goose-island_100x90.png',
            },
            {name: "Ice",
             price: "5.00",
             description: "Frozen Water. 10 lb bag.",
             order: 9,
             image: '/images/logos/ice_100x90.png',
            },
            {name: "Bottled Water",
             price: "1.25",
             description: "H2O. 1 Bottle. Because you should hydrate while you booze.",
             order: 10,
             image: '/images/logos/water_100x90.png',
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

