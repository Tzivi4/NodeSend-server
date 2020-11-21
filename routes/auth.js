const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { check } = require('express-validator')
const auth = require('../middleware/auth')

router.post(
  '/',
  [check('email', "Your email isn't valid").isEmail(), check('password', 'Your password is required').not().isEmpty()],
  authController.authenticateUser
)

router.get('/', auth, authController.authenticatedUser)

module.exports = router
