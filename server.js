/*
This file serves as a server.
 */

const app = require('./app');

/*
const http = require('http');
const server = http.createServer
(
  (request,response)=> //This function executes for every request comes from client.
  {
    response.end('Response to your request'); //Used to end writing to the response stream.
  }
);

server.listen
(
  process.env.PORT || 3000
);
*///Server setting by core http module

// Debugging port logic is not added here.

const port = process.env.PORT || 3000;
app.listen
(
  process.env.PORT || 3000,
  ()=>
  {
    console.log("Server is running on port",port);
  }
);
