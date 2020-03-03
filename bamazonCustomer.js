var mysql = require("mysql");
var inquirer = require("inquirer");
// With npm table, the curly braces matter when requiring the package.
var {table} = require("table");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "RCJh2014!",
    database: "bamazon"
});

// Connect to the database first. This function will not work if it is coded within another function.
connection.connect(function(error) {
    if(error) throw error;
    console.log("Welcome to Bamazon!");
    displayItems();
});

// Function that displays all items in the database upon running the file in node.
function displayItems() {
    console.log("Loading items...");
    connection.query("select * from products", function(error, response) {
        if(error) throw error;
        var data = [["ID", "Product Name", "Department Name", "Price(USD)", "# In Stock"]];
        var output;
        for (var i = 0; i < response.length; i++) {
            var product = [response[i].item_id.toString(), response[i].product_name.toString(), response[i].department_name.toString(), response[i].price.toString(), response[i].stock_quantity.toString()];
            data.push(product);
        };
        output = table(data);
        console.log(output + "\n");
        inquirer.prompt({
            name: "shop",
            type: "list",
            message: "Would you like to buy something?",
            choices: ["Yes", "No"]
        }).then(function(answer) {
            if (answer.shop === "Yes") {
                shop();
            } else {
                connection.end();
            }
        });
    });
};

// Inquirer function that asks the user to enter which item they want and how many.
function shop() {
    connection.query("select * from products", function(err, result) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choose",
                type: "list",
                choices: function() {
                    var productArray = [];
                    for (var i = 0; i < result.length; i++) {
                        productArray.push(result[i].product_name)
                    }
                    return productArray;
                },
                message: "Which product you would like to purchase?"
            },
            {
                name: "amount",
                type: "input",
                message: "Enter the quantity you would like to purchase: "
            }
        ]).then(function(choice) {
            var productChoice;
            for (var c = 0; c < result.length; c++) {
                if (result[c].product_name === choice.choose) {
                    productChoice = result[c];
                }
            };
            if (parseInt(choice.amount) <= productChoice.stock_quantity) {
                connection.query(
                    "update products set ? where ?",
                    [
                        {
                            stock_quantity: stock_quantity - choice.amount
                        },
                        {
                            item_id: choice.item_id
                        },
                        function(error) {
                            if (error) throw error;
                            console.log("You've chosen " + choice.amount + " " + productChoice.product_name + ".");
                            displayItems();
                        }
                    ]
                )
            } else {
                console.log("There are only " + productChoice.stock_quantity + " of those available. Please try again.");
                displayItems();
            }
            // console.log(productChoice);
            // console.log("You've chosen " + choice.amount + " " + productChoice.product_name + ".");
        });
        // console.log("You've chosen " + choose + ".");
    });
};