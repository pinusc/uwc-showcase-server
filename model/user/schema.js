const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const util = require('../../lib/util');


const userSchema = new Schema({
  email: { type: String, required: true },
  subscribed: {type: Boolean, default: false},
  verified: {type: Boolean, default: false, set: util.verify},
});

module.exports = mongoose.model('User', userSchema);
