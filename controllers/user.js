const { User } = require("../models/User");
const { validationResult } = require("express-validator");
const { generateSnowflakeId } = require("../utils/generateID");
const { signupValidationRules } = require("../utils/validation");

exports.signup = async (req, res) => {
  try {
    const errors = await validationResult(req);
    // console.log(errors);
    if (!errors.isEmpty()) {
      // Create an errors array in the desired format
      const validationErrors = errors.array().map((error) => ({
        param: error.path,
        message: error.msg,
        code: "INVALID_INPUT",
      }));

      return res.status(400).json({
        status: false,
        errors: validationErrors,
      });
    }

    //if no errors then this part exceutes
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "email",
            message: "User with this email address already exists.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }

    const _id = await generateSnowflakeId();

    user = await new User({
      _id,
      name,
      email,
      password,
    });

    const token = await user.generateToken();
    console.log(token, "tok");

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    await user.save();
    res
      .status(200)
      .cookie("access_token", token, options)
      .json({
        success: true,
        content: {
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
          },
          meta: { access_token: token },
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            param: "email",
            message: "User does not exist",
            code: "ALREADY_EXIST",
          },
        ],
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            param: "password",
            message: "The credentials you provided are invalid",
            code: "INVALID_CREDENTIALS",
          },
        ],
      });
    }

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res
      .status(200)
      .cookie("access_token", token, options)
      .json({
        success: true,
        content: {
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
          },
          meta: { access_token: token },
        },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.myProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id }, { _id: 0, __v: 0 });

    res.status(200).json({
      success: true,
      content: { data: user },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.signout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("access_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Logged Out",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
