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

displayItems = function() {
    console.log("Loading items...");
    connection.query("select * from products", function(error, response) {
        if(error) throw error;
        var data = [["ID", "Product Name", "Department Name", "Price", "# In Stock"]];
        var output;
        for (var i = 0; i < response.length; i++) {
            var product = [response[i].item_id.toString(), response[i].product_name.toString(), response[i].department_name.toString(), response[i].price.toString(), response[i].stock_quantity.toString()];
            data.push(product);
        };
        output = table(data);
        console.log(output + "\n");
        connection.end();
    });
};