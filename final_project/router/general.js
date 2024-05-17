const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username && !password)
        return res.status(404).json({message: "Error logging in: username and password are missing"});
    if (!username)
        return res.status(404).json({message: "Error logging in: username is missing"});
    if (!password)
        return res.status(404).json({message: "Error logging in: password is missing"});

    if (doesExist(username))
        return res.status(200).json({message: "Preiously registered"});

    users.push({"username":username,"password":password});
    res.send("User " + username + " has been added!")   

  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send("\"books\": " + JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    var isbn = req.params.isbn;
    if(books[isbn])
        res.send("\"isbn\": " + JSON.stringify(books[isbn], null, 4))

    return res.status(500).json({message: "ISBN: " + isbn + " not found"}); 
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
        res.send("\"author\":" + JSON.stringify(matchList, null, 4));

    return res.status(500).json({message: "Author: " + author + " not found"}); 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    var title = req.params.title;
    var matchList = [];
    
    for(const key in Object.keys(books))
    {
        if(books[key])
        {
            if(books[key].title === title)
                matchList.push(books[key]);
        }
    }

    if(matchList.length > 0)
        res.send("\"titles\":" + JSON.stringify(matchList, null, 4));

    return res.status(500).json({message: "Title: " + title + " not found"}); 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    var isbn = req.params.isbn;
    if(books[isbn])
      res.send("review:" + JSON.stringify(books[isbn].reviews, null, 4))
    else
      res.send("No book found for ISBN: " + isbn);
});

module.exports.general = public_users;
