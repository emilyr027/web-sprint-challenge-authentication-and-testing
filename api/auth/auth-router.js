const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('./auth-model');
const {  validUser } = require('../middleware/middleware');
const createToken = require('../middleware/createToken');

router.post('/register', (req, res) => {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const credentials = req.body;
  
    if (validUser(credentials)) {
      
      const hash = bcrypt.hashSync(credentials.password, rounds);
      credentials.password = hash;

      Users.add(credentials)
        .then((user) => {
          res.status(201).json(user);
        })
        .catch((err) => { 
          res.status(500).json({ message: 'username taken' });
        });
    } else {
      res.status(400).json({ message: 'username and password required.' });
    }
});

router.post('/login', (req, res) => {

  const { username, password } = req.body;

  if (validUser(req.body)) {
    Users.findBy({ username: username })
    .then(data => {
      if(!data.length){
        return res.status(401).json({ message: 'invalid credentials'})
      }
      const [user] = data
      if ([user] && bcrypt.compareSync(password, user.password)){
        const token = createToken(user)
        res.status(200).json({ message: `welcome, ${user.username}`, token})
      } else {
        res.status(401).json({ message: 'invalid credentials '})
      }
    }) .catch(err => {
      res.status(500).json({ message: 'error' })
    })
  } else {
    res.status(400).json({ message: 'username and password required'})
  }
});



module.exports = router;
