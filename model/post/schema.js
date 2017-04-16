const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const util = require('../../lib/util');

const userController = require('../user/controller');

var  postSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  email: {type: String, required: true},
  verified: {type: Boolean, default: false, set: util.verify},
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
