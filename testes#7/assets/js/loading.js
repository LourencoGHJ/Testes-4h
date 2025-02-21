const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const loadingSteps = [
        { text: "Initializing core systems...", time: 1500, progress: 20 },
        { text: "Loading neural networks...", time: 1500, progress: 40 },
        { text: "Calibrating sensors...", time: 1500, progress: 60 },
        { text: "Establishing secure connections...", time: 1500, progress: 80 },
        { text: "Loading user preferences...", time: 1500, progress: 100 }
    ];

    const loadingText = document.getElementById('loading-text');
    const progressBar = document.querySelector('.progress-bar');
    let currentStep = 0;

    function updateLoadingText() {
        if (currentStep < loadingSteps.length) {
            const step = loadingSteps[currentStep];
            loadingText.textContent = step.text;
            progressBar.style.width = `${step.progress}%`;
            currentStep++;
            setTimeout(updateLoadingText, step.time);
        } else {
            setTimeout(() => {
                ipcRenderer.send('loading-complete');
            }, 1000);
        }
    }

    updateLoadingText();
});