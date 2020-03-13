const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "greatbay_db"
});

connection.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log("connected as id " + connection.threadId + "\n");
    promptUser();
});

function promptUser() {
    inquirer
        .prompt({
            name: "post_bid_or_exit",
            type: "list",
            message: "Would you like to [POST] and item or [BID] on an item?",
            choices: ["POST", "BID", "EXIT"]
        })
        .then(function(response) {
            if (post_bid_or_exit === "POST") {
                inquirer
                    .prompt([
                        {
                            name: "itemName",
                            type: "input",
                            message: "What's the name of your item?"
                        },
                        {
                            name: "startingBid",
                            type: "input",
                            message:
                                "What would you like the starting bid to be?"
                        }
                    ])
                    .then(function(response) {
                        createItem(response.itemName, response.startingBid);
                    });
            } else if (post_bid_or_exit === "BID") {
                connection.query("SELECT * FROM items", function(err, res) {
                    if (err) throw err;
                    console.log(res);
                });

                inquirer
                    .prompt(
                        {
                            name: "id",
                            type: "input",
                            message:
                                "Enter the id of the item you want to bid on"
                        },
                        {
                            name: "bidAmount",
                            type: "input",
                            message: "How much do you want to bid?"
                        }
                    )
                    .then(function(response) {
                        // grab the value of the item and check if the bidAmount is greater than the current bid.
                        connection.query(
                            "SELECT * FROM items WHERE id = ?",
                            [response.id],
                            function(err, res) {
                                if (err) throw err;
                                console.log(res);
                                // let currentBidAmount = res.bid
                            }
                        );

                        // if it is, then we UPDATE that row to the bidAmount
                        updateBid(response.id, response.bidAmount);
                    });
                // if not we run another prompt to re enter the bid.
            } else if (post_bid_or_exit === "EXIT") {
                // cancel out of everything
                connection.end();
            }
        });

    function createItem(itemName, startingBid) {
        console.log("Inserting a new item...\n");
        var query = connection.query(
            "INSERT INTO items SET ?",
            {
                title: itemName,
                bid: startingBid
            },
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " item inserted!\n");
            }
        );

        // logs the actual query being run
        console.log(query.sql);
    }

    function updateBid(id, bidAmount) {
        console.log("Updating current bid...\n");
        var query = connection.query(
            "UPDATE items SET ? WHERE ?",
            [
                {
                    bid: bidAmount
                },
                {
                    id: id
                }
            ],
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " items updated!\n");
            }
        );

        // logs the actual query being run
        console.log(query.sql);
    }
}
