// Theme Management
let isDarkTheme = localStorage.getItem('study-dark-theme') === 'true';
updateTheme();

function updateTheme() {
    document.body.classList.toggle('study-dark-theme', isDarkTheme);
    localStorage.setItem('study-dark-theme', isDarkTheme);
}

document.querySelector('.study-theme-toggle').addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    updateTheme();
});

// Page Navigation
const pages = {
    dashboard: `
        <div class="study-dashboard">
            <div class="study-stats-grid">
                <div class="study-stat-card">
                    <h3>Tempo de Estudo</h3>
                    <div id="study-timer">00:00:00</div>
                </div>
                <div class="study-stat-card">
                    <h3>Pomodoros Hoje</h3>
                    <div id="study-pomodoro-count">0</div>
                </div>
                <div class="study-stat-card">
                    <h3>Tarefas Pendentes</h3>
                    <div id="study-tasks-count">0</div>
                </div>
            </div>
            <div class="study-chart-container">
                <canvas id="study-progress-chart"></canvas>
            </div>
        </div>
    `,
    flashcards: `
        <div class="study-flashcards">
            <div class="study-controls">
                <button class="study-btn" onclick="createFlashcard()">Novo Flashcard</button>
                <select id="study-category">
                    <option value="all">Todas Categorias</option>
                    <option value="math">Matemática</option>
                    <option value="science">Ciências</option>
                    <option value="history">História</option>
                </select>
            </div>
            <div id="study-flashcards-container"></div>
        </div>
    `,
    pomodoro: `
        <div class="study-pomodoro">
            <div class="study-timer-display">
                <h2>Pomodoro Timer</h2>
                <div id="study-time-display">25:00</div>
                <div class="study-timer-controls">
                    <button onclick="startTimer()">Iniciar</button>
                    <button onclick="pauseTimer()">Pausar</button>
                    <button onclick="resetTimer()">Resetar</button>
                </div>
            </div>
            <div class="study-timer-settings">
                <label>Tempo de Trabalho: <input type="number" id="study-work-time" value="25" min="1"></label>
                <label>Tempo de Pausa: <input type="number" id="study-break-time" value="5" min="1"></label>
            </div>
        </div>
    `,
    notes: `
        <div class="study-notes">
            <div class="study-notes-list"></div>
            <div class="study-note-editor">
                <input type="text" id="study-note-title" placeholder="Título da Nota">
                <textarea id="study-note-content" placeholder="Conteúdo (suporta Markdown)"></textarea>
                <button onclick="saveNote()">Salvar</button>
            </div>
        </div>
    `,
    tasks: `
        <div class="study-tasks">
            <div class="study-task-input">
                <input type="text" id="study-task-title" placeholder="Nova Tarefa">
                <select id="study-task-priority">
                    <option value="1">Alta</option>
                    <option value="2">Média</option>
                    <option value="3">Baixa</option>
                </select>
                <button onclick="addTask()">Adicionar</button>
            </div>
            <div id="study-task-list"></div>
        </div>
    `,
    stats: `
        <div class="study-statistics">
            <div class="study-stats-header">
                <h2>Estatísticas de Estudo</h2>
                <select id="study-stats-period">
                    <option value="week">Esta Semana</option>
                    <option value="month">Este Mês</option>
                    <option value="year">Este Ano</option>
                </select>
            </div>
            <canvas id="study-stats-chart"></canvas>
        </div>
    `
};

// Page Navigation Handler
document.querySelectorAll('.study-menu li').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.study-menu li').forEach(i => i.classList.remove('study-active'));
        item.classList.add('study-active');
        loadPage(item.dataset.page);
    });
});

function loadPage(pageName) {
    const main = document.querySelector('.study-main');
    main.innerHTML = pages[pageName] || 'Page not found';
    initializePage(pageName);
}

// Initialize page-specific features
function initializePage(pageName) {
    switch(pageName) {
        case 'dashboard':
            initializeDashboard();
            break;
        case 'flashcards':
            loadFlashcards();
            break;
        case 'pomodoro':
            initializePomodoro();
            break;
        case 'notes':
            loadNotes();
            break;
        case 'tasks':
            loadTasks();
            break;
        case 'stats':
            loadStatistics();
            break;
    }
}

// Load initial page
loadPage('dashboard');

