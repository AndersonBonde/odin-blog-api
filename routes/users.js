var express = require('express');
var router = express.Router();

// --- GET home page.
router.get('/', (req, res, next) => {
  res.json({ title: 'Welcome to Blog API users resource'});
});

// --- GET signup.
router.get('/signup', (req, res, next) => {
  res.json({ title: 'Sign Up' });
});

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
