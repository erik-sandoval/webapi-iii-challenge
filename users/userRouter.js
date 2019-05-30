const express = require("express");

const User = require("./userDb");

const router = express.Router();

router.post("/", (req, res) => {
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

router.post("/:id/posts", validateUserId, (req, res) => {});

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

router.get("/:id/posts", validateUserId, (req, res) => {});

router.delete("/:id", validateUserId, (req, res) => {});

router.put("/:id", validateUserId, (req, res) => {});

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
  if (req.body && Object.keys(req.body).length) {
    next();
  } else {
    res.status(400).json({ message: "missing user data" });
  }
}

function validatePost(req, res, next) {}

module.exports = router;
