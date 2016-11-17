var http = require('http'),
    fs = require('fs'),
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
            var regExp = data.match(/Сеанс.+ (VIP|Зал [0-9])/);

            if (regExp) {
                console.log(regExp && regExp[0]);

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

