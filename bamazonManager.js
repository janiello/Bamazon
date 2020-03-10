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

// Connect to the database
connection.connect(function(error) {
    if(error) throw error;
    // Add a message so we know the connection is working
    console.log("Hello, Bamazon Manager.");
    // Call the mainMenu function to begin the program
    mainMenu();
});

// Prompt the user with a list of options to choose to from
function mainMenu() {
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }).then(function(selection) {
        // Based on the selection from the menu, run certain functions
        if (selection.menu === "View Products for Sale") { 
            viewAll();
        } else if (selection.menu === "View Low Inventory") {
            viewLow();
        } else if (selection.menu === "Add to Inventory") {
            restock();
        } else if (selection.menu === "Add New Product") {
            addProduct();
        } else {
            connection.end();
        }
    });
}

// Function that displays all inventory in the database for the user
function viewAll() {
    console.log("Loading inventory... Done.");
    connection.query("SELECT * FROM products", function(error, response) {
        if (error) throw error;
        var data = [["ID", "Product Name", "Department Name", "Price (USD)", "# In Stock"]];
        var output;
        for (var i = 0; i < response.length; i++) {
            var product = [response[i].item_id.toString(), response[i].product_name.toString(), response[i].department_name.toString(), response[i].price.toString(), response[i].stock_quantity.toString()];
            data.push(product);
        };
        output = table(data);
        console.log(output + "\n");
        mainMenu();
    });
};

// Function that pulls and displays all inventory below a certain amount so the user can see what needs restocking
function viewLow() {
    console.log("These items are going fast. You should restock them soon.");
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(error, response) {
        if (error) throw error;
        var data = [["ID", "Product Name", "Department Name", "Price (USD)", "# In Stock"]];
        var output;
        for (var i = 0; i < response.length; i++) {
            var product = [response[i].item_id.toString(), response[i].product_name.toString(), response[i].department_name.toString(), response[i].price.toString(), response[i].stock_quantity.toString()];
            data.push(product);
        };
        output = table(data);
        console.log(output + "\n");
        mainMenu();
    });
};

// Function that allows the user to add inventory to any item in the database
function restock() {
    connection.query("SELECT * FROM products", function(error, response) {
        if (error) throw error;
        // Prompt the user to choose an item from the database to restock
        inquirer.prompt([
            {
                name: "item",
                type: "list",
                choices: function() {
                    var itemArray = [];
                    for (var i = 0; i < response.length; i++) {
                        itemArray.push(response[i].product_name);
                    }
                    return itemArray;
                },
                message: "Which product would you like to restock?"
            },
            // Then prompt the user to enter the amount of the item they would like to add to the database
            {
                name: "stock",
                type: "input",
                message: "How many units would you like to add?",
                validate: function(entry) {
                    if (isNaN(entry) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function(answer) {
            // Here we are essentially performing the same function as the customer.js prompt to choose a product and amount, but performing the opposite operations to add inventory instead of deplete it.
            var productChoice;
            for (var p = 0; p < response.length; p++) {
                if (response[p].product_name === answer.item) {
                    productChoice = response[p];
                }
            };
            var stockAmount = parseInt(answer.stock);
            // Since the user can add any amount of the product they want, we won't need to check it against how many of the item is already in the database. So...
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: productChoice.stock_quantity + stockAmount
                    },
                    {
                        product_name: productChoice.product_name
                    }
                ],
                function(error) {
                    if (error) throw error;
                    console.log("Inventory has been successfully replenished!");
                    mainMenu();
                    // I tried to display the new database info for the restocked item, but the table query from above applied to one item didn't work. Will look into later.
                }
            );
        });
    });
};

// Function that allows the user to add new data rows by first prompting the user to enter information for each category in the database
function addProduct() {
    inquirer.prompt([
        {
            name: "newProduct",
            type: "input",
            message: "What is the name of the product you would like to add?"
        },
        {
            name: "newDepartment",
            type: "list",
            choices: ["Electronics", "Games", "Appliances", "Home and Kitchen", "Sports and Fitness", "Other"],
            message: "What department will this product be in?"
        },
        {
            name: "newPrice",
            type: "input",
            message: "Please enter the cost of the new product.",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "stockQuantity",
            type: "input",
            message: "Please enter how many you would like to add to the inventory.",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    // Storing the answers in a .then() function
    ]).then(function(entry) {
        // To access and use the numerical value of any entry for mathematical purposes, we need to parse it and assign it to a variable
        var newPrice = parseInt(entry.newPrice);
        var newAmount = parseInt(entry.stockQuantity);
        connection.query(
            "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
            [
                entry.newProduct, entry.newDepartment, newPrice, newAmount
            ],
            function(error) {
                if (error) throw error;
                // Console logging responses so the user can see what they entered before needing to call the database
                console.log(
                    "Successfully added new product!\nNew Product Name: " +
                    entry.newProduct +
                    "\nNew Product Department: " +
                    entry.newDepartment +
                    "\nNew Product Price: $" +
                    newPrice +
                    "\nNew Product Availability: " +
                    newAmount
                );
                mainMenu();
            }
        );
    });
};