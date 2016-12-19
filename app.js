var http = require('http'),
    fs = require('fs'),
    mail = require('./mailer.js'),
    lastIdFile = '.current-last',
    runningFile = './logs/mega.log',
    lastId,
    sec = 1000,
    min = sec * 60,
    movieList = [],
    retries = 5;

if (fs.existsSync(runningFile) && fs.readFileSync(runningFile).toString() !== '') {
    console.log('Another process is running');
    return
}

if (fs.existsSync(lastIdFile)) {
    lastId = Number(fs.readFileSync(lastIdFile));
} else {
    console.log('Please create "' + lastIdFile + '" file with film id (145141 for example)');
    return
}

console.log(new Date() + ' - id: ' + lastId);

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
            var raw = data.match(/Сеанс.+ (VIP|Зал [0-9])/),
                log;

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

                log = fs.readFileSync(runningFile).toString();

                if(log.split('\n').length === 4 && log.match(/Фильмa нет\n$/)) {
                    fs.unlink(runningFile);
                }

                fs.writeFileSync(lastIdFile, filmId);

                setTimeout(function() {
                    process.exit();
                }, min);
            }
        });
    }).on('error', function(e) {
        console.log(new Date() + ' - error (retry: ' + retries + ')');
        console.log(e);

        if (retries > 0) {
            retries--;

            getFilm(filmId);
        } else {
            setTimeout(function() {
                process.exit();
            }, min);
        }
    });
}

setTimeout(function() {
    getFilm(lastId);
}, Math.random() * min * 7);
