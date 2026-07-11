// NAVBAR
const body = document.querySelector("body"),
sidebar = body.querySelector(".sidebar"),
toggle = body.querySelector(".toggle"),
SearchBtn = body.querySelector(".search-box"),
modeSwitch = body.querySelector(".switch"),
modeText = body.querySelector(".text")

const themeToggle = document.getElementById("theme-toggle");

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});

themeToggle.addEventListener("change", () => {
    body.classList.toggle("dark", themeToggle.checked);
});

// TIMER
let hours = document.getElementById("hours")
let minutes = document.getElementById("minutes")
let seconds = document.getElementById("seconds")

setInterval( () => {
let currentTime = new Date();

hours.innerHTML = currentTime.getHours();
minutes.innerHTML = currentTime.getMinutes();
seconds.innerHTML = currentTime.getSeconds();
},1000)

// DAY-DATE

let greeting = document.getElementById("greeting")
let currentDate = document.getElementById("current-date")
let dayProgress = document.getElementById("day-progress")

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

setInterval( () => {
let now = new Date();
let hour = now.getHours();

if(hour < 12){
    greeting.innerHTML = "Morning";
}
else if(hour < 17){
    greeting.innerHTML = "Afternoon";
}
else if(hour < 20){
    greeting.innerHTML = "Evening";
}
else{
    greeting.innerHTML = "Night";
}

currentDate.innerHTML = days[now.getDay()] + " " + now.getDate() + " " + months[now.getMonth()];

let totalSeconds = hour * 3600 + now.getMinutes() * 60 + now.getSeconds();
let percent = Math.round((totalSeconds / 86400) * 100);
dayProgress.innerHTML = percent + "%";

},1000)

// WEATHER CARD (DASHBOARD PREVIEW)//
document.addEventListener("DOMContentLoaded", () => {
  // 1. Set current date immediately
  const options = { day: 'numeric', month: 'long', weekday: 'long' };
  const todayStr = new Date().toLocaleDateString('en-US', options);
  const dateTag = document.getElementById("card-date-time");
  if (dateTag) dateTag.innerText = todayStr;

  // Image Library for backgrounds
  const weatherImages = {
    sunny: "url('https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=700')",
    rainy: "url('https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=700')",
    cloudy: "url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=700')",
    snowy: "url('https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=700')"
  };

  // Immediate Fallback Data if the API endpoint goes completely offline
  function useFallback() {
    console.warn("Using fallback weather data.");
    document.getElementById("current-temp").innerText = "31°";
    document.getElementById("weather-summary").innerText = "Chance of Rain: 51%";
    document.getElementById("current-location").innerText = "Srinagar";
    document.getElementById("metric-wind").innerText = "7km/h";
    document.getElementById("metric-humidity").innerText = "32%";
    document.getElementById("metric-aqi").innerText = "134";
    
    const bgContainer = document.getElementById("dynamic-bg");
    if (bgContainer) bgContainer.style.backgroundImage = weatherImages.sunny;
  }

  // 2. Fetch data directly using IP location (Bypasses browser permission popups!)
  async function fetchWeather() {
    try {
      // Leaving the lat/long out forces wttr.in to instantly auto-detect location via IP
      const response = await fetch(`https://wttr.in/?format=j1`);
      if (!response.ok) throw new Error("API network response failed");

      const data = await response.json();
      const current = data.current_condition[0];
      const area = data.nearest_area[0];
      const desc = current.weatherDesc[0].value.toLowerCase();
      const bgContainer = document.getElementById("dynamic-bg");

      // Inject data values safely into your DOM targets
      document.getElementById("current-temp").innerText = `${current.temp_C}°`;
      document.getElementById("weather-summary").innerText = current.weatherDesc[0].value;
      document.getElementById("current-location").innerText = area.areaName[0].value;
      document.getElementById("metric-wind").innerText = `${current.windspeedKmph}km/h`;
      document.getElementById("metric-humidity").innerText = `${current.humidity}%`;
      document.getElementById("metric-aqi").innerText = "134";

      // Dynamically handle responsive photo swap
      if (desc.includes("rain") || desc.includes("drizzle") || desc.includes("shower") || desc.includes("thunder")) {
        if (bgContainer) bgContainer.style.backgroundImage = weatherImages.rainy;
      } else if (desc.includes("snow") || desc.includes("ice") || desc.includes("sleet")) {
        if (bgContainer) bgContainer.style.backgroundImage = weatherImages.snowy;
      } else if (desc.includes("cloud") || desc.includes("overcast") || desc.includes("mist") || desc.includes("fog")) {
        if (bgContainer) bgContainer.style.backgroundImage = weatherImages.cloudy;
      } else {
        if (bgContainer) bgContainer.style.backgroundImage = weatherImages.sunny;
      }

    } catch (error) {
      console.error("Weather fetch failed:", error);
      useFallback();
    }
  }

  // Execute fetch immediately on load
  fetchWeather();
});

