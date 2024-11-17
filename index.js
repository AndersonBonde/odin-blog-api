const express = require('express');
const passport = require('passport');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./config/passport')(passport);

app.use(require('./routes'));

app.listen(3000, () => console.log('App listening on port 3000!'));
