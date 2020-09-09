const Post = require('../models/post');

exports.createPost = (request,response,next)=>
{
  /*
  Post requests will have request body though, so they have data attached to them and we
  need to extract that data.
  For that we install "body-parser" npm library.
  This is a node express package which can be used as an express middleware, it parses
  incoming request bodies, extract the request data, parses that data and then it re-adds it
  on a special property to that request object.
   */

  const url = request.protocol + '://' + request.get('host');

  const post = new Post
  (
    {
      title : request.body.title,
      content : request.body.content,
      imagePath : url + "/images/" + request.file.filename,
      creator : request.userData.userId
      /*
       User ID will be present as a part of the token. That is we added that when creating the
       user authentication token.
       So, we can decode the token to get that information.
       This is done when we are verifying the token (in checkAuth).
       */
    }
  );

  post.save()
    .then
    (
      (createdPostData)=>
      {
        response.status(201).send
        (
          {
            message : 'Post added successfully',
            post :
              {
                /*title : createdPostData.title,
                content : createdPostData.content,
                imagePath : createdPostData.imagePath*/ //OR
                ...createdPostData,
                id : createdPostData._id
              }
          }
        );
      }
    )
    .catch
    (
      (error)=>
      {
        response.status(500).send
        (
          {
            message : 'Post creation failed'
          }
        )
      }
    )
};

exports.updatePost =  (request,response,next)=>
{
  let imagePath = request.body.imagePath;
  if (request.file)
  {
    const url = request.protocol+"://"+request.get("host");
    imagePath = url + "/images/" + request.file.filename;
  }

  const post = new Post
  (
    {
      _id : request.body.id,
      title : request.body.title,
      content : request.body.content,
      imagePath : imagePath,
      creator : request.userData.userId
    }
  );

  Post.updateOne
  (
    {
      _id : request.params.id,
      creator : request.userData.userId
    },
    post
  )
    .then
    (
      (result)=>
      {
        if (result.n>0) //Check whether any post were updated.
        {
          response.status(200).send
          (
            {
              message : 'Post updated successfully'
            }
          );
        }
        else
        {
          response.status(401).send
          (
            {
              message : 'Not authorized'
            }
          )
        }
      }
    )
    .catch
    (
      (error)=>
      {
        response.status(500).send
        (
          {
            message : 'Updating post failed'
          }
        )
      }
    )
};

exports.getPosts = (request,response,next)=>
{
  //Implementing pagination
  const pageSize = + request.query.pageSize;  //+ to convert to number
  const currentPage = request.query.page;
  const postQuery = Post.find();
  if (pageSize && currentPage)
  {
    //Valid values means we got those two value so, we manipulate that pageQuery to get only specified posts.
    postQuery
      .skip //Skip first n posts.
      (
        pageSize*(currentPage - 1)
      )
      .limit
      (
        //Limits the amount of documents we return.
        pageSize
      );
  }

  let fetchedPosts;
  //Post.find() //Return all entries. //Commented after pagination
  postQuery
    .then
    (
      (documents)=>
      {
        fetchedPosts=documents;
        return Post.countDocuments();
      }
    )
    .then
    (
      (count)=>
      {
        response.status(200).send
        (
          {
            message : 'Fetched posts successfully',
            posts : fetchedPosts,
            maxPosts : count
          }
        );
      }
    )
    .catch
    (
      (error)=>
      {
        response.status(500).send
        (
          {
            message : 'Fetching posts failed'
          }
        )
      }
    );
};

exports.getPost = (request,response,next)=>
{
  Post.findById
  (
    request.params.id
  )
    .then
    (
      (post)=>
      {
        if (post)
        {
          response.status(200).send(post);
        }
        else
        {
          response.status(404).send
          (
            {
              message : 'Post not found'
            }
          )
        }
      }
    )
    .catch
    (
      (error)=>
      {
        response.status(500).send
        (
          {
            message : 'Fetching post failed'
          }
        )
      }
    );
};

exports.deletePost = (request,response,next)=>
{
  Post.deleteOne
  (
    {
      _id : request.params.id,
      creator : request.userData.userId
    }
  )
    .then
    (
      (result)=>
      {
        if (result.n>0) //Check whether any post were updated.
        {
          response.status(200).send
          (
            {
              message : 'Post deleted successfully'
            }
          );
        }
        else
        {
          response.status(401).send
          (
            {
              message : 'Not authorized'
            }
          )
        }
      }
    )
    .catch
    (
      (error)=>
      {
        response.status(500).send
        (
          {
            message : 'Deleting post failed'
          }
        )
      }
    );

  response.status(200).send
  (
    {
      message : 'Post deleted !'
    }
  )
};



