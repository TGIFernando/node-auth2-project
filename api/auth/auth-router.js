const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { jwtSecret } = require("../../config/secrets")
const M = require('./auth-model')
const checkRole = require('./auth-middleware/check-role-middleware')
const restrict = require('./auth-middleware/restricted-middleware')

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

router.post("/login", async (req, res) => {
    const { username, password} = req.body
    if (M.isValid(req.body)){
        M.findBy({ username: username})
            .then(([user]) => {
                if (user && bcryptjs.compareSync(password, user.password)){
                    const token = makeToken(user);
                    res.status(200).json({
                      message: "Welcome to our API, " + user.username,
                      token,
                    });
                } else {
                    res.status(401).json({ message: "Invalid credentials" });
                }
            }) .catch(err => {
                res.status(500).json({ message: err.message });
            })
    } else {
        res.status(400).json({ message: "please provide username and password and the password shoud be alphanumeric"})
    }
})

function makeToken(user) {
    const payload = {
      subject: user.id,
      username: user.username,
      role: user.role,
    }
    const options = {
      expiresIn: '900s',
    }
    return jwt.sign(payload, jwtSecret, options)
}

router.get("/users", restrict, checkRole("admin"), (req, res) => {
    M.find()
        .then(users => {
            res.json(users)
        }) .catch (err => {
            res.json(err)
        })
})

module.exports = router