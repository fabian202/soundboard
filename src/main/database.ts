import { app } from 'electron';
import sqlite3 from 'sqlite3';
import path from 'path';

let db: sqlite3.Database;

async function connectDatabase() {
  const dbPath = path.join(__dirname, '..', '..', 'db', 'songs.db')//path.join(userDataPath, 'db', 'songs.db');
  await new Promise<void>((resolve, reject) => {
    // Open the SQLite database
    db = new sqlite3.Database(dbPath, async (error) => {
      if (error) {
        reject(error);
        return;
      }

      try {
        // Create the songs table
        await runQuery(db, `
          CREATE TABLE IF NOT EXISTS songs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
          )
        `);

        // Create the sounds table
        await runQuery(db, `
          CREATE TABLE IF NOT EXISTS sounds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            song_id INTEGER,
            FOREIGN KEY (song_id) REFERENCES songs (id)
          )
        `);

        // Insert seed data
        await runQuery(db, `INSERT INTO songs (name) VALUES ('Song 1')`);
        await runQuery(db, `INSERT INTO songs (name) VALUES ('Song 2')`);

        await runQuery(db, `INSERT INTO sounds (name, song_id) VALUES ('Sound 1', 1)`);
        await runQuery(db, `INSERT INTO sounds (name, song_id) VALUES ('Sound 2', 1)`);
        await runQuery(db, `INSERT INTO sounds (name, song_id) VALUES ('Sound 3', 2)`);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

function runQuery(db: sqlite3.Database, query: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.run(query, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Export the connectDatabase function to be used in other files
export default connectDatabase;
