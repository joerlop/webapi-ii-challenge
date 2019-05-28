const express = require('express');

const postsRouter = require("../posts/posts-router")

const server = express();

server.use(express.json());

server.use("/api/posts", postsRouter)

// add an endpoint that returns all the messages for a hub
// add an endpoint for adding new message to a hub

module.exports = server