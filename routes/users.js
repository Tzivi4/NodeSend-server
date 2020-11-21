const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const { check } = require('express-validator')

router.post(
  '/',
  [
    check('name', 'Your name is required').not().isEmpty(),
    check('email', "Your email isn't valid").isEmail(),
    check('password', 'Your password is too short, try with at least 6 characters').isLength({ min: 6 }),
  ],
  usersController.newUser
)

module.exports = router
