const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();

router.route('/')
  .post((...args) => controller.create(...args));

router.route('/verify/:token').get((req, res, next) => controller.verify(req, res, next));

router.route('/:id')
  .put((...args) => controller.update(...args))
  .delete((...args) => controller.remove(...args));

module.exports = router;
