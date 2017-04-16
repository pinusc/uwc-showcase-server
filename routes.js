const express = require('express');
const Router = express.Router;
const router = new Router();
var path = require('path');

const post = require('./model/post/router');
const user = require('./model/user/router');

router.route('/api').get((req, res) => {
  res.json({ message: 'Welcome to uwc-showcase-server API!' });
});
router.route('/').get((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
router.use('/static', express.static(__dirname + '/dist/static'))


router.use('/api/post', post);
router.use('/api/user', user);

module.exports = router;
