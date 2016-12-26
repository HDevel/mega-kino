var nodemailer = require('nodemailer'),
    config = require('./mail-config.js');

module.exports = function(movies, callback) {
    var transporter = nodemailer.createTransport(config.smtps),
        html = '',
        titlesHash = {},
        titles = [],
        mails = config.mails.length;

    movies = movies
        .sort(function(a, b) {
            return a.text > b.text ? 1 : -1;
        })
        .map(function(v) {
            var split = v.text.split('"'),
                title = split[1];

            if (!titlesHash[title]) {
                titlesHash[title] = true;
                titles.push(title);
            }

            return '<li><a href="' + v.url + '"><b>"' + title + '"</b></a>' + split[2] + '</li>';
        });

    html += '<h3>Фильмы</h3><ul><li>' + titles.sort().join('</li><li>') + '</li></ul>';
    html += '<h3>Сеансы</h3><ul>' + movies.join('') + '</ul>';

    config.mails.forEach(function(mail) {
        var mailOptions = {
                from: '"🎞 Свежие фильмы 🎞" <' + config.mail + '>',
                to: mail,
                subject: 'Кинотеатр Мультиплекс',
                html: html
            };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return console.log(error);
            } else {
                mails--;
                if (mails === 0) {
                    callback();
                }
            }
        });
    });
};