const todoProgress = document.getElementById("todo-progress-percent");
const todoHighCount = document.getElementById("todo-high-count");

if (todoProgress) todoProgress.innerText = "0%";
if (todoHighCount) todoHighCount.innerText = "0";

// ==========================================================================
// SPA NAVIGATION
// Replaces window.location based page navigation with show/hide of sections.
// ==========================================================================

const pageDisplay = {
    dashboard: "block",
    todo: "flex",
    planner: "block",
    goals: "block",
    pomodoro: "block",
    quote: "flex",
    weather: "block"
};

function showPage(pageId) {
    Object.keys(pageDisplay).forEach((id) => {
        const el = document.getElementById("page-" + id);
        if (!el) return;
        el.style.display = (id === pageId) ? pageDisplay[id] : "none";
    });

    document.querySelectorAll(".nav-links").forEach((li) => li.classList.remove("active"));
    const navLink = document.querySelector('.nav-links[data-page="' + pageId + '"]');
    if (navLink) navLink.classList.add("active");

    // Sidebar is only shown on the dashboard page
    if (sidebar) {
        sidebar.style.display = (pageId === "dashboard") ? "" : "none";
    }

    // Mobile browsers can pause a video when its container becomes display:none;
    // resume it whenever the dashboard (which hosts the quote video) is shown again.
    if (pageId === "dashboard") {
        const quoteVideo = document.getElementById("quote-video");
        if (quoteVideo) {
            const playPromise = quoteVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
        }
    }

    window.scrollTo(0, 0);
}

document.querySelectorAll("[data-page]").forEach((el) => {
    el.addEventListener("click", (e) => {
        e.preventDefault();
        showPage(el.getAttribute("data-page"));
    });
});

// Show the dashboard on first load
showPage("dashboard");

// ==========================================================================
// TO DO LIST
// ==========================================================================
(function(){

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    setupFilters();
});

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    if (taskText !== '') {
        const newTodo = { 
            id: Date.now(), 
            text: taskText, 
            completed: false 
        };
        todos.push(newTodo);
        saveAndRender();
        todoInput.value = '';
    }
});

todoList.addEventListener('click', (e) => {
    const target = e.target;
    const todoItem = target.closest('.todo-item');
    if (!todoItem) return;
    const id = parseInt(todoItem.dataset.id);

    if (target.classList.contains('todo-checkbox')) {
        todos = todos.map(todo => todo.id === id ? { ...todo, completed: target.checked } : todo);
        saveAndRender();
    }

    if (target.classList.contains('delete-btn')) {
        todos = todos.filter(todo => todo.id !== id);
        saveAndRender();
    }


    if (target.classList.contains('edit-btn')) {
        const todo = todos.find(t => t.id === id);
        if (target.innerText === "Edit") {
            renderEditMode(todoItem, todo);
        } else {
            const input = todoItem.querySelector('.edit-input');
            saveEdit(id, input.value);
        }
    }
});


function renderEditMode(element, todo) {
    const textSpan = element.querySelector('.todo-text');
    const editBtn = element.querySelector('.edit-btn');
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = todo.text;
    
    element.replaceChild(input, textSpan);
    editBtn.innerText = "Save";
    input.focus();

    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveEdit(todo.id, input.value);
    });
}


function saveEdit(id, newText) {
    if (newText.trim() !== "") {
        todos = todos.map(todo => todo.id === id ? { ...todo, text: newText.trim() } : todo);
        saveAndRender();
    }
}


function setupFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTodos();
        });
    });
}


function renderTodos() {
    todoList.innerHTML = '';
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `<li class="todo-item" style="border: none; justify-content: center; color: #aaa;">No tasks found</li>`;
        return;
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${todo.text}</span>
            <div class="actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}


function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

const backBtn = document.getElementById('backbutton-todo')

backBtn.addEventListener("click", () => {
    showPage('dashboard');
})
})();

