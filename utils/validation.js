const { validationResult } = require("express-validator");
const { check } = require("express-validator");

// Custom validation function for email format
const isEmailValid = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

exports.signupValidationRules = [
  check("name")
    .isLength({ min: 2 })
    .withMessage("Name should be at least 2 characters."),
  check("email").custom(isEmailValid).withMessage("Invalid email format"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters."),
];

exports.signinValidationRules = [
  check("email").custom(isEmailValid).withMessage("Invalid email format"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters."),
];
