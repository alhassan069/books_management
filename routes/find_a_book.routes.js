const express = require('express');
const router = express.Router();
const { File, Book, Magazine, Author } = require('../models');
const { Op } = require('sequelize')
router.get("/isbn/:isbn", (req, res, next) => {
    let allBooksMagazine = [];
    Book.findOne({ where: { isbn: req.params.isbn } }).then((book) => {
        let tempBook = {};
        tempBook.id = book.id;
        tempBook.name = book.name;
        tempBook.isbn = book.isbn;
        tempBook.author_mail = book.author_mail;
        tempBook.description = book.description;
        tempBook.published_at = book.published_at;
        allBooksMagazine.push(tempBook);
    }).then((book) => {
        res.status(201).json({ "message": "success", data: allBooksMagazine });

    }).catch((err) => {
        if (err) {
            res.status(501).json({ "message": "Internal Server error", "error": err })
        }
    })
});


router.get("/email/:email", (req, res, next) => {
    let allBooksMagazine = [];
    Book.findAll({
        where: {
            author_mail: {
                [Op.substring]: req.params.email,
            },
        },
    }).then((books) => {
        books.forEach(book => {
            let tempBook = {};
            tempBook.id = book.id;
            tempBook.name = book.name;
            tempBook.isbn = book.isbn;
            tempBook.author_mail = book.author_mail;
            tempBook.description = book.description;
            tempBook.published_at = book.published_at;
            allBooksMagazine.push(tempBook);
        });
    }).then((book) => {
        res.status(201).json({ "message": "success", data: allBooksMagazine })
    }).catch((err) => {
        if (err) {
            res.status(501).json({ "message": "Internal Server error", "error": err })
        }
    })
})

module.exports = router;