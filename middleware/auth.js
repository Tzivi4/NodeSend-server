const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'var.env' })

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (authHeader) {
    //Get Token
    const token = authHeader.split(' ')[1]

    //Check JWT
    try {
      const user = jwt.verify(token, process.env.CODE)
      req.user = user
    } catch (error) {
      console.log('Invalid JWT')
    }
  }
  return next()
}
