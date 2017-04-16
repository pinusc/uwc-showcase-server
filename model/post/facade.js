const Facade = require('../../lib/facade');
const postSchema = require('./schema');

class PostFacade extends Facade {
  create(req) {
    const schema = new this.Schema(req.body);
    req.createResult = schema;
    return schema.save();
  }
  find(...args) {
    var myArgs = {};
    var options = {};
    if (args.length) {
        for (var key in args[0]) {
          if (args[0].hasOwnProperty(key)) {
              if (key.startsWith('opt')) {
                  options[key] = args[0][key];
              } else {
                  myArgs[key] = args[0][key];
              }
          }
        }
    }

    var result = this.Schema.find(myArgs);
    if (options.optSort !== undefined) {
        var a = {}
        a[options.optSort]= parseInt(options.optDirection) || 1;
        result = result.sort(a);
    }
    if (options.optSkip !== undefined) {
        result = result.skip(parseInt(options.optSkip));
    }
    if (options.optLimit !== undefined) {
        result = result.limit(parseInt(options.optLimit));
    }
    return result.exec();
  }
}

module.exports = new PostFacade(postSchema);
