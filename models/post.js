/*
This the model for post on the server side.
 */

const mongoose = require('mongoose');

const postSchema = mongoose.Schema
(
  {
    title : {type : String, required:true},
    content : {type: String, required: true},
    imagePath : {type:String, required:true},
    creator : {type:mongoose.Schema.ObjectId,ref : "User",required:true}
    /*
    ref property allows us to define to which model this ID is related to that we are going to store here.
    By this it will add ID of user who added the certain post automatically.
     */
  }
);

//Model is required to work with schemas(blueprint).
//So, we have to convert schema to model.

module.exports = mongoose.model
(
  'Post', //Model name
  postSchema
); //In posts collection
