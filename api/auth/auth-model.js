const db = require("../../data/db-config")
function isValid(user) {
    return Boolean(user.username && user.password && typeof user.password === "string");
}

function find() {
    return db("users as u")
      .join("roles as r", "u.role", "=", "r.id")
      .select("u.id", "u.username", "r.name as role");
  }

function findById(id) {
    return db("users as u")
      .join("roles as r", "u.role", "=", "r.id")
      .select("u.id", "u.username", "r.name as role")
      .where("u.id", id)
      .first();
  }

function findBy(filter) {
    return db("users as u")
      .join("roles as r", "u.role", "=", "r.id")
      .select("u.id", "u.username", "r.name as role", "u.password")
      .where(filter);
}

async function add(user) {
    const [id] = await db("users").insert(user, "id");
    return findById(id);
}

module.exports = {
    isValid,
    add,
    findBy,
    findById,
    find
};