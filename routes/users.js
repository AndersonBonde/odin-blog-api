const { Router } = require('express');
const usersController = require('../controllers/usersController');

const router = new Router();

router.post('/register', usersController.registerPost);
router.post('/login', usersController.loginPost);
router.get('/logout', usersController.logoutGet);
router.get('/protected', usersController.protectedGet);

module.exports = router;
