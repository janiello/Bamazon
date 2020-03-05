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

// Functions for testing, will add appropriate code once the menu is working
function viewAll() {
    console.log("Here ya go.");
    mainMenu();
};

function viewLow() {
    console.log("We need more cowbell!");
    mainMenu();
};

function restock() {
    console.log("Fully loaded.");
    mainMenu();
};

function addProduct() {
    console.log("NEW! FANCY! BUY IT! GIMME YOUR MONEY!");
    mainMenu();
};