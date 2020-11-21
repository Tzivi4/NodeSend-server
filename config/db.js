const mongoose = require('mongoose')
require('dotenv').config({ path: 'var.env' })

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    console.log('DB Connected')
  } catch (error) {
    console.log('There was an error ', error)
    process.exit(1)
  }
}

module.exports = dbConnect
