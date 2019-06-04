var mysql = require("mysql");
var inquirer = require("inquirer");
// With npm table, the curly braces matter when requiring the package.
var {table} = require("table");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "bamazon"
});

// Connect to the database first. This function will not work if it is coded within another function.
connection.connect(function(error) {
    if(error) throw error;
    console.log("Welcome to Bamazon!");
    displayItems();
});

// Function that displays all items in the database upon running the file in node.
displayItems = function() {
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
        connection.end();
        // Calling the shop function here runs the display, THEN asks the user which product they want.
        shop();
    });
};

// Inquirer function that asks the user to enter which item they want and how many.
shop = function() {
    var chooseId = {
        name: "choose",
        type: "input",
        message: "Enter the ID number of the product you would like to purchase: "
    };
    inquirer.prompt(chooseId).then(want => {
        var want = want.choose;
        // Print the product_name based on the item_id that was entered...
        console.log(want);
        // Calling the howMany function here allows the user to enter the product they want first, then asking how much of that product they want.
        howMany();
        // Calling both shop and howMany individually would bring up both prompts simultaneously and interfere with the displayItems table.
    });
};

// Second inquirer function that asks the user how many of the product they want.
howMany = function() {
    var chooseQty = {
        name: "amount",
        type: "input",
        message: "Enter the quantity you would like to purchase: "
    };
    inquirer.prompt(chooseQty).then(thisMany => {
        var thisMany = thisMany.amount;
        console.log(thisMany);
    });
};