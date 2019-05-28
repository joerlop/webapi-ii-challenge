const router = require("express").Router();

const db = require("../data/db");

router.post("/", (req, res) => {
  const post = req.body;

  if (!post.title || !post.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    db.insert(post)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
});

router.post("/:id/comments", (req, res) => {
  const comment = req.body;
  const id = req.params.id;

  if (!comment.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else {
    db.findById(id)
      .then(post => {
        if (post.length > 0) {
          db.findPostComments(id)
            .then(comments => {
              comments.push(comment);  
              res.status(201).json(comments);
            })
            .catch(err => {
              res
                .status(500)
                .json({
                  error:
                    "There was an error while saving the comment to the database"
                });
            });
        } else
          res
            .status(404)
            .json({
              message: "The post with the specified ID does not exist."
            });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "The post information could not be retrieved." });
      });
  }
});

router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(post => {
      if (post.length > 0) res.json(post);
      else
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(post => {
      if (post.length == 0)
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });

  db.findPostComments(id)
    .then(comments => {
      res.json(comments);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(postFound => {
      if (postFound.length > 0) {
        db.remove(id)
          .then(post => {
            if (post) {
              res.status(200).json(postFound);
            } else
              res.status(404).json({
                message: "The post with the specified ID does not exist."
              });
          })
          .catch(err => {
            res.status(500).json({ error: "The post could not be removed" });
          });
      } else
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatedPost = req.body;

  if (!updatedPost.title || !updatedPost.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    db.update(id, updatedPost)
      .then(exists => {
        if (exists) {
          db.findById(id).then(postFound => {
            res.status(200).json(postFound);
          });
        } else
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
      })
      .catch();
  }
});

module.exports = router;
