var http = require('http'),
    fs = require('fs'),
    mail = require('./mailer.js'),
    lastIdFile = '.current-last',
    lastId,
    sec = 1000,
    min = sec * 60,
    movieList = [];

if (fs.existsSync(lastIdFile)) {
    lastId = Number(fs.readFileSync(lastIdFile));
} else {
    console.log('Please create "' + lastIdFile + '" file with film id (145141 for example)');
    return
}

function getFilm(filmId) {
    console.log(new Date() + ' - getFilm');
    var options = {
            host: 'meganomkino.ru',
            port: 80,
            path: '/book/' + filmId
        },
        data = '';

    http.get(options, function(res) {
        res.setEncoding('utf8');

        res.on("data", function(chunk) {
            data += chunk;
        });
        res.on("end", function() {
            var raw = data.match(/Сеанс.+ (VIP|Зал [0-9])/);

            if (raw) {
                console.log(new Date() + ' - Фильм есть');
                movieList.push({
                    text: raw[0],
                    url: 'http://meganomkino.ru/book/' + filmId
                });

                getFilm(filmId + 1);
            } else {
                console.log(new Date() + ' - Фильмa нет');
                if (movieList.length) {
                    console.log(new Date() + ' - Отправляю почту');
                    mail(movieList);
                    movieList = [];
                }

                fs.writeFileSync(lastIdFile, filmId);

                process.exit();
            }
        });
    }).on('error', function(e) {

    });
}

getFilm(lastId);