// ==========================================================================
// DAILY PLANNER
// ==========================================================================
(function(){

(function () {
  'use strict';

  var root = document.querySelector('.daily-planner');
  if (!root) return;

  var STORAGE_PREFIX = 'dailyPlanner:';

  var scheduleBody = root.querySelector('.planner-table__body');
  var dateTextEl = root.querySelector('#plannerDateText');
  var heroDateEl = root.querySelector('.planner-hero__date');
  var prevBtn = root.querySelector('#plannerPrevDay');
  var nextBtn = root.querySelector('#plannerNextDay');
  var clearAllBtn = root.querySelector('.planner-clear-btn');
  var rows = Array.prototype.slice.call(root.querySelectorAll('.planner-row'));
  var statTotalEl = root.querySelector('#plannerStatTotal');
  var statCompletedEl = root.querySelector('#plannerStatCompleted');
  var statPendingEl = root.querySelector('#plannerStatPending');

  var currentDate = new Date(2025, 6, 6);

  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function formatDisplayDate(date) {
    return DAY_NAMES[date.getDay()] + ', ' + date.getDate() + ' ' + MONTH_NAMES[date.getMonth()] + ' ' + date.getFullYear();
  }

  function pad(value) {
    return value < 10 ? '0' + value : String(value);
  }

  function dateKey(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  }

  function storageKey(date, slotId) {
    return STORAGE_PREFIX + dateKey(date) + ':' + slotId;
  }

  function doneKey(date, slotId) {
    return STORAGE_PREFIX + dateKey(date) + ':' + slotId + ':done';
  }

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (err) {
    }
  }

  function removeStorage(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
    }
  }

  function updateDateDisplay() {
    var label = formatDisplayDate(currentDate);
    if (dateTextEl) dateTextEl.textContent = label;
    if (heroDateEl) heroDateEl.textContent = label;
  }

  function loadDayIntoForm() {
    rows.forEach(function (row) {
      var textarea = row.querySelector('.planner-row__textarea');
      var checkbox = row.querySelector('.planner-row__done');
      if (!textarea) return;

      var saved = readStorage(storageKey(currentDate, textarea.id));
      textarea.value = saved !== null ? saved : '';

      if (checkbox) {
        checkbox.checked = readStorage(doneKey(currentDate, textarea.id)) === '1';
      }

      applyRowDoneClass(row);
    });
    updateStats();
  }

  function applyRowDoneClass(row) {
    var checkbox = row.querySelector('.planner-row__done');
    if (checkbox && checkbox.checked) {
      row.classList.add('planner-row--done');
    } else {
      row.classList.remove('planner-row--done');
    }
  }

  function updateStats() {
    var total = 0;
    var completed = 0;

    rows.forEach(function (row) {
      var textarea = row.querySelector('.planner-row__textarea');
      var checkbox = row.querySelector('.planner-row__done');
      if (!textarea || textarea.value.trim() === '') return;

      total += 1;
      if (checkbox && checkbox.checked) completed += 1;
    });

    if (statTotalEl) statTotalEl.textContent = String(total);
    if (statCompletedEl) statCompletedEl.textContent = String(completed);
    if (statPendingEl) statPendingEl.textContent = String(total - completed);
  }

  function saveSlot(textarea) {
    writeStorage(storageKey(currentDate, textarea.id), textarea.value);
    updateStats();
  }

  function clearSlot(textarea) {
    textarea.value = '';
    removeStorage(storageKey(currentDate, textarea.id));

    var row = textarea.closest('.planner-row');
    var checkbox = row && row.querySelector('.planner-row__done');
    if (checkbox) {
      checkbox.checked = false;
      removeStorage(doneKey(currentDate, textarea.id));
      applyRowDoneClass(row);
    }
    updateStats();
  }

  function pulse(button) {
    button.style.transform = 'scale(0.92)';
    window.setTimeout(function () {
      button.style.transform = '';
    }, 120);
  }

  if (scheduleBody) {
    scheduleBody.addEventListener('click', function (event) {
      var saveBtn = event.target.closest('.planner-btn--save');
      var clearBtn = event.target.closest('.planner-btn--clear');
      if (!saveBtn && !clearBtn) return;

      var row = event.target.closest('.planner-row');
      var textarea = row && row.querySelector('.planner-row__textarea');
      if (!textarea) return;

      if (saveBtn) {
        saveSlot(textarea);
        pulse(saveBtn);
      } else {
        clearSlot(textarea);
        pulse(clearBtn);
      }
    });

    scheduleBody.addEventListener(
      'focusout',
      function (event) {
        var target = event.target;
        if (target && target.classList && target.classList.contains('planner-row__textarea')) {
          saveSlot(target);
        }
      },
      true
    );

    scheduleBody.addEventListener('input', function (event) {
      if (event.target.classList && event.target.classList.contains('planner-row__textarea')) {
        updateStats();
      }
    });

    scheduleBody.addEventListener('change', function (event) {
      var checkbox = event.target;
      if (!checkbox.classList || !checkbox.classList.contains('planner-row__done')) return;

      var row = checkbox.closest('.planner-row');
      var textarea = row && row.querySelector('.planner-row__textarea');
      if (!textarea) return;

      if (checkbox.checked) {
        writeStorage(doneKey(currentDate, textarea.id), '1');
      } else {
        removeStorage(doneKey(currentDate, textarea.id));
      }

      applyRowDoneClass(row);
      updateStats();
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', function () {
      var ok = window.confirm('Clear every note for ' + formatDisplayDate(currentDate) + '?');
      if (!ok) return;
      rows.forEach(function (row) {
        var textarea = row.querySelector('.planner-row__textarea');
        if (textarea) clearSlot(textarea);
      });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      currentDate.setDate(currentDate.getDate() - 1);
      updateDateDisplay();
      loadDayIntoForm();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      currentDate.setDate(currentDate.getDate() + 1);
      updateDateDisplay();
      loadDayIntoForm();
    });
  }


  updateDateDisplay();
  loadDayIntoForm();
})();

