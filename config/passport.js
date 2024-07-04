const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const { validatePassword } = require('../lib/passwordUtils');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {

};

module.exports = (passport) => {

}
