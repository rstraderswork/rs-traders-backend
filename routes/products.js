import express from 'express'
import supabase from '../utils/supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Get all products
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create product (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, category, description, fabric_type, size_range, image_urls, is_featured } = req.body

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name,
        category,
        description,
        fabric_type,
        size_range,
        image_urls: image_urls ? [image_urls] : [],
        is_featured: is_featured || false,
        created_by: req.user.id
      }])
      .select()

    if (error) throw error
    res.json(data[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update product (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, category, description, fabric_type, size_range, image_urls, is_featured } = req.body

    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        category,
        description,
        fabric_type,
        size_range,
        image_urls: image_urls ? [image_urls] : [],
        is_featured: is_featured || false,
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

// Delete product (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ message: 'Product deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router