const backBtn = document.getElementById('backbutton-planner')

backBtn.addEventListener("click", () => {
    showPage('dashboard');
})
})();

// ==========================================================================
// DAILY GOALS
// ==========================================================================
(function(){
(function () {
  const STORAGE_KEY = 'dg_goals_v1';

  const listEl = document.getElementById('dgGoalsList');
  const emptyStateEl = document.getElementById('dgEmptyState');
  const inputEl = document.getElementById('dgInput');
  const addBtn = document.getElementById('dgAddBtn');
  const ringFill = document.getElementById('dgRingFill');
  const ringLabel = document.getElementById('dgRingLabel');
  const progressBar = document.getElementById('dgProgressBar');
  const progressCaption = document.getElementById('dgProgressCaption');
  const statCompleted = document.getElementById('dgStatCompleted');
  const statPending = document.getElementById('dgStatPending');
  const statRate = document.getElementById('dgStatRate');

  const RING_CIRCUMFERENCE = 2 * Math.PI * 52;

  const defaultGoals = [
    { id: cryptoRandomId(), text: 'Morning workout for 30 minutes', completed: true },
    { id: cryptoRandomId(), text: 'Read 20 pages of a book', completed: true },
    { id: cryptoRandomId(), text: 'Work on personal project for 1 hour', completed: false },
    { id: cryptoRandomId(), text: 'Learn something new', completed: false },
    { id: cryptoRandomId(), text: "Plan tomorrow's schedule", completed: false }
  ];

  function cryptoRandomId() {
    return 'g_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function loadGoals() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultGoals;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return defaultGoals;
    } catch (e) {
      return defaultGoals;
    }
  }

  function saveGoals() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (e) {}
  }

  let goals = loadGoals();

  function render() {
    listEl.innerHTML = '';

    if (goals.length === 0) {
      emptyStateEl.classList.add('dg-visible');
    } else {
      emptyStateEl.classList.remove('dg-visible');
    }

    goals.forEach((goal) => {
      const li = document.createElement('li');
      li.className = 'dg-goal-card' + (goal.completed ? ' dg-completed' : '');
      li.dataset.id = goal.id;

      li.innerHTML =
        '<button class="dg-checkbox" data-action="toggle" aria-label="Toggle goal completion" aria-pressed="' + goal.completed + '">' +
          '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M5 13L9.5 17.5L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
        '</button>' +
        '<span class="dg-goal-text"></span>' +
        '<button class="dg-delete-btn" data-action="delete" aria-label="Delete goal">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M4 7H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
            '<path d="M9 7V4.8C9 4.35817 9.35817 4 9.8 4H14.2C14.6418 4 15 4.35817 15 4.8V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M6 7L6.9 19.2C6.94 19.87 7.5 20.4 8.17 20.4H15.83C16.5 20.4 17.06 19.87 17.1 19.2L18 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
        '</button>';

      li.querySelector('.dg-goal-text').textContent = goal.text;
      listEl.appendChild(li);
    });

    updateStats();
  }

  function updateStats() {
    const total = goals.length;
    const completed = goals.filter((g) => g.completed).length;
    const pending = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    ringLabel.textContent = percent + '%';
    const offset = RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE;
    ringFill.style.strokeDashoffset = offset;

    progressBar.style.width = percent + '%';
    progressCaption.textContent = completed + ' of ' + total + ' goals completed';

    statCompleted.textContent = completed;
    statPending.textContent = pending;
    statRate.textContent = percent + '%';
  }

  function addGoal() {
    const text = inputEl.value.trim();
    if (!text) {
      inputEl.focus();
      return;
    }
    goals.push({ id: cryptoRandomId(), text: text, completed: false });
    inputEl.value = '';
    saveGoals();
    render();
    inputEl.focus();
  }

  function toggleGoal(id) {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    goal.completed = !goal.completed;
    saveGoals();
    render();
  }

  function deleteGoal(id) {
    const card = listEl.querySelector('[data-id="' + id + '"]');
    if (!card) {
      goals = goals.filter((g) => g.id !== id);
      saveGoals();
      render();
      return;
    }
    card.classList.add('dg-removing');
    card.addEventListener('animationend', () => {
      goals = goals.filter((g) => g.id !== id);
      saveGoals();
      render();
    }, { once: true });
  }

  addBtn.addEventListener('click', addGoal);

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addGoal();
    }
  });

  listEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const card = e.target.closest('.dg-goal-card');
    if (!card) return;
    const id = card.dataset.id;

    if (btn.dataset.action === 'toggle') {
      toggleGoal(id);
    } else if (btn.dataset.action === 'delete') {
      deleteGoal(id);
    }
  });

  render();
})();

const backBtn = document.getElementById('backbutton-goals')

backBtn.addEventListener("click", () => {
    showPage('dashboard');
})
})();

