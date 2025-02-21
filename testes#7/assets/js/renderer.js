// Atualizar o caminho do commands.js
const JarvisCommands = require('./commands');  // Agora aponta para o mesmo diretório
const si = require('systeminformation');
const os = require('os');
const osUtils = require('node-os-utils');
const cpu = osUtils.cpu;
const jarvis = new JarvisCommands();

document.addEventListener('DOMContentLoaded', () => {
    initializeJarvis();
});

async function initializeJarvis() {
    const commandInput = document.getElementById('command-input');
    const commandHistory = document.getElementById('command-history');

    // Sistema de monitoramento em tempo real
    async function updateSystemStatus() {
        try {
            // CPU em tempo real
            const cpuPercentage = await cpu.usage();
            document.getElementById('cpu-usage').textContent = `${Math.round(cpuPercentage)}%`;

            // Memória em tempo real
            const mem = await si.mem();
            const memPercentage = Math.round((mem.used / mem.total) * 100);
            document.getElementById('memory-usage').textContent = `${memPercentage}%`;

            // Status dinâmico
            const statusElement = document.querySelector('.online');
            if (cpuPercentage > 80 || memPercentage > 80) {
                statusElement.style.color = '#ff0000';
                statusElement.textContent = 'HIGH LOAD';
            } else if (cpuPercentage > 50 || memPercentage > 50) {
                statusElement.style.color = '#ffff00';
                statusElement.textContent = 'MODERATE';
            } else {
                statusElement.style.color = '#00ff00';
                statusElement.textContent = 'ONLINE';
            }
        } catch (error) {
            console.error('Erro de monitoramento:', error);
        }
    }

    // Atualização inicial
    await updateSystemStatus();
    
    // Atualização contínua a cada 500ms
    setInterval(updateSystemStatus, 500);

    // Manipulação de comandos
    commandInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            if (command) {
                addToHistory(`<span style="color: #00fff2">> ${command}</span>`);
                try {
                    const response = await jarvis.executeCommand(command);
                    addToHistory(`<span style="color: #00ff00">${response}</span>`);
                } catch (error) {
                    addToHistory(`<span style="color: #ff0000">Error: ${error.message}</span>`);
                }
                commandInput.value = '';
            }
        }
    });

    // Mensagem de boas-vindas
    addToHistory(`<span style="color: #00fff2">
╔════════════════════════════════════════╗
║        J.A.R.V.I.S. Interface v1.0     ║
╚════════════════════════════════════════╝

Bem-vindo! Eu sou JARVIS, seu assistente pessoal.
Digite 'help' para ver todos os comandos disponíveis.

Status: Sistema totalmente operacional e pronto para ajudar!</span>`);
}

function addToHistory(text) {
    const commandHistory = document.getElementById('command-history');
    const entry = document.createElement('div');
    entry.style.margin = '5px 0';
    entry.innerHTML = text;
    commandHistory.appendChild(entry);
    commandHistory.scrollTop = commandHistory.scrollHeight;
}