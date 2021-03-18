var lastValidInputPeriod = '25:00';
var timerInterval = null;
var timeCounter = null;

var outputTimer = document.getElementById('timer-time');

setTimeValueOnScreen(lastValidInputPeriod)

var inputPeriod = document.getElementById('input-period');
inputPeriod.addEventListener('input', e => {
    if (e.inputType != 'deleteContentBackward' && /^[0-9]{2}$/.test(e.target.value)){
        e.target.value = e.target.value + ':';
    }

    if (e.target.value === '' || /^[0-9]{1,2}[:|-]{0,1}[0-5]{0,1}[0-9]{0,1}$/.test(e.target.value)){
        lastValidInputPeriod = e.target.value;
        reset();
    } else {
        e.target.value = lastValidInputPeriod;
    }
});


var btnStart = document.getElementById('btn-start');
btnStart.addEventListener('click', e => {
    if (timerInterval){
        return;
    }
    if (timeCounter === null || timeCounter <= 0) {
        timeCounter = timeToSeconds(lastValidInputPeriod);
    }

    setTimeValueOnScreen(secondsToTime(timeCounter));
    timerInterval = setInterval(() => tick(), 1000);
});

function tick(){
    timeCounter -= 1;
    setTimeValueOnScreen(secondsToTime(timeCounter));
}

var btnStop = document.getElementById('btn-stop');
btnStop.addEventListener('click', e => {

    clearInterval(timerInterval);
    timerInterval = null;
    setTimeValueOnScreen(secondsToTime(timeCounter));
});

var btnReset = document.getElementById('btn-reset');
btnReset.addEventListener('click', reset);

function reset(){
    clearInterval(timerInterval);
    timerInterval = null;
    timeCounter = timeToSeconds(lastValidInputPeriod);
    setTimeValueOnScreen(secondsToTime(timeCounter));
}



function setTimeValueOnScreen(timerValue) {
    outputTimer.innerHTML=timerValue;
    document.title = timerInterval === null
        ? 'Pomodoro Timer'
        : `[${timerValue}] Pomodoro Timer`;
}

function timeToSeconds(timeAsString){
    if (timeAsString === null || timeAsString === ''){
        return 25*60;
    }
    var arr = timeAsString.split(':');
    var seconds = arr[0]*60;
    if (arr[1]){
        seconds += parseInt(arr[1]);
    }
    return seconds === 0 ? 25*60 : seconds;
}

function secondsToTime(timeCounter){
    var isNegative = timeCounter < 0;
    var workTimeCounter = Math.abs(timeCounter);

    var minutes = Math.floor(workTimeCounter/60);
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    var seconds = workTimeCounter%60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    var minus = isNegative ? '-' : ''

    return `${minus}${minutes}:${seconds}`;
}




