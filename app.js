/*
This file holds the express app.
 */

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const mongoose = require('mongoose');

mongoose.connect
(
  //'mongodb://localhost:27017/meanPosts',
  `mongodb+srv://AithaTarun:${process.env.MONGO_ATLAS_PASSWORD}@cluster0.ucr0g.mongodb.net/meanPosts`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true
  }
).then
(
  ()=>
  {
    console.log("Connected to database")
  }
).catch
(
  (error)=>
  {
    console.log("Connection to database failed",error);
  }
);

const Post = require('./models/post');

app.use //To handle request body with body-parser.
(
  bodyParser.json()
);

app.use //To handle request body URL encoded data with body-parser.
(
  bodyParser.urlencoded
  (
    {
      extended:false
    }
  )
);

const path = require('path');

app.use
(
  '/images',
  express.static
  (
    path.join('images')
  )
)

app.use //To handle CORS error.
(
  (request,response,next)=>
  {
    response.setHeader
    ('Access-Control-Allow-Origin','*');
    /*
    This means no matter which domain the app which is sending the request is running on,
    it's allowed to access our resources.

    So, this is used to allow which domains are able to access our resources.
     */

    response.setHeader
    (
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization' //So, incoming headers can have these extra headers.
    );
    /*
    With this we can also restrict this to domains sending requests with a certain set of headers
    besides the default headers.
     */

    response.setHeader
    (
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, DELETE, OPTIONS, PUT'
    );
    /*
    With this we could control which HTTP verbs may be usd to send requests.

    OPTIONS is an implicit request sent by the browser by default prior to post request.
    For example to check whether the post request is valid.
     */

    next();
  }
);

/*
Use is used to register new middlewares.
 */

const multer = require('multer');


const postRoutes = require('./routes/posts');

app.use("/api/posts",postRoutes);

const userRoutes = require('./routes/user');
app.use("/api/user",userRoutes);

module.exports = app;
