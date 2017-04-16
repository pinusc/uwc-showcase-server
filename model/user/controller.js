const Controller = require('../../lib/controller');
const userFacade = require('./facade');
const secret = 'test-secret-please-ignore';
var jwt = require('jwt-simple');
const util = require('../../lib/util')

class UserController extends Controller {
    create(req, res, next) {
        this.facade.create(req).then(doc => res.status(201).json(doc)).catch(err => next(err));
        console.log("res", req.createResult);
        var payload = { _id: req.createResult._id };
        var token = jwt.encode(payload, secret);
        const html = 'Please <a href="http://localhost:8080/api/user/verify/' + token + '">click here</a> on the link to confirm that you registered to the newsletter'
        util.sendMail({to: req.body.email, subject: 'UWC showcase newsletter', html:html});
    }

    verify(req, res, next) {
        console.log(this);
        var token = req.params.token;
        var result = jwt.decode(token, secret);
        console.log(result);
        this.facade.update({_id: result}, {verified: token})
            .then((results) => {
                if(results.nModified < 1) return res.sendStatus(304).send("Your link was not valid");
                res.redirect("/");
            })
            .catch(err => next(err));
        return true;
    }

    newsLetter(doc) {
        this.facade.find(
            {verified: true, subscribed: true}, 
            function (e, users) {
                const html = 'There is a new post on UWC showcase!\n<h1>' + doc.title + "</h1>\n" + doc.body + "\n\n<a href='http://localhost:8080#" + doc._id + "'>Click here to see the message thread</a>";
                console.log(html);
                for(var i = 0; i < users.length; i++) {
                    util.sendMail({to: users[i].email, subject: 'UWC showcase newsletter', html:html});
                }

            });
    }
}

module.exports = new UserController(userFacade);
