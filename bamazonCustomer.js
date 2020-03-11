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
    connection.query("SELECT * FROM products", function(error, response) {
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
    connection.query("SELECT * FROM products", function(err, result) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choose",
                /*type: "list",
                choices: function() {
                    var productArray = [];
                    for (var i = 0; i < result.length; i++) {
                        productArray.push(result[i].product_name)
                    }
                    return productArray;
                },
                message: "Which product you would like to purchase?"*/
                type: "input",
                message: "Enter the item ID of the product you would like to purchase: ",
                // Validating here forces the user to enter a number and won't take any other input
                validate: function(entry) {
                    if (isNaN(entry) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "amount",
                type: "input",
                message: "Enter the quantity you would like to purchase: ",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        // After the answers are stored, I need to access them with a .then() function in order to do anything
        ]).then(function(choice) {
            // Define a placeholder variable for the first inquirer prompt answer
            var productChoice;
            // Loop through the results from the beginning of the shop() function
            for (var c = 0; c < result.length; c++) {
                // If any of the results in the loop match the ID the user entered, then assign that to the variable above
                if (result[c].item_id === parseInt(choice.choose)) {
                    productChoice = result[c];
                }
            };
            // For the second inquirer prompt answer
            // If the user enters an amount less than what is in stock
            if (parseInt(choice.amount) <= productChoice.stock_quantity) {
                // Update the item's stock quantity in the database by subtracting the amount the user entered wherever the item_id matches the user input from the productChoice variable above
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: productChoice.stock_quantity - choice.amount
                        },
                        {
                            item_id: productChoice.item_id
                        },
                    ],
                    // Notify the user what they chose, how many of that item they chose, and what their total cost is based on the price in the database and how many items they wanted
                    function(error) {
                        if (error) throw error;
                        console.log(
                            "You've chosen " + 
                            choice.amount + 
                            " " + 
                            productChoice.product_name + 
                            ".\nYour total is: $" +
                            productChoice.price * choice.amount
                        );
                        discontinue();
                        connection.end();
                    }
                );
            // Otherwise, if the user enters a quantity that is more than what is in stock, they must start the program over again, enter a valid quantity, and the database is not altered
            } else {
                console.log("There are only " + productChoice.stock_quantity + " of those available. Please try again.");
                displayItems();
            }
        });
    });
};

function discontinue() {
    connection.query(
        "DELETE FROM products WHERE stock_quantity = 0",
        function(error) {
            if (error) throw error;
        }
    );
};