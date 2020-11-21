const express = require('express')
const dbConnect = require('./config/db')
const cors = require('cors')

//Starting server
const app = express()

//Connecting database
dbConnect()

//CORS Enabled
const CORSConfig = { origin: process.env.FRONTEND_URL }
app.use(cors(CORSConfig))

//Port
const port = process.env.PORT || 4000

//Read body values
app.use(express.json())

//Enable public folder
app.use(express.static('uploads'))

//Routing
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/links', require('./routes/links'))
app.use('/api/files', require('./routes/files'))

//Starting app
app.listen(port, '0.0.0.0', () => console.log(`Server started in port => ${port}`))
