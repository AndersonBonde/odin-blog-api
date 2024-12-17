const prisma = require('../prisma/prisma');
const { body, validationResult } = require('express-validator');
const passport = require('passport');

const postsListGet = async (req, res) => {
  const blogPosts = await prisma.blogPost.findMany();

  res.json({ message: `List of all posts fetched successfully, count: ${blogPosts.length}`, blogPosts });
}

const createPostPost = [
  passport.authenticate('jwt', { session: false }),
  body('title').trim()
    .isLength({ min: 1 }).withMessage('Your post needs a title'),
  body('content').trim()
    .isLength({ min: 1 }).withMessage('The content cannot be empty'),
  async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Error creating a new blog post', errors });
    } else {
      const blogPost = await prisma.blogPost.create({
        data: {
          title: req.body.title,
          content: req.body.content,
          authorId: req.user.id
        }
      });

      res.status(201).json({ message: 'Blog post created successfully', blogPost});
    }
  }
];

module.exports = {
  postsListGet,
  createPostPost,
}
