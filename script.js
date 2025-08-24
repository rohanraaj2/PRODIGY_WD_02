class Stopwatch {
    // Add a variable to track remaining countdown time
    remainingCountdown = null;
    constructor() {
        // Time tracking variables
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.lapCount = 0;
        this.lapTimes = [];
        this.splitTimes = [];
        
        // DOM elements
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.millisecondsElement = document.getElementById('milliseconds');
        
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.clearLapsBtn = document.getElementById('clearLapsBtn');
        this.shareBtn = document.getElementById('shareBtn');
        
        this.lapContainer = document.getElementById('lapContainer');
        
        // Initialize event listeners
        this.initEventListeners();
        this.loadLapsFromStorage();
    }
    
    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        this.clearLapsBtn.addEventListener('click', () => this.clearLaps());
        this.shareBtn.addEventListener('click', () => this.shareLaps());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.isRunning) {
                    this.pause();
                } else {
                    this.start();
                }
            } else if (e.code === 'KeyR' && e.ctrlKey) {
                e.preventDefault();
                this.reset();
            } else if (e.code === 'KeyL' && this.isRunning) {
                e.preventDefault();
                this.recordLap();
            }
        });
    }
    
    start() {
        if (!this.isRunning) {
            const countdownInput = document.getElementById('countdownInput');
            const stopwatchModeBtn = document.getElementById('stopwatchModeBtn');
            const countdownModeBtn = document.getElementById('countdownModeBtn');
            let mode = 'stopwatch';
            if (countdownModeBtn && countdownModeBtn.classList.contains('active')) {
                mode = 'countdown';
            }
            if (mode === 'countdown') {
                // If resuming from pause, use remainingCountdown
                if (this.remainingCountdown !== null) {
                    this.elapsedTime = this.remainingCountdown;
                } else {
                    let seconds = parseInt(countdownInput.value, 10);
                    if (isNaN(seconds) || seconds <= 0) {
                        alert('Enter a valid countdown time in seconds.');
                        return;
                    }
                    this.elapsedTime = seconds * 1000;
                }
                this.startTime = Date.now();
                this.timerInterval = setInterval(() => this.updateDisplay(), 10);
                this.isRunning = true;
                this.remainingCountdown = null;
            } else {
                this.startTime = Date.now() - this.elapsedTime;
                this.timerInterval = setInterval(() => this.updateDisplay(), 10);
                this.isRunning = true;
            }
            // Update button states
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.lapBtn.disabled = false;
            // Update button text
            this.startBtn.textContent = 'Running...';
            this.pauseBtn.textContent = 'Pause';
            playSound('start');
        }
    }
    
    pause() {
        if (this.isRunning) {
            const stopwatchModeBtn = document.getElementById('stopwatchModeBtn');
            const countdownModeBtn = document.getElementById('countdownModeBtn');
            let mode = 'stopwatch';
            if (countdownModeBtn && countdownModeBtn.classList.contains('active')) {
                mode = 'countdown';
            }
            if (mode === 'countdown') {
                // Store remaining time for resume
                const now = Date.now();
                this.remainingCountdown = this.elapsedTime - (now - this.startTime);
            }
            clearInterval(this.timerInterval);
            this.isRunning = false;
            // Update button states
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.lapBtn.disabled = true;
            // Update button text
            this.startBtn.textContent = 'Resume';
            this.pauseBtn.textContent = 'Paused';
            playSound('pause');
        }
    }
    
    reset() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.isRunning = false;
        this.elapsedTime = 0;
        this.startTime = 0;
        this.remainingCountdown = null;
        // Always reset display
        this.minutesElement.textContent = '00';
        this.secondsElement.textContent = '00';
        this.millisecondsElement.textContent = '00';
        // Always clear countdown input
        const countdownInput = document.getElementById('countdownInput');
        if (countdownInput) countdownInput.value = '';
        // Update button states
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.lapBtn.disabled = true;
        // Update button text
        this.startBtn.textContent = 'Start';
        this.pauseBtn.textContent = 'Pause';
        // Clear all laps
        this.clearLaps();
        // Force analogue clock SVG to reset
        const svgClockContainer = document.getElementById('svgClockContainer');
        if (svgClockContainer) {
            svgClockContainer.innerHTML = `
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#3498db" stroke-width="8" fill="none" opacity="0.2" />
                    <circle cx="50" cy="50" r="40" stroke="#27ae60" stroke-width="8" fill="none" stroke-dasharray="${2 * Math.PI * 40}" stroke-dashoffset="${2 * Math.PI * 40}" />
                    <text x="50" y="55" text-anchor="middle" font-size="18" fill="#333">00:00</text>
                </svg>
            `;
        }
        playSound('reset');
    }
    
    updateDisplay() {
        const stopwatchModeBtn = document.getElementById('stopwatchModeBtn');
        const countdownModeBtn = document.getElementById('countdownModeBtn');
        let mode = 'stopwatch';
        if (countdownModeBtn && countdownModeBtn.classList.contains('active')) {
            mode = 'countdown';
        }
        if (this.isRunning) {
            if (mode === 'countdown') {
                // Countdown mode
                const now = Date.now();
                const remaining = this.elapsedTime - (now - this.startTime);
                if (remaining <= 0) {
                    clearInterval(this.timerInterval);
                    this.isRunning = false;
                    this.elapsedTime = 0;
                    this.minutesElement.textContent = '00';
                    this.secondsElement.textContent = '00';
                    this.millisecondsElement.textContent = '00';
                    this.startBtn.disabled = false;
                    this.pauseBtn.disabled = true;
                    this.lapBtn.disabled = true;
                    this.startBtn.textContent = 'Start';
                    this.pauseBtn.textContent = 'Pause';
                    playSound('reset');
                    return;
                } else {
                    const time = this.formatTime(remaining);
                    this.minutesElement.textContent = time.minutes;
                    this.secondsElement.textContent = time.seconds;
                    this.millisecondsElement.textContent = time.milliseconds;
                }
            } else {
                // Stopwatch mode
                this.elapsedTime = Date.now() - this.startTime;
                const time = this.formatTime(this.elapsedTime);
                this.minutesElement.textContent = time.minutes;
                this.secondsElement.textContent = time.seconds;
                this.millisecondsElement.textContent = time.milliseconds;
            }
        }
    }
    
    formatTime(totalMilliseconds) {
        const minutes = Math.floor(totalMilliseconds / 60000);
        const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
        const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);
        
        return {
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            milliseconds: milliseconds.toString().padStart(2, '0')
        };
    }
    
    recordLap() {
        if (this.isRunning) {
            this.lapCount++;
            const stopwatchModeBtn = document.getElementById('stopwatchModeBtn');
            const countdownModeBtn = document.getElementById('countdownModeBtn');
            let mode = 'stopwatch';
            if (countdownModeBtn && countdownModeBtn.classList.contains('active')) {
                mode = 'countdown';
            }
            let lapTime, lapTimeString, split, splitString;
            if (mode === 'countdown') {
                // In countdown, lap is remaining time
                const now = Date.now();
                lapTime = Math.max(this.elapsedTime - (now - this.startTime), 0);
                const formattedTime = this.formatTime(lapTime);
                lapTimeString = `${formattedTime.minutes}:${formattedTime.seconds}:${formattedTime.milliseconds}`;
                if (this.lapTimes.length > 0) {
                    split = this.lapTimes[this.lapTimes.length - 1] - lapTime;
                } else {
                    split = 0;
                }
                // Split is previous remaining minus current remaining (time between laps)
                const splitFormatted = this.formatTime(split);
                splitString = `${splitFormatted.minutes}:${splitFormatted.seconds}:${splitFormatted.milliseconds}`;
            } else {
                // Stopwatch mode
                lapTime = this.elapsedTime;
                const formattedTime = this.formatTime(lapTime);
                lapTimeString = `${formattedTime.minutes}:${formattedTime.seconds}:${formattedTime.milliseconds}`;
                split = lapTime;
                if (this.lapTimes.length > 0) {
                    split = lapTime - this.lapTimes[this.lapTimes.length - 1];
                }
                const splitFormatted = this.formatTime(split);
                splitString = `${splitFormatted.minutes}:${splitFormatted.seconds}:${splitFormatted.milliseconds}`;
            }
            this.lapTimes.push(lapTime);
            this.splitTimes.push(split);
            this.addLapToDisplay(this.lapCount, lapTimeString, splitString);
            this.saveLapsToStorage();
            playSound('lap');
            // Show clear laps button if not visible
            if (this.clearLapsBtn.style.display === 'none') {
                this.clearLapsBtn.style.display = 'block';
            }
            this.shareBtn.style.display = 'inline-block';
        }
    }
    
    addLapToDisplay(lapNumber, timeString, splitString) {
        // Remove "no laps" message if it exists
        const noLapsMessage = this.lapContainer.querySelector('.no-laps');
        if (noLapsMessage) {
            noLapsMessage.remove();
        }
        // Create lap element
        const lapElement = document.createElement('div');
        lapElement.className = 'lap-time new';
        lapElement.innerHTML = `
            <span class="lap-number">Lap ${lapNumber}</span>
            <span class="lap-value">${timeString}</span>
            <span class="split-value" style="color:#888; font-size:0.9em; margin-left:10px;">Split: ${splitString}</span>
        `;
        // Insert at the top of the container
        this.lapContainer.insertBefore(lapElement, this.lapContainer.firstChild);
        setTimeout(() => {
            lapElement.classList.remove('new');
        }, 300);
        this.lapContainer.scrollTop = 0;
    }
    
    clearLaps() {
        this.lapContainer.innerHTML = '<p class="no-laps">No lap times recorded</p>';
        this.lapCount = 0;
        this.lapTimes = [];
        this.splitTimes = [];
        this.saveLapsToStorage();
        this.clearLapsBtn.style.display = 'none';
        this.shareBtn.style.display = 'none';
    }
    
    // Utility method to get current elapsed time in a formatted string
    getCurrentTime() {
        const time = this.formatTime(this.elapsedTime);
        return `${time.minutes}:${time.seconds}:${time.milliseconds}`;
    }
    
    // Method to export lap times as an array
    exportLapTimes() {
        const lapTimes = [];
        const lapElements = this.lapContainer.querySelectorAll('.lap-time');
        lapElements.forEach(lapElement => {
            const lapNumber = lapElement.querySelector('.lap-number').textContent;
            const lapValue = lapElement.querySelector('.lap-value').textContent;
            const splitValue = lapElement.querySelector('.split-value').textContent;
            lapTimes.push({ lap: lapNumber, time: lapValue, split: splitValue });
        });
        return lapTimes.reverse(); // Return in chronological order
    }

    // Save laps to localStorage
    saveLapsToStorage() {
        const laps = this.exportLapTimes();
        localStorage.setItem('stopwatchLaps', JSON.stringify(laps));
    }

    // Load laps from localStorage
    loadLapsFromStorage() {
        const laps = JSON.parse(localStorage.getItem('stopwatchLaps') || '[]');
        if (laps.length > 0) {
            this.lapCount = 0;
            laps.forEach(lap => {
                this.lapCount++;
                this.addLapToDisplay(this.lapCount, lap.time, lap.split.replace('Split: ',''));
            });
            this.clearLapsBtn.style.display = 'block';
            this.shareBtn.style.display = 'inline-block';
        }
    }

    // Share lap times (clipboard)
    shareLaps() {
        const laps = this.exportLapTimes();
        if (laps.length === 0) {
            alert('No lap times to share');
            return;
        }
        let text = 'Lap Number,Time,Split\n';
        laps.forEach(lap => {
            text += `${lap.lap},${lap.time},${lap.split}\n`;
        });
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Lap times copied to clipboard!');
            });
        } else {
            alert('Clipboard API not supported.');
        }
    }
}

