const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      const error = new Error('Email Already Exist , Try A Different Email');
      error.status = 422;
      throw error;
    }
    const hashPass = await bcrypt.hash(password, 12);
    if (!hashPass) {
      const error = new Error('Password Creation Failed');
      error.status = 422;
      throw error;
    }
    const user = new User({
      username: username,
      email: email,
      password: hashPass,
    });
    const createdUser = await user.save();
    res
      .status(201)
      .json({ message: 'User created Successfully', user: createdUser });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    let loadedUser;
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('No User Found');
      error.status = 404;
      throw error;
    }
    loadedUser = user;
    const hashedPass = await bcrypt.compare(password, user.password);
    if (!hashedPass) {
      const error = new Error('Password Error');
      error.status = 422;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
