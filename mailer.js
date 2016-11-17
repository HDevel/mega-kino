var nodemailer = require('nodemailer'),
    config = require('./mail-config.js');

module.exports = function(filmInfo) {
    var transporter = nodemailer.createTransport(config.smtps);

    config.mails.forEach(function(mail) {
        var mailOptions = {
            from: '"🎞" <mega-kino-watcher@ya.ru>',
            to: mail,
            subject: filmInfo.name,
            html: 'Дата: <b>' + filmInfo.date + ' (' + filmInfo.day + ')</b><br />' +
            'Время: <b>' + filmInfo.time + '</b><br />' +
            'Зал: <b>' + filmInfo.room + '</b><br />'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
        });
    });
};