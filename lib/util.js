const jwt = require('jwt-simple');
const api_key = 'key-b5fbd93e71246b83c5b418cc5ca6c3e7';
const domain = 'sandbox3fe99f3790b64045af7cb7ed468ccbff.mailgun.org';
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
const secret = 'test-secret-please-ignore';

module.exports = {
    verify: function (token) {
        try {
            var decoded = jwt.decode(token, secret);
            console.log("VERIFY", decoded);
            if (decoded._id === this._id) return true;
        } finally {
            return false;
        }
    },
    sendMail: function(mail) {
        var data = {
          from: 'UWC showcase <uwc@samples.mailgun.org>',
          to: mail.to,
          subject: mail.to,
          html: mail.html
        };

        mailgun.messages().send(data, function (error, body) {
          console.log(body);
        });
    }
}
