// This file is for route functions
const express = require('express');
const app = express();
const passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      mongoSanitize         = require('express-mongo-sanitize'),
      rateLimit             = require('express-rate-limit'),
      xss                   = require('xss-clean'),
      helmet                = require('helmet');
// first we need mongoose to use our model
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
// next we import our posts model
const Posts = mongoose.model('Posts');
const User = mongoose.model('User')
var data = require('../Models/Posts');
const axios = require('axios');

// function for base route on "/"
exports.baseRoute = async (req, res) => {
    res.render('index.ejs');
};

// function for register route on "/register"
exports.registerRoute = async (req, res) => {
    res.render('register.ejs');
};

// app.post('/', passport.authenticate("local", {
//     successRedirect: "/review",
//     failureRedirect: "/"
// }), function(req, res){
// });

// app.get('/register', (req, res) => {
//     User.register(new User({username: req.body.username,email: req.body.email,phone: req.body.phone}),req.body.password,function(err,user){
//         if(err){
//             console.log(err);
//             res.render("register");
//         }
//         passport.authenticate("local")(req,res,function(){
//             res.redirect("/");
//         })    
//     })
// })
// app.get("/logout",(req,res)=>{
//     req.logout();
//     res.redirect("/");
// });
// function isLoggedIn(req,res,next) {
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function for review route on "/review"
exports.reviewRoute = async (req, res) => {
    // Make a get request to /getPosts
    axios.get('http://localhost:3000/getPosts')
        .then(function(response) {
            console.log(response.data)
            res.render('../views/reviews.ejs', {posts: response.data});
        })
        .catch(err => {
            res.send(err);
        })
};

// function for add review route on "/add-review"
exports.addReviewRoute = async (req, res) => {
    res.render('../views/add_reviews.ejs');
};

// function for update review route on "/update-review"
exports.updateReviewRoute = async (req, res) => {
    axios.get('http://localhost:3000/getPosts', {params: {id: req.query.id}})
        .then(function(userdata) {
            res.render('../views/update_review.ejs', {user: userdata.data})
        })
        .catch(err => {
            res.send(err);
        });
};


// ****************** API Routes ********************

// function to get posts on route "/getPosts/"
exports.getPosts = async (req, res) => {
    const posts = await Posts.find();
    res.json(posts);
}

// function to create a post
exports.createPost = async (req, res) => {
    // we use mongodb's save functionality here
    // await new Posts(req.body).save((err, data) => {
    //     if (err) {
    //         // if there is an error, send the following response
    //         res.status(500).json({
    //             message: "Something went wrong, please try again later.",
    //         });
    //     } else {
    //         // if success, send the following response
    //         console.log(data);
    //         res.status(200).json({
    //             message: "Post Created",
    //             data,
    //         });
    //     }
    // });
    if(!req.body) {
        res.status(400).send({message: "Content cannot be empty!"});
        return;
    }
    const post = new data({
        title: req.body.title,
        author: req.body.author,
        desc: req.body.desc
    })
    data
        .create(post)
        .then(data => {
            // res.send(data)
            res.redirect('/add-review')
        })
        .catch(err => {
            res.status(500).send({message: err.message || "Some error occured while performing a creat operation"});
        });
};

// function to get a single post
exports.getSinglePost = async (req, res) => {
    // get id from URL by using req.params
    let postID = req.params.id;
    // we use mongodb's findById() functionality here
    await Posts.findById({ _id: postID }, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "Something went wrong, please try again later.",
            });
        } else {
            console.log(data);      
            res.status(200).json({
                message: "Post found",
                data,
            });
        }
    });
};

// function to update a single post
exports.updatePost = async (req, res) => {
    let postID = req.params.id;

    await Posts.findByIdAndUpdate({_id: postID}, {$set: req.body}, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "Something went wrong, please try again later.",
            });
        } else {
            console.log(data);
            res.status(200).json({
                message: "Post updated",
                data,
            });
        }
    });
}

// function to delete a post from the DB
// exports.deletePost = async (req, res) => {
//     let postID = req.params.id;

//     await Posts.deleteOne({ _id: postID }, (err, data) => {
//         if (err) {
//             res.status(500).json({
//                 message: "Something went wrong, please try again later.",
//             });
//         } else {
//             res.status(200).json({
//                 message: "Post Deleted"
//             });
//         }
//     });
// };

exports.deletePost = (req, res) => {
    const id = req.params.id;

    data.findByIdAndDelete(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Delete with id ${id}. Maybe id is wrong`})
            } else {
                res.send({message: "User was deleted successfully!"})
            }
        })
        .catch(err => {
            res.status(500).send({message: "Could not delete User with id=" + id});
        });
}