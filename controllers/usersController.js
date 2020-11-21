const User = require('../models/User')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

exports.newUser = async (req, res) => {
  //Express validator
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  //Existing user
  const { email, password } = req.body
  let user = await User.findOne({ email })
  if (user) {
    return res.status(400).json({ msg: 'This email is already registered' })
  }
  //Creating new User
  user = new User(req.body)

  //Hashing password
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(password, salt)

  //Saving user
  try {
    await user.save()
    res.json({ msg: 'User created succesfully' })
  } catch (error) {
    console.log(error)
  }
}
