const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS,GET,POST,PUT,PATCH,DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type',
    'Authorization'
  );
  next();
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const productRouter = require('./routes/product');
const authRouter = require('./routes/auth');

dotenv.config({ path: './config/.env' });

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/product', productRouter);
app.use('/auth', authRouter);

app.use((error, req, res, next) => {
  const data = error.data;
  const message = error.message;
  const status = error.status || 500;
  res.status(status).json({ message: message, data: data });
  next();
});

mongoose
  .connect(process.env.MONGOURI)
  .then((result) => {
    app.listen(process.env.PORT, (req, res, next) => {
      console.log(`Server is Running At PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
