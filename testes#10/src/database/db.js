const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'hr_system.db'));

db.serialize(() => {
    // Candidates table
    db.run(`CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        position TEXT NOT NULL,
        status TEXT DEFAULT 'New',
        resume_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tests table
    db.run(`CREATE TABLE IF NOT EXISTS tests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        duration INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Interviews table
    db.run(`CREATE TABLE IF NOT EXISTS interviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER,
        interviewer TEXT NOT NULL,
        date DATETIME NOT NULL,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'Scheduled',
        notes TEXT,
        FOREIGN KEY(candidate_id) REFERENCES candidates(id)
    )`);
});

module.exports = db;