const bcrypt = require('bcryptjs');
const prisma = require('../prisma/prisma');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const { issueJWT } = require('../utils');

const registerPost = [
  body('firstname').trim()
    .isLength({ min: 1 }).withMessage('Your first name must not be empty'),
  body('lastname').trim()
    .isLength({ min: 1 }).withMessage('Your last name must not be empty'),
  body('email').trim()
    .custom(async(value) => {
      const user = await prisma.user.findUnique({
        where: {
          email: value,
        }
      });

      if (user) {
        throw new Error('Email already in use');
      }
    }),
  body('password').trim()
    .isLength({ min: 3 }).withMessage('Password minimum length is 3'),
  body('password_confirm').trim()
    .custom((value, { req }) => {
      return req.body.password === value;
    }).withMessage("Your password and password confirmation value didn't match"),  
  async (req, res, next) => {
    const errors = validationResult(req);
    const info = { 
      firstname: req.body.firstname, 
      lastname: req.body.lastname, 
      email: req.body.email 
    };

    if (!errors.isEmpty()) {
      res.status(400).json({ errors, info });
    } else {
      bcrypt.hash(req.body.password, 10, async(err, hashedPassword) => {
        if (err) next(err);

        const user = await prisma.user.create({
          data: {
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: hashedPassword
          }
        });

        const jwt = issueJWT(user);

        res.status(201).json({ message: 'User created successfully', user: user, token: jwt.token, expiresIn: jwt.expires });
      });
    }
  }
];

const loginPost = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email }
  });
  
  try {
    if (!user) {
      res.status(401).json({ message: 'Could not find user'});
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      res.status(401).json({ message: 'You entered the wrong password'});
    } else {
      const jwt = issueJWT(user);

      res.status(200).json({ message: 'User login was successful', user: user, token: jwt.token, expiresIn: jwt.expires });
    }
  } catch(err) {
    next(err);
  }
};

const logoutGet = (req, res) => {
  res.status(200).json({ msg: 'Logout successful' });
}

const protectedGet = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({ message: 'You are authorized '});
  }
];

module.exports = {
  registerPost,
  loginPost,
  logoutGet,
  protectedGet,
}
