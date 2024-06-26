const express = require('express');
const axios = require('axios').default;
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

    if (isValid(username))
        return res.status(200).json({message: "Username: " + username + " previously registered"});

        users.push({"username":username,"password":password});
    res.send("User " + username + " has been added! ")   

  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send("\"books\": " + JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    var isbn = req.params.isbn;
    if(!books[isbn])
        return res.status(500).json({message: "ISBN: " + isbn + " not found"}); 

    res.send("\"isbn\": " + JSON.stringify(books[isbn], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    var author = req.params.author;
    var matchList = [];

    for(const key of Object.keys(books))
    {
        if(books[key])
        {
            if(books[key].author === author)
                matchList.push(books[key]);
        }
    }

    if(matchList.length <= 0)
        return res.status(500).json({message: "Author: " + author + " not found"}); 

    res.send("\"author\":" + JSON.stringify(matchList, null, 4));
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

    if(matchList.length <= 0)
        return res.status(500).json({message: "Title: " + title + " not found"}); 
    
    res.send("\"titles\":" + JSON.stringify(matchList, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    var isbn = req.params.isbn;
    if(!books[isbn])
        return res.status(500).json({message: "No book found for ISBN: " + isbn}); 

    res.send("review:" + JSON.stringify(books[isbn].reviews, null, 4))
});

// Tasks 10 through 13 are here
const axiosBase = axios.create({
    baseURL: "https://jeffgriffith-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/"
  });

const task10 = async ()=>{ //returns book list
    try
    {
        const res = await axiosBase.get();
        console.log(res.data);
    }
    catch(error)
    {
        if(error.response){
            console.log('Author -- Status: ' + error.response.status + ' ' + error.response.statusText + ' -- Message:' + JSON.stringify(error.response.data));
        }       
    }
};

const task11 = async (isbn)=>{ //returns book list
    axiosBase.get('isbn/' + isbn).then(function(res) {
        console.log(res.data);
    }).catch(function(err) {
        console.log(err)
    })
};

// Tasks 12 and 13 uses async/await  
const task12 = async (author)=>{ //returns book list
    try
    {
        const res = await axiosBase.get('author/' + author);
        console.log(res.data);
    }
    catch(error)
    {
        if(error.response){
            console.log('Author -- Status: ' + error.response.status + ' ' + error.response.statusText + ' -- Message:' + JSON.stringify(error.response.data));
        }       
    }
};

const task13 = async (title)=>{ //returns book list
    try
    {
        const res = await axiosBase.get('title/' + title);
        console.log(res.data);
    }
    catch(error)
    {
        if(error.response){
            console.log('Author -- Status: ' + error.response.status + ' ' + error.response.statusText + ' -- Message:' + JSON.stringify(error.response.data));
        }       
    }
};

module.exports.general = public_users;
module.exports.task10 = task10;
module.exports.task11 = task11;
module.exports.task12 = task12;
module.exports.task13 = task13;
