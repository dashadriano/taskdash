// TO-DO LIST LOGIC
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const addTaskButton = document.getElementById("add-task-btn");
const TASK_LIMIT = 5;

function addTask() {
    const currentTasks = listContainer.querySelectorAll("li").length;

    if (currentTasks >= TASK_LIMIT) {
        addTaskButton.classList.add("shake");
        setTimeout(() => { addTaskButton.classList.remove("shake"); }, 400);
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
        saveTaskData();
        enforceTaskLimit(); // check if limit reached
    } else {
        addTaskButton.classList.add("shake");
        setTimeout(() => { addTaskButton.classList.remove("shake"); }, 400);
    }
}

listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveTaskData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveTaskData();
        enforceTaskLimit();
    }
});

inputBox.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

document.getElementById("add-task-btn").addEventListener("click", addTask);

function saveTaskData() {
    localStorage.setItem("tasks-data", listContainer.innerHTML);
}

function showList() {
    listContainer.innerHTML = localStorage.getItem("tasks-data");
    enforceTaskLimit();
}

function enforceTaskLimit() {
    const currentTasks = listContainer.querySelectorAll("li").length;
    const limitReached = currentTasks >= TASK_LIMIT;

    inputBox.disabled = limitReached;
    addTaskButton.disabled = limitReached;

    inputBox.placeholder = limitReached
        ? `Task limit reached!`
        : "Add new task..";
}

showList();

// GOAL LIST LOGIC
const goalInputBox = document.getElementById("goal-input-box");
const goalsContainer = document.getElementById("goals-container");
const addGoalButton = document.getElementById("add-goal-btn");
const GOAL_LIMIT = 1;

function addGoal() {
    const currentGoals = goalsContainer.querySelectorAll("li").length;

    if (currentGoals >= GOAL_LIMIT) {
        addGoalButton.classList.add("shake");
        setTimeout(() => { addGoalButton.classList.remove("shake"); }, 400);
        return;
    }

    if (goalInputBox.value.trim() !== '') {
        const li = document.createElement("li");
        li.textContent = goalInputBox.value;
        goalsContainer.appendChild(li);

        const span = document.createElement("span");
        span.textContent = "\u00d7";
        li.appendChild(span);

        goalInputBox.value = "";
        saveGoalData();
        enforceGoalLimit(); // check if limit reached
    } else {
        addGoalButton.classList.add("shake");
        setTimeout(() => { addGoalButton.classList.remove("shake"); }, 400);
    }
}

function enforceGoalLimit() {
    const currentGoals = goalsContainer.querySelectorAll("li").length;
    const limitReached = currentGoals >= GOAL_LIMIT;

    goalInputBox.disabled = limitReached;
    addGoalButton.disabled = limitReached;

    goalInputBox.placeholder = limitReached
        ? `Your main goal is:`
        : "What's your main goal?";
}

goalInputBox.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addGoal();
    }
});

goalsContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveGoalData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveGoalData();
        enforceGoalLimit();
    }
});

addGoalButton.addEventListener("click", addGoal);

function saveGoalData() {
    localStorage.setItem("goals-data", goalsContainer.innerHTML);
}

function showGoals() {
    goalsContainer.innerHTML = localStorage.getItem("goals-data");
    enforceGoalLimit();
}

showGoals();

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