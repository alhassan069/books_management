const fs = require('fs');
const path = require('path');
const express = require('express');
const { parse } = require('csv-parse');
const uuidv4 = require('uuid/v4');
const router = express.Router();
const async = require('async');
const { File, Book, Magazine, Author } = require('../models');
const { where } = require('sequelize');

const dirname = __dirname;
const DIR = path.resolve(dirname, "..", "temp")



router.post("", (req, res, next) => {
    let allFiles = [];

    async.series([
            // 1. get all the undeleted files
            function(callback) {
                File.findAll({ where: { is_deleted: false } })
                    .then(data => {
                        data.forEach(element => {
                            let tempObj = {};
                            tempObj.id = element.id
                            tempObj.name = element.name;
                            tempObj.template = element.template_name;
                            tempObj.is_processed = false;
                            allFiles.push(tempObj);
                        });
                        callback(null, 'one');
                    }).catch(err => {
                        callback(err, "one")
                    })

            },
            // 2. process all the undeleted files
            function(callback) {
                let eachSeriesIndex = -1;
                async.eachSeries(allFiles,
                    //   2.1 read the file row-wise and create an entry into the database.
                    function(file, callback) {
                        eachSeriesIndex++;
                        let filePath = DIR + "/" + file.name;

                        fs.createReadStream(filePath)
                            .pipe(parse({ delimiter: ";", from_line: 2 }))
                            .on("data", function(row) {
                                if (file.template === 'book') {
                                    Book.create({
                                        name: row[0],
                                        isbn: row[1],
                                        author_mail: row[2],
                                        description: row[3]
                                    }).catch((err) => {
                                        console.log("Error!", err)
                                    })
                                } else if (file.template === 'magazine') {
                                    Book.create({
                                        name: row[0],
                                        isbn: row[1],
                                        author_mail: row[2],
                                        published_at: row[3]
                                    }).catch((err) => {
                                        console.log("Error!", err)
                                    })

                                } else if (file.template === 'author') {
                                    Author.create({
                                        email: row[0],
                                        first_name: row[1],
                                        last_name: row[2],
                                    }).catch((err) => {
                                        console.log("Error!", err)
                                    })
                                }
                            })
                            .on("end", function() {
                                allFiles[eachSeriesIndex].is_processed = true;
                                console.log("finished");
                                callback(null)
                            })
                            .on("error", function(error) {
                                if (error) {
                                    allFiles[eachSeriesIndex].is_processed = false;
                                    callback(error)
                                }
                            });
                    },
                    function(err) {
                        if (err) {
                            callback(err, 'two');
                        } else callback(null, 'two')
                    })

            },
            // 3. delete all the undeleted files and update db
            function(callback) {
                allFiles.forEach(file => {
                    if (file.is_processed) {
                        let filePath = DIR + "/" + file.name;
                        let exists = fs.existsSync(filePath);
                        if (exists) {
                            console.log('File exists. Deleting now ...');
                            fs.unlink(filePath, () => {
                                console.log("Deleted")
                            });
                        } else {
                            console.log('File not found, so not deleting.');
                        };

                        File.update({ is_deleted: true }, {
                            where: {
                                id: file.id
                            }
                        }).catch((err) => {
                            console.log(err)
                        })
                    }
                })
                callback(null, 'three');
            }
        ],
        function(err, results) {
            if (err) {
                res.status(501).json({ "message": "Internal Server error", "error": err })
            } else {
                res.status(201).json({ "message": "success" })
            }

        });
})


module.exports = router;