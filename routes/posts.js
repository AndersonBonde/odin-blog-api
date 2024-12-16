const { Router } = require('express');
const postsController = require('../controllers/postsController');

const router = new Router();

router.get('/', postsController.postsListGet);
router.post('/create', postsController.createPostPost);

module.exports = router;
