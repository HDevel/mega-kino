mkdir -p logs && node app.js >> logs/mega.log 2>&1;
if [ -f logs/mega.log ]; then
    mv logs/mega.log logs/$(date "+%y.%m.%d_%H-%M-%S").log
fi
