const express = require('express')
const router = express.Router()
const pool = require('../db')
const authMiddleware = require('../middleware/auth')

//POST route
router.post('/', authMiddleware, async (req, res) => {
  const { title, bpm, songkey, mood, notes, link } = req.body
  const userId = req.user.id

  try {
    const result = await pool.query(
      `INSERT INTO sessions (title, bpm, songkey, mood, notes, link)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, bpm, songkey, mood, notes, link, userId]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

//GET route
router.get('/', authMiddleware, async(req, res) => {
  const userId = req.user.id
  try{
    const result = await pool.query(
      `SELECT * FROM sessions WHERE user_id = $1 ORDER BY created_at DESC`
      [userId]
    )
    res.status(200).json(result.rows)
  } catch (err){
    console.error(err)
    res.status(500).json({error: 'Server error'})
  }
})

//DELETE route
router.delete('/:id', authMiddleware, async (req,res)=> {
const {id} = req.params

try{
  const result = await pool.query(
    `DELETE FROM sessions WHERE id = $1 RETURNING *`,
    [id]
  )

  if(result.rows.length === 0){
    return res.status(404).json({error: 'Session not found'})
  }

  res.status(200).json({message: 'Session deleted', session: result.rows[0]}) 
} catch (err){
console.error(err)
res.status(500).json({error: 'Server error'})
}
})

//PATCH route 
router.patch('/:id', authMiddleware, async (req, res) => {
  const {id} = req.params
  const {title, bpm, songkey, mood, notes, link} = req.body

  try{
    const result = await pool.query(
      `UPDATE sessions
      SET title = $1, bpm = $2, songkey = $3, mood = $4, notes = $5, link = $6
      WHERE id = $7
      RETURNING *`,
      [title, bpm, songkey, mood, notes, link, id]
    )

    if(result.rows.length === 0){
      return res.status(404).json({error: 'Session not found'})
    }
  

  res.status(200).json(result.rows[0])
 } catch (err){
  console.error(err)
  res.status(500).json({error: 'Server error'})
  }

})

module.exports = router