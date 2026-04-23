import express from 'express'
import supabase from '../utils/supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    res.json(data || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create category (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, icon } = req.body

    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name,
        description,
        icon
      }])
      .select()

    if (error) throw error
    res.json(data[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update category (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, icon } = req.body

    const { data, error } = await supabase
      .from('categories')
      .update({
        name,
        description,
        icon,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()

    if (error) throw error
    res.json(data[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete category (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ message: 'Category deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
