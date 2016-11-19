var nodemailer = require('nodemailer'),
    config = require('./mail-config.js');

module.exports = function(movies) {
    var transporter = nodemailer.createTransport(config.smtps);

    config.mails.forEach(function(mail) {
        var mailOptions = {
            from: '"🎞 Свежие фильмы 🎞" <' + config.mail + '>',
            to: mail,
            subject: 'Кинотеатр Мультиплекс',
            html: '<ul>' +
                movies.map(function(v) {
                    var split = v.text.split('"');

                    return '<li><a href="' + v.url + '"><b>"' + split[1] + '"</b></a>' + split[2]  + '</li>';
                }).join('<br />') +
            '</ul>'
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return console.log(error);
            }
        });
    });
};