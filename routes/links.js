const express = require('express')
const router = express.Router()
const linkController = require('../controllers/linksController')
const filesController = require('../controllers/filesController')
const { check } = require('express-validator')
const auth = require('../middleware/auth')
const { route } = require('./files')

router.post(
  '/',
  [check('name', 'Try uploading a file').not().isEmpty(), check('base_name', 'Try uploading a file').not().isEmpty()],
  auth,
  linkController.newLink
)

router.get('/', linkController.getLinks)

router.get('/:url', linkController.hasPassword, linkController.getLink)

router.post('/:url', linkController.checkPassword, linkController.getLink)

module.exports = router
