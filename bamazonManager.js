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
    console.log("Hello, Bamazon Manager. What would you like to do?");
});