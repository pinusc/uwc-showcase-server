const Facade = require('../../lib/facade');
const userSchema = require('./schema');

class UserFacade extends Facade {
  create(req) {
    const schema = new this.Schema(req.body);
    req.createResult = schema;
    return schema.save();
  }
}

module.exports = new UserFacade(userSchema);
