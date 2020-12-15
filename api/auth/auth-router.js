const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { jwtSecret } = require("../../config/secrets")

router.post("/register", (req, res) => {
    res.status(200).json({ message: "regester here"})
})

module.exports = router