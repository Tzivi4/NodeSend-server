const User = require('../models/User')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'var.env' })

exports.authenticateUser = async (req, res, next) => {
  //Express validator
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  //Check if there is an user with the same credentials
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    res.status(401).json({ msg: "This user doesn't exist, try signing up" })
    next()
  }

  //Auth user and check password
  if (bcrypt.compareSync(password, user.password)) {
    //Create JSON WT (Web Token)
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
      },
      process.env.CODE,
      {
        expiresIn: '8h',
      }
    )
    res.json({ token })
  } else {
    res.status(401).json({ msg: 'Incorrect password' })
  }
}

exports.authenticatedUser = async (req, res) => {
  res.json({ user: req.user })
}
