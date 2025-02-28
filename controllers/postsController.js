const prisma = require('../prisma/prisma');
const { body, validationResult } = require('express-validator');
const passport = require('passport');

const postsListGet = async (req, res) => {
  const blogPosts = await prisma.blogPost.findMany({
    include: {
      author: true
    }
  });

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

const getAllComments = async (req, res) => {
  const comments = await prisma.comment.findMany({
    where: {
      blogPostId: Number(req.params.id)
    },
    include: {
      author: true
    }
  });

  res.json({ message: `List of all comments from post with id: ${req.params.id} fetched successfully, count: ${comments.length}`, comments });
};

const createPostComment = [
  async (req, res) => {
    const newComment = await prisma.comment.create({
      data: {
        content: req.body.comment,
        authorId: req.body.authorId,
        blogPostId: req.body.postId
      }
    });

    res.status(201).json({ message: 'Comment created successfully', newComment });
  }
];

const deletePostComment = async (req, res) => {
  await prisma.comment.delete({
    where: {
      id: +req.params.id
    }
  });

  res.status(200).json({ message: `Comment with id: ${req.params.id} was successfully deleted` });
};

module.exports = {
  postsListGet,
  createPostPost,
  getAllComments,
  createPostComment,
  deletePostComment,
}
