mkdir logs
node app.js >> logs/mega.log 2>&1;
mv logs/mega.log logs/$(date "+%y.%m.%d_%H-%M-%S").log
