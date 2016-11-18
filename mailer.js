var nodemailer = require('nodemailer'),
    config = require('./mail-config.js');

module.exports = function(movies) {
    var transporter = nodemailer.createTransport(config.smtps);

    config.mails.forEach(function(mail) {
        var mailOptions = {
            from: '"🎞 Свежие фильмы 🎞" <' + config.mail + '>',
            to: mail,
            subject: 'Кинотеатр Мультиплекс',
            html: movies.map(function(v) {
                return v.replace('"', '<b>&quot;').replace('"', '&quot;</b>')
            }).join('<br />')
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return console.log(error);
            }
        });
    });
};