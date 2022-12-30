const express = require('express');
const router = express.Router();
const async = require('async');
const { File, Book, Magazine, Author } = require('../models');
router.get("/:sorted", (req, res, next) => {
    let allBooksMagazine = [];
    let sortedBooksMagazine;
    async.series([
        function(callback) {
            Book.findAll().then((books) => {
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
            }).then(() => {
                callback(null)
            })
        },
        // function(callback) {
        //     Magazine.findAll().then((magazines) => {
        //         magazines.forEach(magazine => {
        //             let tempMagazine = {};
        //             tempMagazine.id = "M" + magazine.id;
        //             tempMagazine.name = magazine.name;
        //             tempMagazine.isbn = magazine.isbn;
        //             tempMagazine.author_mail = magazine.author_mail;
        //             tempMagazine.description = magazine.description;
        //             tempMagazine.published_at = magazine.published_at;

        //             allBooksMagazine.push(tempMagazine);
        //         });
        //     }).then(() => {
        //         callback(null)
        //     })
        // },
        function(callback) {
            if (req.params.sorted === 'sorted') {
                allBooksMagazine.sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
            }
            callback(null)
        },

    ], function(err, results) {
        if (err) {
            res.status(501).json({ "message": "Internal Server error", "error": err })
        } else {

            res.status(201).json({ "message": "success", data: allBooksMagazine })
        }

    })

})

module.exports = router;