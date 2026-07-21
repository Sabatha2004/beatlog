const express = require('express')
const router = express.Router()
const pool = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/login', async (req, res) => {

    const{email, password} = req.body //captures client-side data (key-value pairs)

    try{
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        if(result.rows.length === 0){
        return res.status(401).json({error: 'Invalid Credentials'})
        }

        const user = result.rows[0]

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch){
            return res.status(401).json({error: 'Invalid credentials'})
        }

        const token = jwt.sign(
            {id: user.id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )

        res.status(200).json({
            token, 
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'Server error'})
    }
})

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body

    try{
        const userExists= await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        )

        if(userExists.rows.length > 0){
            return res.status(400).json({error: 'Email already registered'})
        }//if

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const result = await pool.query(
            `INSERT INTO users (username, email, password)
            VALUES($1, $2, $3)
            RETURNING id, username, email, created_at`,
            [username, email, hashedPassword]
        )

        res.status(201).json(result.rows[0])

        } catch (err) {
            
        console.error(err)
        res.status(500).json({error: 'Server error'})
    
    }//try
})

module.exports = router