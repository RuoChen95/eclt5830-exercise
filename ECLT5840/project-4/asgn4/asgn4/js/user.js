/* 
   This file contains "user" related functions.

   Note: A "user object" refers to a generic object with the following properties:
     userId, username, token_balance, password
   However, the property 'password' is usually not included in objects returned by the 
   functions here.
*/

const db = require('./db');

// Authenticate a user by the user's "username" and "password".
// If successfully authenticated, this function returns a user object 
// (without the password).  Otherwise, this function returns null.
async function authenticate(username, password) {
  let sql = `SELECT user_id AS id, username, token_balance FROM users 
             WHERE username=? AND pass=SHA1(?)`;
  let data = [ username, password ];

  let results = await db.query(sql, data);

  if (results.length == 0)
    return null;

  return results[0];
}

// Insert a new user to the table "user"
// If user.id is not specified, user.id is assigned a user ID generated by the DB.
// This function returns the user ID of the inserted user.
async function create(user) {
  let sql = `INSERT INTO users (user_id, username, pass, token_balance) VALUES (?, ?, SHA1(?), ?)`;
  let data = [ user.id, user.username, user.password, user.token_balance ];

  let result = await db.query(sql, data);

  // Note: "result.insertId" is the user_id assigned by DB (if user.id was undefined)
  if (user.id === undefined || user.id === null)
    user.id = result.insertId;

  return result.insertId;
}

// Returns a user object (without the password) with the specified userId, 
// or returns null if no such user exists.
async function findById(userId) {
  let sql = `SELECT user_id AS id, username, token_balance FROM users WHERE user_id=?`;
  let data = [ userId ];

  let results = await db.query(sql, data);
  if (results.length == 0)
    return null;
  else {
    let { id, username, token_balance } = results[0];
    return { id, username, token_balance };
  }
}

// Returns a user object (without the password) with the specified username,
// or returns null if no such user exists.
async function findByUsername(username) {
  let sql = `SELECT user_id AS id, username, token_balance FROM users WHERE username=?`;
  let data = [ username ];

  let results = await db.query(sql, data);
  if (results.length == 0)
    return null;
  else {
    let { id, username, token_balance } = results[0];
    return { id, username, token_balance };
  }
}

// Removes the user with the specified userId.
async function remove(userId) {
  let sql = `DELETE FROM users WHERE user_id=?`;
  let data = [ userId ];

  let result = await db.query(sql, data);
  return result.affectedRows;
}

module.exports = {
  authenticate,
  create,
  findById,
  findByUsername,
  remove
}

