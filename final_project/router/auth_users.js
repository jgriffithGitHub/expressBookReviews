const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    if(!users || users.length == 0)
        return false;

    let userList = users.filter((user)=>{
        return user.username === username;
    });

    return (userList.length == 1);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    if(!users || users.length == 0)
        return false;

    let userList = users.filter((user)=>{
      return user.username === username
    });

    if(userList.length != 1)
        return false;

    return (userList[0].password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password)
        return res.status(404).json({message: "Error logging in. Missing either username or password."});
 
    if (authenticatedUser(username,password))
    {
        let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 });        
        req.session.authorization = {accessToken, username}
        return res.status(200).send("User successfully logged in");
    }    

     return res.status(208).json({message: "Invalid Login. Check username and password"});   
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    var isbn = req.params.isbn;
    if(!books[isbn])
        return res.status(404).json({message: "Invalid ISBN"});

    var review = req.body.review;
    var user = req.session.authorization['username'];

    // Set a default value
    var reviews = [{"username":user, "review":review}];

    if(Object.keys(books[isbn].reviews).length == 0)
    {
        books[isbn].reviews = reviews;
        return res.status(200).json({message: "First review posted:" + JSON.stringify(books[isbn])}); 
    } 
    
    // Get the existing list of reviews
    reviews = books[isbn].reviews;
    let reviewList = reviews.filter((review)=>{
        return review.username === user
    });
 
    // Update the previous review provided by this user
    if(reviewList.length == 1)
    {
        reviewList[0].review = review;
        return res.status(200).json({message: "Review updated:" + JSON.stringify(books[isbn])}); 
    }

    // No previous review by this user
    reviews.push({"username":user, "review":review});
    return res.status(200).json({message: "Review added:" + JSON.stringify(books[isbn])}); 
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
