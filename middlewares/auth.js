const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

exports.isAuthenticated = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    const { access_token } = req.cookies;

    if (!access_token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = await jwt.verify(access_token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = await User.findOne({ _id: decoded._id });

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
