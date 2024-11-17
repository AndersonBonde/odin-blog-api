const { Router } = require('express');

const router = new Router();

router.get('/', (req, res) => {
  res.json({ message: 'Index page' });
});

router.use('/users', require('./users'));

module.exports = router;