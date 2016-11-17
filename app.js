var http = require('http'),
    fs = require('fs'),
    mail = require('./mailer.js'),
    lastIdFile = '.current-last',
    lastId;

if (fs.existsSync(lastIdFile)) {
    lastId = Number(fs.readFileSync(lastIdFile));
} else {
    console.log('Please create "' + lastIdFile + '" file with film id (145141 for example)');
    return
}

function getFilm(filmId) {
    var options = {
            host: 'meganomkino.ru',
            port: 80,
            path: '/book/' + filmId
        },
        data = '';

    http.get(options, function(res) {
        res.on("data", function(chunk) {
            data += chunk;
        });
        res.on("end", function() {
            var raw = data.match(/Сеанс.+ (VIP|Зал [0-9])/);

            if (raw) {
                var sliceName = raw[0].split('"'),
                    dates = sliceName[2].split(' ');

                var info = {
                    name: sliceName[1],
                    date: dates[1],
                    day: dates[2],
                    time: dates[3],
                    room: dates[5] || dates[4]
                };

                mail(info);

                getFilm(filmId + 1);
            } else {
                fs.writeFileSync(lastIdFile, filmId);

                console.log('last one')
            }
        });
    }).on('error', function(e) {

    });
}

getFilm(lastId);
