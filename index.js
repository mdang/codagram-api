if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = require('express')();
const http = require('http').Server(app);

const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

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
})

app.get('/api/posts', (req, res) => {
  res.json([]);
});

app.post('/api/posts', upload.single('photo'), (req, res, next) => {
  console.log('req.file', req.file);
  res.json(req.file)
})

let port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
