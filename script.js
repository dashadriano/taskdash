// TO-DO LIST LOGIC
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const addButton = document.getElementById("add-btn");
const TASK_LIMIT = 5;

function addTask() {
    const currentTasks = listContainer.querySelectorAll("li").length;

    if (currentTasks >= TASK_LIMIT) {
        addButton.classList.add("shake");
        setTimeout(() => { addButton.classList.remove("shake"); }, 400);
        return;
    }

    if (inputBox.value.trim() !== '') {
        const li = document.createElement("li");
        li.textContent = inputBox.value;
        listContainer.appendChild(li);

        const span = document.createElement("span");
        span.textContent = "\u00d7";
        li.appendChild(span);

        inputBox.value = "";
        saveData();
        enforceTaskLimit(); // check if limit reached
    } else {
        addButton.classList.add("shake");
        setTimeout(() => { addButton.classList.remove("shake"); }, 400);
    }
}


listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
        enforceTaskLimit();
    }
});

inputBox.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

document.getElementById("add-btn").addEventListener("click", addTask);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showList() {
    listContainer.innerHTML = localStorage.getItem("data");
    enforceTaskLimit();
}

function enforceTaskLimit() {
    const currentTasks = listContainer.querySelectorAll("li").length;
    const limitReached = currentTasks >= TASK_LIMIT;

    inputBox.disabled = limitReached;
    addButton.disabled = limitReached;

    inputBox.placeholder = limitReached
        ? `Task limit reached! (${TASK_LIMIT})`
        : "Add new task..";
}

showList();

// POMODORO TIMER LOGIC
let timer;
let timeLeft = 1500; // 25 minutes in seconds
let isPaused = false;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-timer");
const resetBtn = document.getElementById("reset-timer");

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startOrToggleTimer() {
    if (!timer) {
        // if timer is not running start fresh
        timer = setInterval(tick, 1000);
        updateStartBtnIcon("pause");
        isPaused = false;
    } else {
        // if timer is running pause/resume toggle
        isPaused = !isPaused;
        updateStartBtnIcon(isPaused ? "play" : "pause");
    }
}

function tick() {
    if (!isPaused && timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
    } else if (timeLeft <= 0) {
        clearInterval(timer);
        timer = null;
        updateStartBtnIcon("play");
        timeLeft = 0;
    }
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeLeft = 1500;
    isPaused = false;
    updateTimerDisplay();
    updateStartBtnIcon("play");
}

function updateStartBtnIcon(state) {
    const iconMap = {
        play: "start.svg",
        pause: "pause.svg"
    };
    startBtn.innerHTML = `<img src="imgs/light-mode/${iconMap[state]}" alt="${state}">`;
}

// event listeners
startBtn.addEventListener("click", startOrToggleTimer);
resetBtn.addEventListener("click", resetTimer);

// init display
updateTimerDisplay();