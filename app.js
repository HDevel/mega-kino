var http = require('http');

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
                console.log('last one')
            }
        });
    }).on('error', function(e) {

    });
}

getFilm(145140);