// ==========================================================================
// POMODORO TIMER
// ==========================================================================
(function(){
(() => {
  const componentRoot = document.querySelector('.pomodoro-component');
  if (!componentRoot) return;

  const cardElement = componentRoot.querySelector('.timer-card');
  const countdownText = componentRoot.querySelector('.time-countdown');
  const statusMessage = componentRoot.querySelector('.timer-status-message');
  const badgeText = componentRoot.querySelector('.badge-text');
  const badgeContainer = componentRoot.querySelector('.session-badge');
  const progressCircle = componentRoot.querySelector('.progress-ring__circle');
  
  const startButton = componentRoot.querySelector('.start-btn');
  const pauseButton = componentRoot.querySelector('.pause-btn');
  const resetButton = componentRoot.querySelector('.reset-btn');
  
  const sessionsCountDisplay = componentRoot.querySelector('.total-sessions-value');
  const focusTimeDisplay = componentRoot.querySelector('.total-focus-value');
  const toastContainer = componentRoot.querySelector('.pomodoro-toast');

  const WORK_DURATION = 25 * 60;
  const BREAK_DURATION = 5 * 60;
  
  let currentTotalDuration = WORK_DURATION;
  let timeRemaining = WORK_DURATION;
  let countdownIntervalId = null;
  let isCurrentSessionWork = true;
  
  let completedSessionsCounter = 0;
  let accumulatedSecondsFocused = 0;

  const radius = progressCircle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  
  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  progressCircle.style.strokeDashoffset = 0;

  function updateTimerUIDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    countdownText.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    calculateProgressRingStrokeOffset();
  }

  function calculateProgressRingStrokeOffset() {
    const fractionElapsed = (currentTotalDuration - timeRemaining) / currentTotalDuration;
    progressCircle.style.strokeDashoffset = circumference * fractionElapsed;
  }

  function syncSessionStateIndicatorStyles() {
    if (isCurrentSessionWork) {
      cardElement.classList.remove('on-break');
      badgeContainer.setAttribute('data-status', 'work');
      badgeText.textContent = 'WORK SESSION';
      statusMessage.textContent = 'Stay focused!';
    } else {
      cardElement.classList.add('on-break');
      badgeContainer.setAttribute('data-status', 'break');
      badgeText.textContent = 'BREAK TIME';
      statusMessage.textContent = 'Time to recharge.';
    }
  }

  function executionCycleTick() {
    if (timeRemaining > 0) {
      timeRemaining--;
      
      if (isCurrentSessionWork) {
        accumulatedSecondsFocused++;
        updateAnalyticsDashboardDisplays();
      }
      
      updateTimerUIDisplay();
    } else {
      handleCurrentSessionCompletionCycle();
    }
  }

  function handleCurrentSessionCompletionCycle() {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
    
    if (isCurrentSessionWork) {
      completedSessionsCounter++;
      showToastNotification('✔ Work session completed!');
      isCurrentSessionWork = false;
      currentTotalDuration = BREAK_DURATION;
      timeRemaining = BREAK_DURATION;
    } else {
      showToastNotification('🎯 Break over! Time to focus.');
      isCurrentSessionWork = true;
      currentTotalDuration = WORK_DURATION;
      timeRemaining = WORK_DURATION;
    }
    
    startButton.disabled = false;
    updateAnalyticsDashboardDisplays();
    syncSessionStateIndicatorStyles();
    updateTimerUIDisplay();
  }

  function updateAnalyticsDashboardDisplays() {
    sessionsCountDisplay.textContent = `${completedSessionsCounter} ${completedSessionsCounter === 1 ? 'session' : 'sessions'}`;
    
    const focusMinutesTotal = Math.floor(accumulatedSecondsFocused / 60);
    focusTimeDisplay.textContent = `${focusMinutesTotal}m`;
  }

  function showToastNotification(notificationMessage) {
    toastContainer.textContent = notificationMessage;
    toastContainer.style.transform = 'translateX(-50%) translateY(0)';
    toastContainer.style.opacity = '1';
    
    setTimeout(() => {
      toastContainer.style.transform = 'translateX(-50%) translateY(100px)';
      toastContainer.style.opacity = '0';
    }, 3000);
  }

  function startTimerController() {
    if (countdownIntervalId !== null) return;
    countdownIntervalId = setInterval(executionCycleTick, 1000);
    startButton.disabled = true;
    statusMessage.textContent = isCurrentSessionWork ? 'Deep work in progress...' : 'Enjoy your break!';
  }

  function pauseTimerController() {
    if (countdownIntervalId === null) return;
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
    startButton.disabled = false;
    statusMessage.textContent = 'Timer paused';
  }

  function resetTimerController() {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
    isCurrentSessionWork = true;
    currentTotalDuration = WORK_DURATION;
    timeRemaining = WORK_DURATION;
    startButton.disabled = false;
    syncSessionStateIndicatorStyles();
    updateTimerUIDisplay();
  }

  startButton.addEventListener('click', startTimerController);
  pauseButton.addEventListener('click', pauseTimerController);
  resetButton.addEventListener('click', resetTimerController);

  updateAnalyticsDashboardDisplays();
  updateTimerUIDisplay();
})();

const backBtn = document.getElementById('backbutton-pomodoro')

backBtn.addEventListener("click", () => {
    showPage('dashboard');
})
})();

