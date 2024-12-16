const prisma = require('../prisma/prisma');
const { body, validationResult } = require('express-validator');
const passport = require('passport');

const postsListGet = (req, res) => {
  console.log('List of all posts');

  res.json('WIP list of all posts');
}

const createPostPost = [
  passport.authenticate('jwt', { session: false }),
  body('title').trim()
    .isLength({ min: 1 }).withMessage('Your post needs a title'),
  body('content').trim()
    .isLength({ min: 1 }).withMessage('The content cannot be empty'),
  async (req, res) => {
    console.log(req.user);
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Error creating a new blog post', errors });
    } else {
      // TODO Create blog post;

      res.json('WIP post created successfully');
    }
  }
];

module.exports = {
  postsListGet,
  createPostPost,
}
