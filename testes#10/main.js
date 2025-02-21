const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const db = require('./src/database/db');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
    // Uncomment the following line to open DevTools automatically
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle IPC communications here
// IPC Handlers for Candidates
ipcMain.handle('get-candidates', () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM candidates ORDER BY created_at DESC', (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
});

ipcMain.handle('add-candidate', (event, candidate) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`
            INSERT INTO candidates (name, email, position, status)
            VALUES (?, ?, ?, ?)
        `);
        
        stmt.run([candidate.name, candidate.email, candidate.position, 'New'], 
            function(err) {
                if (err) reject(err);
                resolve(this.lastID);
            }
        );
    });
});

// IPC Handlers for Tests
ipcMain.handle('get-tests', () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM tests ORDER BY created_at DESC', (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
});

// IPC Handlers for Interviews
ipcMain.handle('get-interviews', () => {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT i.*, c.name as candidate_name 
            FROM interviews i 
            JOIN candidates c ON i.candidate_id = c.id 
            ORDER BY date DESC`, 
            (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
});