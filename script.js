class Stopwatch {
    constructor() {
        // Time tracking variables
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.lapCount = 0;
        
        // DOM elements
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.millisecondsElement = document.getElementById('milliseconds');
        
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.clearLapsBtn = document.getElementById('clearLapsBtn');
        
        this.lapContainer = document.getElementById('lapContainer');
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        this.clearLapsBtn.addEventListener('click', () => this.clearLaps());
        
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
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => this.updateDisplay(), 10);
            this.isRunning = true;
            
            // Update button states
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.lapBtn.disabled = false;
            
            // Update button text
            this.startBtn.textContent = 'Running...';
            this.pauseBtn.textContent = 'Pause';
        }
    }
    
    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            
            // Update button states
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.lapBtn.disabled = true;
            
            // Update button text
            this.startBtn.textContent = 'Resume';
            this.pauseBtn.textContent = 'Paused';
        }
    }
    
    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.elapsedTime = 0;
        this.startTime = 0;
        
        // Reset display
        this.updateDisplay();
        
        // Update button states
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.lapBtn.disabled = true;
        
        // Update button text
        this.startBtn.textContent = 'Start';
        this.pauseBtn.textContent = 'Pause';
        
        // Clear all laps
        this.clearLaps();
    }
    
    updateDisplay() {
        if (this.isRunning) {
            this.elapsedTime = Date.now() - this.startTime;
        }
        
        const time = this.formatTime(this.elapsedTime);
        this.minutesElement.textContent = time.minutes;
        this.secondsElement.textContent = time.seconds;
        this.millisecondsElement.textContent = time.milliseconds;
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
            const lapTime = this.elapsedTime;
            const formattedTime = this.formatTime(lapTime);
            const lapTimeString = `${formattedTime.minutes}:${formattedTime.seconds}:${formattedTime.milliseconds}`;
            
            this.addLapToDisplay(this.lapCount, lapTimeString);
            
            // Show clear laps button if not visible
            if (this.clearLapsBtn.style.display === 'none') {
                this.clearLapsBtn.style.display = 'block';
            }
        }
    }
    
    addLapToDisplay(lapNumber, timeString) {
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
        `;
        
        // Insert at the top of the container
        this.lapContainer.insertBefore(lapElement, this.lapContainer.firstChild);
        
        // Remove the 'new' class after animation
        setTimeout(() => {
            lapElement.classList.remove('new');
        }, 300);
        
        // Auto-scroll to top to show the latest lap
        this.lapContainer.scrollTop = 0;
    }
    
    clearLaps() {
        this.lapContainer.innerHTML = '<p class="no-laps">No lap times recorded</p>';
        this.lapCount = 0;
        this.clearLapsBtn.style.display = 'none';
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
            lapTimes.push({ lap: lapNumber, time: lapValue });
        });
        
        return lapTimes.reverse(); // Return in chronological order
    }
}

// Initialize the stopwatch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const stopwatch = new Stopwatch();
    window.stopwatch = stopwatch;

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

    // Countdown mode logic
    const modeSelect = document.getElementById('modeSelect');
    const countdownInput = document.getElementById('countdownInput');
    modeSelect.addEventListener('change', () => {
        if (modeSelect.value === 'countdown') {
            countdownInput.style.display = 'inline-block';
            stopwatch.reset();
        } else {
            countdownInput.style.display = 'none';
            stopwatch.reset();
        }
    });

    // Animated SVG clock
    function renderSVGClock(minutes, seconds, milliseconds) {
        const totalSeconds = minutes * 60 + seconds + milliseconds / 100;
        const percent = (totalSeconds % 60) / 60;
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * (1 - percent);
        const svg = `
            <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#3498db" stroke-width="8" fill="none" opacity="0.2" />
                <circle cx="50" cy="50" r="40" stroke="#27ae60" stroke-width="8" fill="none" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" />
                <text x="50" y="55" text-anchor="middle" font-size="18" fill="#333">${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</text>
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
        
        let csvContent = "Lap Number,Time\n";
        lapTimes.forEach(lap => {
            csvContent += `"${lap.lap}","${lap.time}"\n`;
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
    downloadBtn.style.marginLeft = '10px';
    downloadBtn.onclick = downloadLapTimes;
    
    const clearLapsBtn = document.getElementById('clearLapsBtn');
    clearLapsBtn.parentNode.insertBefore(downloadBtn, clearLapsBtn.nextSibling);
    
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
