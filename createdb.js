import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./your_database.sqlite', (err) => {
    if (err) {
        console.error('Failed to create database:', err.message);
    } else {
        console.log('Database created successfully.');
    }
});

db.close();