const jwt = require('jsonwebtoken');

/*
This middleware is used to check incoming token with request is valid or not.
 */

module.exports =
  (request,response,next)=>
{
  try
  {
    const token = request.headers.authorization.split(" ")[1]; //Remove "Bearer "

    const decodedToken = jwt.verify
    (
      token,
      process.env.JWT_KEY
    );

    /*
    To get access to the above decode token with information inside it in other files or
    requests which are going to get accessed after this middleware.
    We use express to add some new fields to our requests.
     */
    request.userData =
      {
        email : decodedToken.email,
        userId : decodedToken.userId
      }

    next(); // Authentication passed, Continue next process.
  }
  catch (error)
  {
    response.status(401).send
    (
      {
        message : 'Not authenticated'
      }
    )
  }
}
