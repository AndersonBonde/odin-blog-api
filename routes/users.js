const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const { generatePassword, issueJWT } = require('../lib/passwordUtils');

// --- GET home page.
router.get('/', (req, res, next) => {
  res.json({ title: 'Welcome to Blog API users resource'});
});

// --- GET signup.
router.get('/signup', (req, res, next) => {
  res.json({ title: 'Sign Up', message: 'Pretty signup page goes here' });
});

// --- POST signup.
router.post('/signup', [
  body('firstname', 'First name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('lastname', 'Last name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('email')
    .trim()
    .custom(async (value) => {
      const user = await User.findOne({ email: value }).exec();

      if (user) {
        throw new Error('Email already in use');
      }
    })
    .escape(),
  body('password', 'Password length must be 3 or higher')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('password_confirm', 'The password and confirm password values did not match')
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    }) 
    .escape(),

  async (req, res, next) => {
    // TODO: Validate and sanitize fields.
    const errors = validationResult(req);
    const { hash, salt } = generatePassword(req.body.password);

    const user = new User({
      hash,
      salt,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render page again with sanitized values.

      res.json({ success: false, errors: errors.array() });
    } else {
      // Data from form is valid. Save user.
      await user.save()
        .then((user) => {
          const jwt = issueJWT(user);

          res.json({ success: true, user: user, token: jwt.token, expiresIn: jwt.expires });
      })
      .catch((err) => next(err));
    }
  }
]);

// --- POST login.
router.post('/login', (req, res, next) => {

})

// --- GET mock/route.
router.get('/mock/route', (req, res, next) => {
  res.json({
    message: 'Mock GET route accessed...',
  })
})

// --- POST mock/route.
router.post('/mock/route', (req, res, next) => {
  res.json({
    message: 'Mock POST route accessed...',
  })
});


module.exports = router;
