var lastValidInputPeriod = '25:00';
var timerInterval = null;
var timeCounter = null;

var outputTimer = document.getElementById('timer-time');
var inputTaskDesc = document.getElementById('task-input');
var standardFontColor = outputTimer.className;

var data = [
    // {
    //     period: '12:00 - 12:25',
    //     task: 'Reading book'
    // },
    // {
    //     period: '11:00 - 11:25',
    //     task: 'Watching tutorials'
    // },
    // {
    //     period: '10:00 - 10:25',
    //     task: 'Exercises'
    // }
];


restoreDataFromCookies();
setTimeValueOnScreen(lastValidInputPeriod);
manageTaskList();

var inputPeriod = document.getElementById('input-period');
inputPeriod.addEventListener('input', e => {
    if (e.inputType != 'deleteContentBackward' && /^[0-9]{2}$/.test(e.target.value)){
        e.target.value = e.target.value + ':';
    }

    if (e.target.value === '' || /^[0-9]{1,2}[:|-]{0,1}[0-5]{0,1}[0-9]{0,1}$/.test(e.target.value)){
        lastValidInputPeriod = e.target.value;
        if (!timerInterval){
            reset();
        }
    } else {
        e.target.value = lastValidInputPeriod;
    }
});
inputPeriod.addEventListener('change', e => {
    e.target.value = secondsToTime(timeToSeconds(lastValidInputPeriod));
    reset();
})



var btnStart = document.getElementById('btn-start-pause');
btnStart.addEventListener('click', e => {
    var currentFunction = btnStart.innerHTML;

    if (timeCounter === 0) {
        return;
    }

    if (currentFunction === 'Start'){
        manageTaskList('start');
        timeCounter = timeToSeconds(lastValidInputPeriod);
        timerInterval = setInterval(() => tick(), 1000);
        btnStart.innerHTML = 'Pause';
        
    }
    else if (currentFunction === 'Pause'){
        manageTaskList('pause');
        clearInterval(timerInterval);
        timerInterval = null;
        setTimeValueOnScreen(secondsToTime(timeCounter));
        btnStart.innerHTML = 'Resume';
    }
    else if (currentFunction === 'Resume'){
        manageTaskList('resume');
        timerInterval = setInterval(() => tick(), 1000);
        btnStart.innerHTML = 'Pause';
    }

    setTimeValueOnScreen(secondsToTime(timeCounter));
});


function tick(){
    if (timeCounter > 0){
        timeCounter -= 1;
    }
    setTimeValueOnScreen(secondsToTime(timeCounter));
}


var btnReset = document.getElementById('btn-reset');
btnReset.addEventListener('click', reset);

function reset(){
    
    if (btnStart.innerText != 'Start'){
        manageTaskList('stop');
    }
    clearInterval(timerInterval);
    timerInterval = null;
    timeCounter = timeToSeconds(lastValidInputPeriod);
    setTimeValueOnScreen(secondsToTime(timeCounter));
    btnStart.innerHTML = 'Start';
    outputTimer.style.color = standardFontColor;
}



function setTimeValueOnScreen(timerValue) {
    if (timerValue === '00:00'){
        if (outputTimer.className === 'timer-vanished'){
            outputTimer.className = 'timer';
        }
        else {
            outputTimer.className = 'timer-vanished';
        }
    }
    else {
        outputTimer.className = 'timer';
    }
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
            period: taskStartTime + ' - ',
            task: taskDesc
        }].concat(data);
        
    }
    else if (action === 'pause'){
        var currentEntry = data[0];
        currentEntry.period = currentEntry.period + getCurrentTime() + ' ... '; 
    } 
    else if (action === 'resume'){
        var currentEntry = data[0];
        currentEntry.period = currentEntry.period + getCurrentTime() + ' - '; 
    }
    else if (action === 'stop'){
        var currentEntry = data[0];
        currentEntry.period = currentEntry.period + getCurrentTime(); 
    }

    storeDataInCookies();
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

function storeDataInCookies(){
    var expDate = new Date();
    expDate.setDate(expDate.getDate() + 1);
    document.cookie = "data=" + JSON.stringify(data) + "; SameSite=Strict; path=/; expires=" + expDate.toUTCString();
}

function restoreDataFromCookies(){
    var ca = document.cookie.split(';');
    var localData = null;
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf("data") == 0) {
            localData = c.substring("data".length,c.length);
            break;
        }
    }

    var newJson = localData.replace(/'/g, '"');

    newJson = newJson.replace(/([^"]+)|("[^"]+")/g, function($0, $1, $2) {
        if ($1) {
            return $1.replace(/([a-zA-Z0-9]+?):/g, '"$1":');
        } else {
            return $2; 
        } 
    });

    data = JSON.parse(newJson);
}




