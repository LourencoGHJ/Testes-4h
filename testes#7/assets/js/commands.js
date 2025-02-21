const si = require('systeminformation');
const os = require('os');
const osUtils = require('node-os-utils');
const { exec } = require('child_process');
const path = require('path');
const weather = require('weather-js');

class JarvisCommands {
    constructor() {
        this.commands = {
            'help': {
                description: 'Show all available commands',
                action: () => this.showHelp()
            },
            'system': {
                description: 'Show detailed system information',
                action: () => this.getSystemInfo()
            },
            'cpu': {
                description: 'Monitor CPU usage and temperature',
                action: () => this.getCPUInfo()
            },
            'memory': {
                description: 'Show detailed memory usage',
                action: () => this.getMemoryInfo()
            },
            'processes': {
                description: 'List top CPU consuming processes',
                action: () => this.getProcesses()
            },
            'drives': {
                description: 'Show disk drives information',
                action: () => this.getDrives()
            },
            'network': {
                description: 'Show network status and speed',
                action: () => this.getNetwork()
            },
            'battery': {
                description: 'Show battery status and health',
                action: () => this.getBattery()
            },
            'open': {
                description: 'Open applications (e.g., open chrome)',
                action: (app) => this.openApplication(app)
            },
            'shutdown': {
                description: 'Shutdown computer with timer',
                action: () => this.shutdown()
            },
            'restart': {
                description: 'Restart computer with timer',
                action: () => this.restart()
            },
            'clean': {
                description: 'Clean temporary files',
                action: () => this.cleanSystem()
            },
            'kill': {
                description: 'Kill a process (e.g., kill chrome)',
                action: (process) => this.killProcess(process)
            },
            'volume': {
                description: 'Set system volume (0-100)',
                action: (level) => this.setVolume(level)
            },
            'wifi': {
                description: 'Show WiFi networks',
                action: () => this.getWifiNetworks()
            }
        };
    }

    // ... existing executeCommand and showHelp methods ...

    async getSystemInfo() {
        const cpu = await si.cpu();
        const system = await si.system();
        const mem = await si.mem();
        const os_info = await si.osInfo();
        const graphics = await si.graphics();
        
        return `System Information:
------------------
CPU: ${cpu.manufacturer} ${cpu.brand}
Speed: ${cpu.speed} GHz
Cores: ${cpu.cores} (${cpu.physicalCores} physical)
System: ${system.manufacturer} ${system.model}
OS: ${os_info.distro} ${os_info.release} ${os_info.arch}
Memory: ${Math.round(mem.total / 1024 / 1024 / 1024)} GB
GPU: ${graphics.controllers[0]?.name || 'N/A'}
Hostname: ${os.hostname()}`;
    }

    async getCPUInfo() {
        const load = await si.currentLoad();
        const temp = await si.cpuTemperature();
        const speed = await si.cpuCurrentSpeed();
        
        return `CPU Status:
Current Usage: ${Math.round(load.currentLoad)}%
Temperature: ${Math.round(temp.main || 0)}°C
Current Speed: ${speed.avg} GHz
Processes: ${load.currentLoad_user}% User, ${load.currentLoad_system}% System`;
    }

    async getNetwork() {
        const net = await si.networkInterfaces();
        const defaultNet = net.find(n => n.operstate === 'up');
        const speed = await si.networkStats();
        
        return defaultNet ? 
            `Network Status:
Interface: ${defaultNet.iface}
IP: ${defaultNet.ip4}
Speed: ${Math.round(speed[0].tx_sec / 1024)} KB/s (Up) / ${Math.round(speed[0].rx_sec / 1024)} KB/s (Down)
Type: ${defaultNet.type}
Status: ${defaultNet.operstate}` :
            'No active network interface found';
    }

    async cleanSystem() {
        exec('cleanmgr /sagerun:1');
        return 'Cleaning system temporary files...';
    }

    async killProcess(processName) {
        if (!processName) return 'Please specify a process name';
        exec(`taskkill /IM "${processName}.exe" /F`);
        return `Attempting to terminate ${processName}...`;
    }

    async setVolume(level) {
        if (!level || isNaN(level) || level < 0 || level > 100) {
            return 'Please specify a volume level between 0 and 100';
        }
        exec(`nircmd.exe setsysvolume ${Math.floor(level * 655.35)}`);
        return `Volume set to ${level}%`;
    }

    async getWifiNetworks() {
        return new Promise((resolve) => {
            exec('netsh wlan show networks', (error, stdout) => {
                if (error) resolve('Could not retrieve WiFi networks');
                resolve(`Available WiFi Networks:\n${stdout}`);
            });
        });
    }

    // ... keep existing methods and add new ones above ...
}

module.exports = JarvisCommands;