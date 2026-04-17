import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import supabase from '../utils/supabase.js'

const router = express.Router()

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !users) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const validPassword = await bcrypt.compare(password, users.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: users.id, email: users.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: users.id,
        email: users.email,
        name: users.name
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router