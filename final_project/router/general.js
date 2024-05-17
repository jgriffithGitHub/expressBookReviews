const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send("Book List: " + JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  var isbn = req.params.isbn;
  if(books[isbn])
    res.send("Book: " + JSON.stringify(books[isbn], null, 4))
  else
    res.send("No book found for ISBN: " + isbn);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    var author = req.params.author;
    var matchList = [];
    
    for(const key in Object.keys(books))
    {
        if(books[key])
        {
            if(books[key].author === author)
                matchList.push(books[key]);
        }
    }

    if(matchList.length > 0)
        res.send("Title for Author:" + JSON.stringify(matchList, null, 4));
    else
        res.send ("No book found for author: " + author);  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