// ==========================================================================
// DAILY QUOTE
// ==========================================================================
(function(){
let quoteContainer = document.getElementById('page-quote')
let quoteText = quoteContainer.querySelector(".quote")
let authorText = quoteContainer.querySelector("#author")
let newQuoteBtn = quoteContainer.querySelectorAll("button")[1]
let backBtn = quoteContainer.querySelectorAll("button")[0]

newQuoteBtn.addEventListener("click", () => {
    fetch("https://dummyjson.com/quotes/random")
    .then(res => res.json())
    .then(result => {
        quoteText.innerText = result.quote;
        authorText.innerText = result.author;
    })
    .catch(err => {
        console.log("Error aya:", err);
    })
})

backBtn.addEventListener("click", () => {
    showPage('dashboard');
})
})();

// ==========================================================================
// WEATHER APP
// ==========================================================================
(function(){
const CITIES = {
	srinagar: { name: 'Srinagar', lat: 34.0816, lon: 74.8234 },
	dehli:   { name: 'Dehli',   lat: 28.6139, lon: 77.2090 },
	punjab:  { name: 'Punjab',  lat: 31.6341, lon: 74.8714 },
	ahmedabad: { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 }
};

let mainCityKey = 'srinagar';
let cardCityKeys = ['dehli', 'punjab', 'ahmedabad'];
const weatherCache = {};
let activeMetric = 'temperature';
let customCityCounter = 0;

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function describeWeatherCode(code) {
	if (code === 0) return { icon: 'fa-sun', label: 'SUNSHINE' };
	if (code === 1 || code === 2) return { icon: 'fa-cloud-sun', label: 'PARTLY CLOUDY' };
	if (code === 3) return { icon: 'fa-cloud', label: 'CLOUDY' };
	if (code === 45 || code === 48) return { icon: 'fa-smog', label: 'FOG' };
	if (code >= 51 && code <= 57) return { icon: 'fa-cloud-rain', label: 'DRIZZLE' };
	if (code >= 61 && code <= 65) return { icon: 'fa-cloud-showers-heavy', label: 'RAINSTORM' };
	if (code >= 66 && code <= 67) return { icon: 'fa-cloud-rain', label: 'FREEZING RAIN' };
	if (code >= 71 && code <= 77) return { icon: 'fa-snowflake', label: 'SNOW' };
	if (code >= 80 && code <= 82) return { icon: 'fa-cloud-showers-water', label: 'RAIN SHOWERS' };
	if (code >= 85 && code <= 86) return { icon: 'fa-snowflake', label: 'SNOW SHOWERS' };
	if (code >= 95) return { icon: 'fa-cloud-bolt', label: 'THUNDERSHOWER' };
	return { icon: 'fa-cloud', label: 'CLOUDY' };
}

function rainLabel(probability) {
	if (probability <= 20) return 'Excellent';
	if (probability <= 40) return 'Good';
	if (probability <= 60) return 'Fair';
	return 'Poor';
}

async function geocodeCity(query) {
	const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error('Geocoding request failed');
	}

	const data = await res.json();
	if (!data.results || data.results.length === 0) {
		return null;
	}

	const match = data.results[0];
	return {
		name: match.name,
		region: match.admin1 || match.country || '',
		lat: match.latitude,
		lon: match.longitude
	};
}

async function fetchCityWeather(cityKey) {
	const city = CITIES[cityKey];

	const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
		`&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
		`&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m` +
		`&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
		`&timezone=auto&forecast_days=6`;

	const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}` +
		`&current=us_aqi&hourly=us_aqi&timezone=auto`;

	const [forecastRes, airRes] = await Promise.all([
		fetch(forecastUrl),
		fetch(airUrl).catch(() => null) 
	]);

	if (!forecastRes.ok) {
		throw new Error('Forecast request failed for ' + city.name);
	}

	const forecast = await forecastRes.json();
	const air = airRes && airRes.ok ? await airRes.json() : null;

	const payload = { city: cityKey, forecast, air };
	weatherCache[cityKey] = payload;
	return payload;
}

function buildSmoothPath(values, width, height) {
	const paddingTop = 8;
	const paddingBottom = 12;
	const usableHeight = height - paddingTop - paddingBottom;

	const min = Math.min(...values);
	const max = Math.max(...values);
	const range = max - min || 1;

	const points = values.map((value, i) => {
		const x = (i / (values.length - 1)) * width;
		const normalized = (value - min) / range;
		const y = paddingTop + (1 - normalized) * usableHeight;
		return { x, y };
	});

	let d = `M ${points[0].x} ${points[0].y}`;

	for (let i = 0; i < points.length - 1; i++) {
		const p0 = points[i];
		const p1 = points[i + 1];
		const midX = (p0.x + p1.x) / 2;
		d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
	}

	let peakIndex = 0;
	for (let i = 1; i < values.length; i++) {
		if (values[i] > values[peakIndex]) peakIndex = i;
	}

	return { d, points, peakIndex };
}

function drawGraph(values, unit) {
	const svg = document.getElementById('graphSvg');
	const width = 220;
	const height = 70;

	const { d, points, peakIndex } = buildSmoothPath(values, width, height);

	document.getElementById('graphPath').setAttribute('d', d);

	const peak = points[peakIndex];
	document.getElementById('graphPoint').setAttribute('cx', peak.x);
	document.getElementById('graphPoint').setAttribute('cy', peak.y);

	const label = document.getElementById('graphLabel');
	label.textContent = `${Math.round(values[peakIndex])}${unit}`;
	const leftPercent = Math.min(80, Math.max(5, (peak.x / width) * 100));
	label.style.left = `${leftPercent}%`;

	document.getElementById('graphStart').textContent = `${Math.round(values[0])}${unit}`;
	document.getElementById('graphEnd').textContent = `${Math.round(values[values.length - 1])}${unit}`;
}

function sampleHourly(hourlyArray, count) {
	const day = hourlyArray.slice(0, 24);
	const step = (day.length - 1) / (count - 1);
	const samples = [];
	for (let i = 0; i < count; i++) {
		samples.push(day[Math.round(i * step)]);
	}
	return samples;
}

function renderGraphForMetric(metric) {
	const data = weatherCache[mainCityKey];
	if (!data) return;

	activeMetric = metric;

	const hourly = data.forecast.hourly;
	const airHourly = data.air ? data.air.hourly : null;

	let values, unit;

	if (metric === 'wind') {
		values = sampleHourly(hourly.wind_speed_10m, 12);
		unit = 'kh';
	} else if (metric === 'humidity') {
		values = sampleHourly(hourly.relative_humidity_2m, 12);
		unit = '%';
	} else if (metric === 'aqi' && airHourly) {
		values = sampleHourly(airHourly.us_aqi, 12);
		unit = '';
	} else {
		values = sampleHourly(hourly.temperature_2m, 12);
		unit = '\u00B0C';
	}

	drawGraph(values, unit);
}

function updateClock() {
	const now = new Date();
	const weekday = WEEKDAY_NAMES[now.getDay()];
	const month = MONTH_NAMES[now.getMonth()];
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');

	document.getElementById('currentDate').textContent =
		`${now.getDate()} ${month} , ${weekday} ${hours}:${minutes}`;
}

function renderMainCity(cityKey) {
	const data = weatherCache[cityKey];
	if (!data) return;

	mainCityKey = cityKey;

	const current = data.forecast.current;
	const daily = data.forecast.daily;
	const air = data.air ? data.air.current : null;
	const visual = describeWeatherCode(current.weather_code);

	document.getElementById('mainCityName').textContent = CITIES[cityKey].name;
	document.getElementById('mainTemp').textContent = Math.round(current.temperature_2m);
	document.getElementById('rainChance').textContent =
		`Chance of Rain: ${daily.precipitation_probability_max[0]}%`;

	const icon = document.getElementById('mainWeatherIcon');
	icon.className = `fa-solid ${visual.icon}`;

	document.getElementById('windValue').textContent = `${Math.round(current.wind_speed_10m)}km/h`;
	document.getElementById('humidityValue').textContent = `${Math.round(current.relative_humidity_2m)}%`;
	document.getElementById('aqiValue').textContent = air ? Math.round(air.us_aqi) : '--';

	renderGraphForMetric(activeMetric);
	renderForecast(daily);
}

function renderForecast(daily) {
	const cards = document.querySelectorAll('#forecastRow .forecast-card');

	for (let i = 0; i < cards.length; i++) {
		const dayIndex = i + 1;
		const card = cards[i];

		const dateString = daily.time[dayIndex];
		const date = new Date(dateString + 'T00:00:00');
		const visual = describeWeatherCode(daily.weather_code[dayIndex]);
		const probability = daily.precipitation_probability_max[dayIndex];

		card.querySelector('.forecast-day').textContent = WEEKDAY_NAMES[date.getDay()];
		card.querySelector('.forecast-date').textContent = `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
		card.querySelector('.weather-icon i').className = `fa-solid ${visual.icon}`;
		card.querySelector('.forecast-range').textContent =
			`${Math.round(daily.temperature_2m_min[dayIndex])}~${Math.round(daily.temperature_2m_max[dayIndex])}\u00B0C`;
		card.querySelector('.forecast-type').textContent = visual.label;
		card.querySelector('.forecast-wind').textContent = `Wind: <${Math.round(daily.wind_speed_10m_max[dayIndex])}km/h`;
		card.querySelector('.status-badge').textContent = `${probability} ${rainLabel(probability)}`;
	}
}

