var lastValidInputPeriod = '25:00';
var timerInterval = null;
var timeCounter = null;

var outputTimer = document.getElementById('timer-time');
var inputTaskDesc = document.getElementById('task-input');


var data = [
    {
        period: '12:00 - 12:25',
        task: 'Reading book'
    },
    {
        period: '11:00 - 11:25',
        task: 'Watching tutorials'
    },
    {
        period: '10:00 - 10:25',
        task: 'Exercises'
    }
];



setTimeValueOnScreen(lastValidInputPeriod);
manageTaskList();

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

    manageTaskList('start');
    setTimeValueOnScreen(secondsToTime(timeCounter));
    timerInterval = setInterval(() => tick(), 1000);
});

function tick(){
    timeCounter -= 1;
    setTimeValueOnScreen(secondsToTime(timeCounter));
}

var btnStop = document.getElementById('btn-stop');
btnStop.addEventListener('click', e => {

    manageTaskList('pause');
    clearInterval(timerInterval);
    timerInterval = null;
    setTimeValueOnScreen(secondsToTime(timeCounter));
});

var btnReset = document.getElementById('btn-reset');
btnReset.addEventListener('click', reset);

function reset(){
    
    manageTaskList('stop');
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
    var seconds = workTimeCounter%60;
    
    formatTimeWithPadding(minutes, seconds)
    var minus = isNegative ? '-' : ''

    return minus + formatTimeWithPadding(minutes, seconds);
}

function formatTimeWithPadding(first, second){
    return first.toString().padStart(2, '0') + ':' + second.toString().padStart(2, '0');
}

function manageTaskList(action){

    if (action === 'start'){
        var taskDesc = inputTaskDesc.value;
        var taskStartTime = getCurrentTime();
        data = [{
            period: taskStartTime + ' -',
            task: taskDesc
        }].concat(data);
        
    }
    else if (action === 'pause'){
        var currentEntry = data[0];
        currentEntry.period = currentEntry.period + getCurrentTime() + ' ... '; 
    } 
    else if (action === 'stop'){
        var currentEntry = data[0];
        currentEntry.period = currentEntry.period + getCurrentTime(); 
    }

    updateTaskList(data);
}

function getCurrentTime(){
    var date = new Date();
    return formatTimeWithPadding(date.getHours(), date.getMinutes());
}

function updateTaskList(data){
    
    var panel = document.getElementById('list-tasks');
    while (panel.lastElementChild) {
        panel.removeChild(panel.lastElementChild);
    }

    var ul = document.createElement('ul');
    for (let element of data){
        ul.appendChild(buildListElement(element.period, element.task));
    }

    if (data.length === 0){
        ul.appendChild(buildListElement('', ''));
    }

    panel.appendChild(ul);
}

function buildListElement(period, task){
    var li = document.createElement('li');
    var divPeriod = document.createElement('div');
    var divTask = document.createElement('div');

    divPeriod.className = 'time-period';
    divPeriod.innerHTML = period;

    divTask.className = 'wrapped-content-text';
    divTask.innerHTML = task;

    li.appendChild(divPeriod);
    li.appendChild(divTask);
    return li; 
}

/* <ul>
    <li>
        <div class="time-period">12:00 - 12:25</div>
        <div class="wrapped-content-text">Reading book</div>
    </li>
    <li>
        <div class="time-period">11:00 - 11:25</div>
        <div class="wrapped-content-text">Watching tutorials</div>
    </li>
    <li>
        <div class="time-period">10:00 - 10:25</div>
        <div class="wrapped-content-text">Exercises</div>
    </li>
</ul> */