// Initialize the stopwatch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Ensure all elements exist before adding listeners
    const stopwatch = new Stopwatch();
    window.stopwatch = stopwatch;

    // Help modal logic
    const helpModal = document.getElementById('helpModal');
    const openHelpBtn = document.getElementById('openHelpBtn');
    const closeHelpModal = document.getElementById('closeHelpModal');
    if (helpModal && openHelpBtn && closeHelpModal) {
        openHelpBtn.addEventListener('click', () => { helpModal.style.display = 'flex'; });
        closeHelpModal.addEventListener('click', () => { helpModal.style.display = 'none'; });
        helpModal.addEventListener('click', e => { if (e.target === helpModal) helpModal.style.display = 'none'; });
    }

    // Achievements logic
    const achievementsDiv = document.getElementById('achievements');
    function showAchievement(text, emoji) {
        if (!achievementsDiv) return;
        achievementsDiv.innerHTML = `<span>${emoji}</span> <span>${text}</span>`;
        achievementsDiv.style.display = 'flex';
        setTimeout(() => { achievementsDiv.style.display = 'none'; }, 3000);
    }
    // Hook into lap logic
    if (stopwatch) {
        const origRecordLap = stopwatch.recordLap.bind(stopwatch);
        stopwatch.recordLap = function() {
            origRecordLap();
            if (this.lapCount === 10) showAchievement('10 laps!', '🏅');
            if (this.lapCount === 1) showAchievement('First lap!', '🎉');
            if (this.lapCount === 50) showAchievement('50 laps!', '🥇');
            if (this.elapsedTime >= 3600000) showAchievement('1 hour!', '⏰');
        };
    }

    // Import lap times logic
    const importLapBtn = document.getElementById('importLapBtn');
    const importLapFile = document.getElementById('importLapFile');
    if (importLapBtn && importLapFile) {
        importLapBtn.addEventListener('click', () => importLapFile.click());
        importLapFile.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                const lines = evt.target.result.split('\n').slice(1); // skip header
                stopwatch.clearLaps();
                lines.forEach(line => {
                    const [lap, time, split] = line.split(',');
                    if (lap && time && split) {
                        stopwatch.lapCount++;
                        // Remove 'Split: ' prefix if present
                        let splitValue = split.replace(/"/g, '').replace(/^Split: /, '');
                        stopwatch.addLapToDisplay(stopwatch.lapCount, time.replace(/"/g, ''), splitValue);
                    }
                });
            };
            reader.readAsText(file);
        });
    }

    // Screenshot sharing logic
    const screenshotBtn = document.getElementById('screenshotBtn');
    if (screenshotBtn && window.html2canvas) {
        screenshotBtn.addEventListener('click', () => {
            window.html2canvas(document.querySelector('.stopwatch')).then(canvas => {
                canvas.toBlob(blob => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'stopwatch_screenshot.png';
                    a.click();
                    URL.revokeObjectURL(url);
                });
            });
        });
    }




    // Accessibility: Focus management
    document.querySelectorAll('button, select, input').forEach(el => {
        el.setAttribute('tabindex', '0');
    });

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js').then(function(reg) {
            // Service worker registered
        }).catch(function(err) {
            // Registration failed
        });
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        darkModeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDark);
    });

    // Mode switching logic
    const stopwatchModeBtn = document.getElementById('stopwatchModeBtn');
    const countdownModeBtn = document.getElementById('countdownModeBtn');
    const countdownInput = document.getElementById('countdownInput');
    function setMode(mode) {
        if (mode === 'stopwatch') {
            stopwatchModeBtn.classList.add('active');
            countdownModeBtn.classList.remove('active');
            countdownInput.style.display = 'none';
            stopwatch.reset();
        } else {
            stopwatchModeBtn.classList.remove('active');
            countdownModeBtn.classList.add('active');
            countdownInput.style.display = 'inline-block';
            stopwatch.reset();
        }
    }
    stopwatchModeBtn.addEventListener('click', () => setMode('stopwatch'));
    countdownModeBtn.addEventListener('click', () => setMode('countdown'));

    // Animated SVG clock
    function renderSVGClock(minutes, seconds, milliseconds) {
        const totalSeconds = minutes * 60 + seconds + milliseconds / 100;
        const percent = (totalSeconds % 60) / 60;
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * (1 - percent);
        // Detect dark mode
        const isDark = document.body.classList.contains('dark-mode');
        const textColor = isDark ? '#fafafa' : '#333';
        const svg = `
            <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#3498db" stroke-width="8" fill="none" opacity="0.2" />
                <circle cx="50" cy="50" r="40" stroke="#27ae60" stroke-width="8" fill="none" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" />
                <text x="50" y="55" text-anchor="middle" font-size="18" fill="${textColor}">${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</text>
            </svg>
        `;
        document.getElementById('svgClockContainer').innerHTML = svg;
    }

    // Hook into stopwatch display update
    const origUpdateDisplay = stopwatch.updateDisplay.bind(stopwatch);
    stopwatch.updateDisplay = function() {
        origUpdateDisplay();
        const m = parseInt(this.minutesElement.textContent);
        const s = parseInt(this.secondsElement.textContent);
        const ms = parseInt(this.millisecondsElement.textContent);
        renderSVGClock(m, s, ms);
    };

    // Add keyboard shortcuts information
    const keyboardShortcuts = document.createElement('div');
    keyboardShortcuts.innerHTML = `
        <div style="margin-top: 20px; padding: 15px; background: rgba(52, 73, 94, 0.1); border-radius: 10px; font-size: 0.9rem; color: #7f8c8d;">
            <strong>Keyboard Shortcuts:</strong><br>
            <span style="font-family: monospace;">Space</span> - Start/Pause &nbsp;
            <span style="font-family: monospace;">Ctrl+R</span> - Reset &nbsp;
            <span style="font-family: monospace;">L</span> - Lap (when running)
        </div>
    `;
    document.querySelector('.stopwatch').appendChild(keyboardShortcuts);
});

