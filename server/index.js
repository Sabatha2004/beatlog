const express = require('express')
const cors = require('cors')
const pool = require('./db')
const sessionRoutes = require('./routes/sessions')
const authRoutes = require('./routes/auth')
require ('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/sessions', sessionRoutes)
app.use('/api/auth', authRoutes)

pool.connect()
.then(() => console.log('PostgresSQL connected'))
.catch((err) => console.log('DB connection error:', err))

app.get('/',(req, res)=>{
    res.json({message: 'BeatLog API is running'})
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>console.log(`Server running on port ${PORT}`))



