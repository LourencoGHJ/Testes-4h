const JarvisCommands = require('./commands');
const jarvis = new JarvisCommands();

document.addEventListener('DOMContentLoaded', () => {
    initializeJarvis();
});

function initializeJarvis() {
    const commandInput = document.getElementById('command-input');
    const commandHistory = document.getElementById('command-history');

    updateSystemStatus();
    setInterval(updateSystemStatus, 2000);

    commandInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            if (command) {
                addToHistory(`> ${command}`);
                const response = await jarvis.executeCommand(command);
                addToHistory(response);
                commandInput.value = '';
            }
        }
    });

    addToHistory('J.A.R.V.I.S online. Type "help" for available commands.');
}

async function updateSystemStatus() {
    try {
        const cpuInfo = await jarvis.getCPUInfo();
        const memoryInfo = await jarvis.getMemoryInfo();
        
        document.getElementById('cpu-usage').textContent = cpuInfo.split(':')[1].trim();
        document.getElementById('memory-usage').textContent = memoryInfo.split(':')[1].split('(')[0].trim();
    } catch (error) {
        console.error('Error updating system status:', error);
    }
}

function addToHistory(text) {
    const commandHistory = document.getElementById('command-history');
    const entry = document.createElement('div');
    entry.innerHTML = text.replace(/\n/g, '<br>');
    commandHistory.appendChild(entry);
    commandHistory.scrollTop = commandHistory.scrollHeight;
}

window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Window error:', msg, error);
    return false;
};