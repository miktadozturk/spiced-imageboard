const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db.js');
const s3 = require('./s3.js');
const {s3Url} = require('./config.json');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(bodyParser.json());
app.use(express.static('./public'));

app.get('/images', function(req, res) {
    db.getImages()
        .then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
        });
});

app.post('/upload', uploader.single('file'), s3.upload, function(req, res) {
    const imgUrl = s3Url + req.file.filename;
    db.uploadImages(imgUrl, req.body.username, req.body.title, req.body.desc)
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/image-modal', function(req, res) {
    db.getModalData(req.query.id)
        .then(data => {
            db.getComments(req.query.id)
                .then(comments => {
                    res.json({
                        comments,
                        data
                    });
                })
                .catch(err => {
                    res.sendStatus(500);
                    console.log(err);
                });
        })
        .catch(err => {
            res.sendStatus(500);
            console.log(err);
        });
});

app.post('/submitcomment', function(req, res) {
    db.addComment(req.body.id, req.body.comment, req.body.username)
        .then(resp => {
            db.getComments(req.body.id)
                .then(results => {
                    res.json({
                        results,
                        resp
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/images/more/:id', function(req,res) {
    db.getMoreImages(req.params.id)
        .then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
        });
});


app.listen(8081, () => console.log(`Listening port 8081`));
