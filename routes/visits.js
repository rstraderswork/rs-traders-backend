import express from 'express'
import supabase from '../utils/supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

function generateBookingId() {
  return `BK${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

// Book a visit (public)
router.post('/book', async (req, res) => {
  try {
    const {
      schoolName,
      contactPerson,
      phone,
      email,
      preferredDate,
      preferredTime,
      visitType,
      interestedProducts,
      message
    } = req.body

    const bookingId = generateBookingId()

    const { data, error } = await supabase
      .from('visit_requests')
      .insert([{
        school_name: schoolName,
        contact_person: contactPerson,
        phone,
        email,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        visit_type: visitType,
        interested_products: interestedProducts,
        message,
        booking_id: bookingId,
        status: 'pending'
      }])
      .select()

    if (error) throw error

    res.json({
      success: true,
      bookingId,
      message: 'Booking created successfully'
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all visits (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('visit_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Accept visit
router.put('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const { confirmedDate, confirmedTime, notes } = req.body

    const { data, error } = await supabase
      .from('visit_requests')
      .update({
        status: 'confirmed',
        confirmed_date: confirmedDate,
        confirmed_time: confirmedTime,
        notes
      })
      .eq('id', req.params.id)
      .select()

    if (error) throw error
    res.json(data[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Reject visit
router.put('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body

    const { data, error } = await supabase
      .from('visit_requests')
      .update({
        status: 'cancelled',
        notes: reason
      })
      .eq('id', req.params.id)
      .select()

    if (error) throw error
    res.json(data[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router