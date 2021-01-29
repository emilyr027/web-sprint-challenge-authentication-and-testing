const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/secrets')

module.exports = (user) => {
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role
    }
    const options = {
        expiresIn: '500s'
    }
    return jwt.sign(payload, jwtSecret, options)
}