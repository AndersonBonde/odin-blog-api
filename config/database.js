const mongoose = require('mongoose');
const mongoDB = process.env.MONGO_DATABASE_KEY;

require('dotenv').config();

mongoose.set('strictQuery', false);

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));
