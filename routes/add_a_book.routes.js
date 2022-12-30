const express = require('express');
const router = express.Router();
const { Book } = require('../models');
router.post("", (req, res, next) => {
    Book.create({
        name: req.body.name,
        isbn: req.body.isbn,
        author_mail: req.body.author_mail,
        description: req.body.description,
        published_at: req.body.published_at,
    }).then((book) => {
        res.status(201).json({ "message": "success", data: book });
    }).catch((err) => {
        if (err) {
            res.status(501).json({ "message": "Internal Server error", "error": err })
        }
    })
});

module.exports = router;