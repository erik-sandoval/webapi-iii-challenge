const express = require("express");

const User = require("./userDb");
const Post = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  console.log(req.body);

  User.insert(req.body)
    .then(data => {
      console.log(data);
      res.status(200).json({ message: "user added successfully" });
    })
    .catch(err => {
      res.status(500).json({ message: "could not add user" });
    });
});

router.post("/:id/posts", validatePost, validateUserId, (req, res) => {
  const post = {
    text: req.body.text,
    user_id: req.user.id
  };

  Post.insert(post)
    .then(data => {
      res.status(200).json({ message: "new post created" });
    })
    .catch(err => {
      res.status(500).json({ message: "cannot create new post" });
    });
});

router.get("/", (req, res) => {
  User.get()
    .then(data => {
      res.status(200).json({ data });
    })
    .catch(err => {
      res.status(500).json({ message: "could not get data" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  User.getUserPosts(req.user.id)
    .then(data => {
      if (data.length > 1) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: "user has no posts to display" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "could not get users posts" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  User.remove(req.user.id)
    .then(data => {
      res.status(200).json({ message: "successfully deleted" });
    })
    .catch(err => {
      res.status(500).json({ message: "could not delete" });
    });
});

router.put("/:id", validateUser, validateUserId, (req, res) => {
  const changes = req.body;
  User.update(req.user.id, changes)
    .then(data => {
      res.status(200).json({ message: "successfully updated" });
    })
    .catch(err => {
      res.status(500).json({ message: "could not update" });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  User.getById(id)
    .then(data => {
      if (data) {
        req.user = data;
        next();
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to process request" });
    });
}

function validateUser(req, res, next) {
  if (req.body.name) {
    next();
  } else {
    res.status(400).json({ message: "missing user data" });
  }
}

function validatePost(req, res, next) {
  if (req.body.text) {
    console.log(req.body);
    next();
  } else {
    res.status(400).json({ message: "missing required text field" });
  }
}

module.exports = router;
