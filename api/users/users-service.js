const User = require('./users-model');

module.exports = {
    isValid,
    uniqueUser,
    usernameIsValid,
    passwordIsValid,
    generateToken
  };
  
function isValid(user) {
    return Boolean(user.username && user.password && typeof user.password === "string");
}

const uniqueUser = async (req, res, next) => {
    try {
        const username = await User.findBy({ username: req.body.username })
        if(!rows.length) {
            next()
        } else {
            res.status(401).json('username taken')
        }
    } catch(error) {
        res.status(500).json({ message: error.messsage })
    }
}

const usernameIsValid = async (req, res, next) => {
    try {
        const trueUsername = await User.findBy({ username: req.body.username })
        if (rows.length) {
            req.userData = rows[0]
            next()
        } else {
            res.status(401).json('invalid credentials')
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const passwordIsValid = async (req, res, next) => {
    try {
        const truePassword = bcrypt.compareSync(req.body.password, req.userData.password)
        if(truePassword) {
            next()
        } else {
            res.status(401).json('invalid credentials')
        }
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}