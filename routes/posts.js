/*
This is for defining all posts routes.
 */

const express = require('express');

const router = express.Router();

const Post = require('../models/post');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const PostController = require('../controllers/posts');

router.post
(
  '',
   checkAuth,
   extractFile, //This is another middleware
  PostController.createPost
);

router.get
(
  '', // localhost:3000/api/posts
  PostController.getPosts
);

router.delete
(
  '/:id',
  checkAuth,
  PostController.deletePost
);

router.put
(
  '/:id',
  checkAuth,
  extractFile,
  PostController.updatePost
);

router.get
(
  '/:id',
  PostController.getPost
);


module.exports = router;
