const express = require('express');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const router = express.Router();
const { File } = require('../models')

const DIR = './temp/';



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "text/csv") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .csv format allowed!'));
        }
    }
});
// User model
router.post('/file', upload.single('csvFile'), (req, res, next) => {
    File.create({
            name: req.file.filename,
            template_name: req.body.template,
            is_deleted: false,
        })
        .then(result => {
            res.status(201).json({
                message: "File Uploaded successfully!",
                file_uploaded: {
                    _id: result.id,
                }
            })
        }).catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                });
        });
});

router.get('/getfiles', (req, res, next) => {
    let allFiles = [];
    File.findAll({ where: { is_deleted: false } }).then(result => {
        result.forEach(file => {
            let tmp = {};
            tmp.id = file.id;
            tmp.name = file.name;
            tmp.template_name = file.template_name;
            allFiles.push(tmp);
        })
        res.status(200).json({ message: "got the files", files: allFiles })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
})


module.exports = router;