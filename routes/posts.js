const { Router } = require('express');
const postsController = require('../controllers/postsController');

const router = new Router();

router.get('/', postsController.postsListGet);
router.post('/create', postsController.createPostPost);
router.post('/create/comment', postsController.createPostComment);
router.get('/:id/comments', postsController.getAllComments);

module.exports = router;
