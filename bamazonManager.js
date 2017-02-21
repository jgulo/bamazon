var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",

	password: "",
	database: "bamazon"
})

function viewProducts(){
	connection.query('SELECT * FROM products',function(err,list){
	  if(err) throw err;
	  console.log(list);
	});
}

function viewLowInventory(){
	connection.query('SELECT * FROM products', function(err,list){
		for(var i=0; i<list.length;i++){
			if(list[i].stock_quantity<5){
				console.log("There are only " + list[i].stock_quantity + " more " + list[i].product_name + "s.")
			}
		}
	});
}

function addInventory(){
	inquirer.prompt([
	{
		type: "input",
		name: "productID",
		message: "Which product would you like to add more to the inventory??"
	},
	{
		type: "input",
		name: "addStock",
		message: "How many units will you be adding?"
	}

	]).then(function(user){
		connection.query('SELECT * FROM products WHERE ?',
		{
			product_name:user.productID
		}, function(err,list){
			var newStock = parseInt(user.addStock) + list[0].stock_quantity;

			connection.query('UPDATE products SET stock_quantity=? WHERE product_name=?',
				[newStock,user.productID],
				function(err,title){
				  if(err) throw err;

				  console.log("You previously had " + list[0].stock_quantity + " " + user.productID + "s.");
				  console.log("You added " + user.addStock + " more.")
				  console.log("There is now a total of " + newStock + " " + user.productID + "s.")
			});
		})
	});
}

function addProduct(){
	inquirer.prompt([
	{
		type: "input",
		name: "productID",
		message: "What product would you like to add to the list?"
	},
	{
		type: "input",
		name: "productDep",
		message: "Which department does this item belong to?"
	},
	{
		type: "input",
		name: "productPrice",
		message: "How much does this item cost?"
	},
	{
		type: "input",
		name: "productQuantity",
		message: "How many of this item will be added to the inventory?"
	}

	]).then(function(user){
		connection.query('INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES(?, ?, ?, ?)',
			[user.productID, user.productDep, user.productPrice, user.productQuantity],
			function(err,confirm){
				console.log("You successfully updated the inventory.")
			});
		
	});
	
}

function handleChoice(user){

	if(user.menuOption === "View Products for Sale"){
		viewProducts();
	} else if (user.menuOption === "View Low Inventory"){
		viewLowInventory();
	} else if (user.menuOption === "Add to Inventory"){
		addInventory();
	} else if (user.menuOption === "Add New Product"){
		addProduct();
	}

	// switch(user.menuOption){
	// 	case "View Products for Sale":
	// 		console.log("1");
	// 	case "View Low Inventory":
	// 		console.log("2");
	// 	case "Add to Inventory":
	// 		console.log("3");
	// 	case "Add New Product":
	// 		console.log("4");
	// }
};

function initialPrompt(){


	inquirer.prompt([
		{
			type: "list",
		    name: "menuOption",
		    message: "Select from the menu.",
		    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
		}
		]).then(handleChoice);
};


initialPrompt();