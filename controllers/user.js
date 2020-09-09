const User = require('../models/user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

exports.createUser = (request,response,next)=>
{
  bcrypt.hash(request.body.password,10)
    .then
    (
      (hash)=>
      {
        const user = new User
        (
          {
            email : request.body.email,
            password : hash
          }
        );
        user.save()
          .then
          (
            (result)=>
            {
              response.status(201).send
              (
                {
                  message : 'User created',
                  result : result
                }
              )
            }
          )
          .catch
          (
            (error)=>
            {
              response.status(500).send
              (
                {
                  message : 'Invalid authentication credentials'
                }
              )
            }
          )
      }
    )
};

exports.userLogin = (request,response,next)=>
{
  let fetchedUser;

  User.findOne
  (
    {
      email : request.body.email
    }
  )
    .then
    (
      (user)=>
      {
        //Found the user

        if (!user)
        {
          return  response.status(401).send
          (
            {
              message : 'Authentication failed'
            }
          )
        }
        fetchedUser=user;

        return bcrypt.compare(request.body.password,user.password);
      }
    )
    .then
    (
      (result)=>
      {
        if (!result)
        {
          return  response.status(401).send
          (
            {
              message : 'Authentication failed'
            }
          )
        }

        //Valid password
        const token = jwt.sign
        (
          {
            email : fetchedUser.email,
            userId : fetchedUser._id
          },
          process.env.JWT_KEY,
          {
            //To configure token.
            expiresIn : '1h'
          }
        );

        response.status(200).send
        (
          {
            token : token,
            userId : fetchedUser._id, //Here directly pass this user id, even though this information is present in token but decoding token at front-end will degrade teh performance.
            expiresIn : 3600 //This token expires in 3600 seconds = 1 hour
          }
        );
      }
    )
    .catch
    (
      (error)=>
      {
        return  response.status(401).send
        (
          {
            message : 'Invalid authentication credentials'
          }
        )
      }
    )
};
