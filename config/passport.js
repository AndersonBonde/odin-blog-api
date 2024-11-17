const fs = require('node:fs');
const path = require('node:path');
const prisma = require('../prisma/prisma');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { 
        id: payload.sub 
      }
    });

    if (!user) {
      return done(null, false, { message: 'User not found' });
    } else {
      return done(null, user);
    }
  } catch (err) {
    return done(err);
  }
});

module.exports = (passport) => {
  passport.use(strategy);
}
