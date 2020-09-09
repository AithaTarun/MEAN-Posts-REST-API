const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');
/*
This is a plugin that will simply add an extra hook that checks our data before it saves it
to the database.
 */

const userSchema = mongoose.Schema
(
  {
    email :
      {
        type : String,
        required : true,
        unique : true

        /*
        This unique property here is not a validator, it is just fro mongoose and mongodb to
        not allow duplicate email's.
        To handle that unique validation we use "mongoose-unique-validator" package.
         */
      },
    password :
      {
        type : String,
        required : true,
      }
  }
);

//To add a plugin, here unique validator plugin :
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model
(
  'User',
  userSchema
);