// API Functions
async function fetchApi(endpoint, options = {}) {
    try {
        const response = await fetch(`/api/${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        if (!response.ok) throw new Error('API request failed');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// Initialize features (to be implemented)
function initializeDashboard() {
    // TODO: Implement dashboard initialization
}

function loadFlashcards() {
    // TODO: Implement flashcards loading
}

function initializePomodoro() {
    // TODO: Implement pomodoro timer
}

function loadNotes() {
    // TODO: Implement notes loading
}

function loadTasks() {
    // TODO: Implement tasks loading
}

function loadStatistics() {
    // TODO: Implement statistics loading
}
// Sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.study-nav');
    const navToggle = document.querySelector('.study-nav-toggle');
    const toggleIcon = navToggle.textContent;

    // Load saved state
    const isCollapsed = localStorage.getItem('study-nav-collapsed') === 'true';
    if (isCollapsed) {
        nav.classList.add('collapsed');
        navToggle.textContent = '▶';
    }

    navToggle.addEventListener('click', () => {
        nav.classList.toggle('collapsed');
        const isNowCollapsed = nav.classList.contains('collapsed');
        navToggle.textContent = isNowCollapsed ? '▶' : '◀';
        localStorage.setItem('study-nav-collapsed', isNowCollapsed);
    });

    // Page navigation
    document.querySelectorAll('.study-menu li').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.study-menu li').forEach(i => 
                i.classList.remove('study-active'));
            item.classList.add('study-active');
            loadPage(item.dataset.page);
        });
    });
});

// Add mobile support
if (window.innerWidth <= 768) {
    const nav = document.querySelector('.study-nav');
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !nav.classList.contains('collapsed')) {
            nav.classList.add('collapsed');
            navToggle.textContent = '▶';
        }
    });
}
// Theme toggle functionality
const themeToggle = document.querySelector('.study-theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('study-dark-theme');
    const isDark = document.body.classList.contains('study-dark-theme');
    themeToggle.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('study-theme', isDark ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('study-theme') === 'dark') {
    document.body.classList.add('study-dark-theme');
    themeToggle.setAttribute('data-theme', 'dark');
}
// Core Classes
class StudyTimer {
    constructor() {
        this.seconds = 0;
        this.interval = null;
        this.loadSavedTime();
        this.startTimer();
    }

    loadSavedTime() {
        this.seconds = parseInt(localStorage.getItem('study-time') || '0');
        this.updateDisplay();
    }

    startTimer() {
        this.interval = setInterval(() => {
            this.seconds++;
            this.updateDisplay();
            localStorage.setItem('study-time', this.seconds);
        }, 1000);
    }

    updateDisplay() {
        const hours = Math.floor(this.seconds / 3600);
        const minutes = Math.floor((this.seconds % 3600) / 60);
        const secs = this.seconds % 60;
        const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        document.getElementById('study-timer').textContent = display;
    }
}

class PomodoroTimer {
    constructor() {
        this.minutes = 25;
        this.seconds = 0;
        this.isRunning = false;
        this.isBreak = false;
        this.interval = null;
        this.pomodoroCount = parseInt(localStorage.getItem('pomodoro-count') || '0');
        this.updateDisplay();
        this.updatePomodoroCount();
    }

    start() {
        if (!this.isRunning) {
            this.interval = setInterval(() => this.tick(), 1000);
            this.isRunning = true;
        }
    }

    pause() {
        clearInterval(this.interval);
        this.isRunning = false;
    }

    reset() {
        this.pause();
        this.minutes = 25;
        this.seconds = 0;
        this.isBreak = false;
        this.updateDisplay();
    }

    tick() {
        if (this.seconds === 0) {
            if (this.minutes === 0) {
                this.completeCycle();
            } else {
                this.minutes--;
                this.seconds = 59;
            }
        } else {
            this.seconds--;
        }
        this.updateDisplay();
    }

    completeCycle() {
        if (!this.isBreak) {
            this.pomodoroCount++;
            localStorage.setItem('pomodoro-count', this.pomodoroCount);
            this.updatePomodoroCount();
            this.minutes = 5; // Break time
        } else {
            this.minutes = 25; // Work time
        }
        this.seconds = 0;
        this.isBreak = !this.isBreak;
        this.updateDisplay();
    }

    updateDisplay() {
        const display = `${String(this.minutes).padStart(2, '0')}:${String(this.seconds).padStart(2, '0')}`;
        document.getElementById('study-time-display').textContent = display;
    }

    updatePomodoroCount() {
        document.getElementById('study-pomodoro-count').textContent = this.pomodoroCount;
    }
}

class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('study-tasks') || '[]');
        this.updateDisplay();
        this.updateCount();
    }

    addTask(title, priority) {
        this.tasks.push({ title, priority, completed: false });
        this.save();
    }

    save() {
        localStorage.setItem('study-tasks', JSON.stringify(this.tasks));
        this.updateDisplay();
        this.updateCount();
    }

    updateDisplay() {
        const container = document.getElementById('study-task-list');
        if (container) {
            container.innerHTML = this.tasks.map((task, index) => `
                <div class="study-task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} 
                           onchange="taskManager.toggleTask(${index})">
                    <span>${task.title}</span>
                    <button onclick="taskManager.deleteTask(${index})">🗑️</button>
                </div>
            `).join('');
        }
    }

    updateCount() {
        const pendingCount = this.tasks.filter(t => !t.completed).length;
        document.getElementById('study-tasks-count').textContent = pendingCount;
    }

    toggleTask(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.save();
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.save();
    }
}

// Initialize features
let studyTimer;
let pomodoroTimer;
let taskManager;

document.addEventListener('DOMContentLoaded', () => {
    studyTimer = new StudyTimer();
    pomodoroTimer = new PomodoroTimer();
    taskManager = new TaskManager();
});

// Event handlers
function startTimer() {
    pomodoroTimer.start();
}

function pauseTimer() {
    pomodoroTimer.pause();
}

function resetTimer() {
    pomodoroTimer.reset();
}

function addTask() {
    const title = document.getElementById('study-task-title').value;
    const priority = document.getElementById('study-task-priority').value;
    if (title) {
        taskManager.addTask(title, priority);
        document.getElementById('study-task-title').value = '';
    }
}

// Initialize dashboard stats
function initializeDashboard() {
    const ctx = document.getElementById('study-progress-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Horas Estudadas',
                data: [2, 4, 3, 5, 4, 6, 3],
                borderColor: '#2ecc71',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}