// Add some utility functions for enhanced functionality
function downloadLapTimes() {
    if (window.stopwatch) {
        const lapTimes = window.stopwatch.exportLapTimes();
        if (lapTimes.length === 0) {
            alert('No lap times to download');
            return;
        }
        let csvContent = "Lap Number,Time,Split\n";
        lapTimes.forEach(lap => {
            csvContent += `"${lap.lap}","${lap.time}","${lap.split}"\n`;
        });
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'stopwatch_lap_times.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// Add download button functionality
document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download Lap Times';
    downloadBtn.className = 'btn clear-laps';
    downloadBtn.style.display = 'none';
    downloadBtn.onclick = downloadLapTimes;

    const lapActions = document.querySelector('.lap-actions');
    if (lapActions) {
        lapActions.appendChild(downloadBtn);
    }

    // Show download button when there are laps
    const observer = new MutationObserver(() => {
        const lapTimes = document.querySelectorAll('.lap-time');
        downloadBtn.style.display = lapTimes.length > 0 ? 'inline-block' : 'none';
    });

    observer.observe(document.getElementById('lapContainer'), {
        childList: true,
        subtree: true
    });
});

// Sound effects
const sounds = {
    start: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
    pause: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
    lap: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
    reset: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='
};
function playSound(type) {
    if (!sounds[type]) return;
    const audio = new Audio(sounds[type]);
    audio.play();
}
