const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new Error('Not Authorized');
      error.status = 500;
      throw error;
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      const error = new Error('Not Authorized');
      error.status = 500;
      throw error;
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
