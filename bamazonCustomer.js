var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",

	password: "",
	database: "bamazon"
})

function initialPrompt(){


	inquirer.prompt([
	{
		type: "input",
		name: "productID",
		message: "What is the ID of the product you wish to purchase?"
	},
	{
		type: "input",
		name: "buyQuantity",
		message: "How many units of the product will you be buying?"
	}

	]).then(function(user){

		connection.query('SELECT * FROM products WHERE ?',
			{
				product_name: user.productID
			}, function(err, list){
				var currentStock = list[0].stock_quantity;
				if (user.buyQuantity<currentStock){
					console.log("You're total cost will be $" + (list[0].price*user.buyQuantity));
					var newQuantity = currentStock - user.buyQuantity;
					connection.query('UPDATE products SET stock_quantity=? WHERE product_name=?',
						[newQuantity,user.productID],
						function(err,title){
						  if(err) throw err;

					});
				} else {
					console.log("Insuffienct quantity!")
				}
		});
	});
};

initialPrompt();