function renderCityCards() {
	const list = document.getElementById('cityList');
	list.innerHTML = '';

	cardCityKeys.forEach((cityKey, i) => {
		const data = weatherCache[cityKey];
		const city = CITIES[cityKey];
		const gradientClass = `city-gradient-${(i % 6) + 1}`;

		const card = document.createElement('article');
		card.className = `city-card ${gradientClass}`;
		card.dataset.city = cityKey;

		const visual = data ? describeWeatherCode(data.forecast.current.weather_code) : { icon: 'fa-cloud' };
		const temp = data ? `${Math.round(data.forecast.current.temperature_2m)}\u00B0C` : '--\u00B0C';

		card.innerHTML = `
			<i class="fa-solid ${visual.icon} city-icon"></i>
			<span class="city-card-name">${city.name}</span>
			<span class="city-card-temp">${temp}</span>
			<button class="city-card-remove" type="button" title="Remove city">
				<i class="fa-solid fa-xmark"></i>
			</button>
		`;

		card.addEventListener('click', () => handleCityCardClick(cityKey));

		card.querySelector('.city-card-remove').addEventListener('click', (event) => {
			event.stopPropagation();
			handleCityCardRemove(cityKey);
		});

		list.appendChild(card);
	});
}

async function handleCityCardClick(cityKey) {
	const outgoingCityKey = mainCityKey;
	const slotIndex = cardCityKeys.indexOf(cityKey);
	if (slotIndex === -1) return;

	cardCityKeys[slotIndex] = outgoingCityKey;

	if (!weatherCache[cityKey]) {
		await fetchCityWeather(cityKey);
	}

	renderMainCity(cityKey);
	renderCityCards();
}

