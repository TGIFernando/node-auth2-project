const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { jwtSecret } = require("../../config/secrets")
const M = require('./auth-model')

router.post("/register", async (req, res) => {
    const credentials = req.body
    if(M.isValid(credentials)){
        const rounds = process.env.BCRYPT_ROUNDS || 8
        const hash = bcryptjs.hashSync(credentials.password, 8 ,rounds)
        credentials.password = hash
        try {
            const newUser = await M.add(credentials)
            res.status(201).json({data: newUser}) 
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(400).json({message: "please provide username and password and the password shoud be alphanumeric"})
    }
})

module.exports = router