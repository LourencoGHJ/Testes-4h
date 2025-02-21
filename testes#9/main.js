const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let mainWindow;
let db;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

function initDatabase() {
    db = new sqlite3.Database('banking.db', (err) => {
        if (err) console.error('Database opening error: ', err);
        createTables();
    });
}

function createTables() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            balance REAL DEFAULT 0,
            currency TEXT DEFAULT 'USD'
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id INTEGER,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT,
            category TEXT,
            date TEXT,
            FOREIGN KEY(account_id) REFERENCES accounts(id)
        )`);
    });
}

app.whenReady().then(() => {
    initDatabase();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Handlers
ipcMain.handle('add-account', async (event, account) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO accounts (name, type, balance, currency) VALUES (?, ?, ?, ?)',
            [account.name, account.type, account.balance, account.currency],
            function(err) {
                if (err) reject(err);
                resolve(this.lastID);
            });
    });
});

ipcMain.handle('get-accounts', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM accounts', (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
});

ipcMain.handle('add-transaction', async (event, transaction) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO transactions (account_id, type, amount, description, date, category) VALUES (?, ?, ?, ?, ?, ?)',
            [transaction.accountId, transaction.type, transaction.amount, transaction.description, transaction.date, transaction.category],
            function(err) {
                if (err) reject(err);
                
                // Update account balance
                const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
                db.run('UPDATE accounts SET balance = balance + ? WHERE id = ?',
                    [balanceChange, transaction.accountId]);
                
                resolve(this.lastID);
            });
    });
});

ipcMain.handle('get-transactions', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM transactions ORDER BY date DESC', (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
});