function handleCityCardRemove(cityKey) {
	cardCityKeys = cardCityKeys.filter(key => key !== cityKey);

	if (cityKey.startsWith('custom-')) {
		delete CITIES[cityKey];
		delete weatherCache[cityKey];
	}

	renderCityCards();
}

function setAddCityMessage(text, type) {
	const message = document.getElementById('addCityMessage');
	message.textContent = text;
	message.className = 'add-city-message' + (type ? ` is-${type}` : '');
}

async function handleAddCity(event) {
	event.preventDefault();

	const input = document.getElementById('addCityInput');
	const button = document.getElementById('addCityButton');
	const query = input.value.trim();

	if (!query) return;

	button.disabled = true;
	setAddCityMessage('Searching\u2026', null);

	try {
		const match = await geocodeCity(query);

		if (!match) {
			setAddCityMessage(`Couldn't find "${query}". Try a different spelling.`, 'error');
			return;
		}

		customCityCounter += 1;
		const cityKey = `custom-${customCityCounter}`;

		CITIES[cityKey] = {
			name: match.region ? `${match.name}, ${match.region}` : match.name,
			lat: match.lat,
			lon: match.lon
		};

		await fetchCityWeather(cityKey);
		cardCityKeys.push(cityKey);
		renderCityCards();

		setAddCityMessage(`Added ${CITIES[cityKey].name}.`, 'success');
		input.value = '';
	} catch (error) {
		setAddCityMessage('Something went wrong reaching the weather service.', 'error');
		console.error(error);
	} finally {
		button.disabled = false;
	}
}

function setupNavButtons() {
	const buttons = document.querySelectorAll('#sidebarNav .nav-button');
	buttons.forEach(button => {
		button.addEventListener('click', () => {
			buttons.forEach(b => b.classList.remove('active'));
			button.classList.add('active');
			renderGraphForMetric(button.dataset.metric);
		});
	});
}

function setupAddCityForm() {
	document.getElementById('addCityForm').addEventListener('submit', handleAddCity);
}

function setupRefreshButton() {
	const button = document.getElementById('refreshButton');
	button.addEventListener('click', async () => {
		button.classList.add('spinning');
		await loadEverything();
		button.classList.remove('spinning');
	});
}

async function loadEverything() {
	const allKeys = [mainCityKey, ...cardCityKeys];

	try {
		await Promise.all(allKeys.map(fetchCityWeather));
		renderMainCity(mainCityKey);
		renderCityCards();
	} catch (error) {
		document.getElementById('mainCityName').textContent = 'Offline';
		document.getElementById('rainChance').textContent = 'Could not reach the weather service';
		console.error(error);
	}
}

updateClock();
setInterval(updateClock, 30 * 1000);

setupNavButtons();
setupAddCityForm();
setupRefreshButton();
loadEverything();

setInterval(loadEverything, 10 * 60 * 1000);


const backBtn = document.getElementById('backbutton-weather')

backBtn.addEventListener("click", () => {
    showPage('dashboard');
})
})();