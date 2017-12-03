if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = require('express')();
const http = require('http').Server(app);

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONN);

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET,
    acl: 'public-read',
    metadata(req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key(req, file, cb) {
      cb(null, Date.now().toString() + '.png');
    }
  })
});

const Post = require('./models/post');

app.get('/api/posts', (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      console.log('Database error: ', err);
      res.status(500).json({});
    }

    console.log('Posts: ', posts);
    res.json(posts);
  });
});

app.post('/api/posts', upload.single('photo'), (req, res, next) => {
  console.log('req.file', req.file);
  const post = new Post(req.file);

  post.save((err, post) => {
    if (err) {
      console.log('Database error: ', err);
      res.status(500).json({});
    }

    res.json(post);
  });

  res.json(req.file);
})

let port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
