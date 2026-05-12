const { JSONFilePreset } = require('lowdb/node');

let db;

async function initDB() {
  if (db) return db;
  
  const defaultData = { users: [], analyses: [] };
  db = await JSONFilePreset('db.json', defaultData);
  return db;
}

module.exports = { initDB };
