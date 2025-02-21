const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Disable GPU acceleration
app.disableHardwareAcceleration();

// Handle GPU process crashes
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-gpu-compositing');

let mainWindow = null;

function createLoadingWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: false
        },
        // Add GPU-related options
        backgroundColor: '#000000',
        show: false
    });

    win.loadFile('index.html');
    win.once('ready-to-show', () => {
        win.show();
    });
    return win;
}

function createMainWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false
        },
        backgroundColor: '#000000',
        show: false
    });

    win.loadFile('panel.html');
    win.webContents.openDevTools();
    win.once('ready-to-show', () => {
        win.show();
    });
    return win;
}

app.whenReady().then(() => {
    mainWindow = createLoadingWindow();
    
    // Simular tempo de carregamento
    setTimeout(() => {
        const mainWin = createMainWindow();
        mainWindow.close();
        mainWindow = mainWin;
    }, 3000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createMainWindow();
    }
});
// Handle GPU process errors
app.on('gpu-process-crashed', (event, killed) => {
    console.log('GPU Process Crashed', {killed});
    // Restart the app if GPU crashes
    app.relaunch();
    app.exit(0);
});

// Handle renderer process crashes
app.on('render-process-crashed', (event, webContents, killed) => {
    console.log('Renderer Process Crashed', {killed});
    // Restart the app if renderer crashes
    app.relaunch();
    app.exit(0);
});
// Handle errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});