const Links = require('../models/Link')
const sid = require('shortid')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

exports.newLink = async (req, res, next) => {
  //Express validator
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  //Creating link object
  const { base_name, name } = req.body

  const link = new Links()
  link.url = sid.generate()
  link.name = name
  link.base_name = base_name

  //If user is auth
  if (req.user) {
    const { password, downloads } = req.body
    //Assign downloads limit and password if the user has an account
    if (downloads) {
      link.downloads = downloads
    }

    if (password) {
      const salt = await bcrypt.genSalt(10)
      link.password = await bcrypt.hash(password, salt)
    }
    link.owner = req.user.id
  }

  //Store in DB
  try {
    await link.save()
    return res.json({ msg: `${link.url}` })
    next()
  } catch (error) {
    console.log(error)
  }
}

exports.getLinks = async (req, res) => {
  try {
    const links = await Links.find({}).select('url -_id')
    res.json({ links: links })
  } catch (error) {
    console.log(error)
  }
}

exports.getLink = async (req, res, next) => {
  //Check link
  const { url } = req.params
  const link = await Links.findOne({ url })
  if (!link) {
    res.status(404).json({ msg: "Link expired or doesn't exist" })
    return next()
  }
  res.json({ file: link.name, password: false })

  next()
}

exports.hasPassword = async (req, res, next) => {
  const { url } = req.params
  const link = await Links.findOne({ url })
  if (!link) {
    res.status(404).json({ msg: "Link expired or doesn't exist" })
    return next()
  }

  if (link.password) {
    return res.json({ password: true, link: link.url })
  }

  next()
}

exports.checkPassword = async (req, res, next) => {
  const { url } = req.params
  const { password } = req.body

  const link = await Links.findOne({ url })

  if (bcrypt.compareSync(password, link.password)) {
    next()
  } else {
    return res.status(401).json({ msg: "Password doesn't match" })
  }
}
