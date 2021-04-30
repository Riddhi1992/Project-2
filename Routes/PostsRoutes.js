// For API routes

const express = require('express');
const router = express.Router();

// import the controller file for functions
const postController = require('../Controllers/PostController');

// use
router.get('/', postController.baseRoute);

router.get('/register', postController.registerRoute);
// use
router.get('/review', postController.reviewRoute);

// add-review Route
router.get('/add-review', postController.addReviewRoute);

// update-review Route
router.get('/update-review', postController.updateReviewRoute);


// ****************** API Routes ********************
// create
router.post('/create', postController.createPost);

// read all
router.get('/getPosts', postController.getPosts);

// read one
router.get('/getPost/:id', postController.getSinglePost);

// update
router.put('/post/update/:id', postController.updatePost);

// delete
router.delete('/delete/:id', postController.deletePost);

module.exports = router;