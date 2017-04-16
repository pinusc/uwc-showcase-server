const Controller = require('../../lib/controller');
const postFacade = require('./facade');
const stripJs = require('strip-js');
const util = require('../../lib/util')
const userController = require('../user/controller');
var jwt = require('jwt-simple');
var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var secret = 'test-secret-please-ignore';
class PostController extends Controller {
    find(req, res, next) {
        req.query.verified = true; // can not return unVerified posts
        console.log("find Query: ", req.query);
        var result  = super.find(req, res, next);
        return result;
    }

    create(req, res, next) {
        var valid = validate(req.body);
        if (!valid) {
            res.status(304).send("Error in validation phase");
            return;
        }
        req.body = valid;
        this.facade.create(req).then(doc => res.status(201).json(doc)).catch(err => next(err));
        var payload = { _id: req.createResult._id };
        var token = jwt.encode(payload, secret);
        const html = 'Please <a href="http://localhost:8080/api/post/verify/' + token + '">click here</a> on the link to confirm that you sent a message.';
        util.sendMail({to: req.body.email, subject: 'UWC showcase auth', html:html}, req);
    }

    verify(req, res, next) {
        console.log(this);
        var token = req.params.token;
        var result = jwt.decode(token, secret);
        console.log(result);
        this.facade.update({_id: result}, {verified: token})
            .then((results) => {
                if(results.nModified < 1) return res.sendStatus(304).send("Your link was not valid");
                if(results.nModified === 1) 
                    this.facade.Schema.findById(result, function (e, f) {
                        userController.newsLetter(f);
                    }).exec();
                res.redirect("/");
            })
            .catch(err => next(err));
        return true;
    }

}

function validate (body) {
    if (body.email === undefined || body.body === undefined || body.title === undefined) return false;
    if ( !re.test(body.email) ) return false;
    if ( !body.email.toLowerCase().endsWith("@uwcchina.org") ) return false;
    body.body = stripJs(body.body);
    return body;
}

module.exports = new PostController(postFacade);
