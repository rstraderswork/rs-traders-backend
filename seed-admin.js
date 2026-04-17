import supabase from './utils/supabase.js'

async function seedAdminUser() {
  try {
    // Check if user already exists
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'rajesh@rstaders.com')
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('❌ Error checking user:', selectError)
      return
    }

    if (existingUser) {
      console.log('✅ Admin user exists:', existingUser)
      console.log('Password hash present:', !!existingUser.password_hash)
      // Update password if it's not the correct hash
      if (existingUser.password !== '$2a$10$zSC7NFHqO2cO9fVDNvON8eFeUnEXe4PwzzmNoWQJewjcbX0RkmJpO') {
        const { error: updateError } = await supabase
          .from('users')
          .update({ password: '$2a$10$zSC7NFHqO2cO9fVDNvON8eFeUnEXe4PwzzmNoWQJewjcbX0RkmJpO' })
          .eq('email', 'rajesh@rstaders.com')

        if (updateError) {
          console.error('❌ Error updating password:', updateError)
        } else {
          console.log('✅ Password updated to hashed version')
        }
      }      return
    }

    // Insert admin user
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: 'rajesh@rstaders.com',
        password: '$2a$10$zSC7NFHqO2cO9fVDNvON8eFeUnEXe4PwzzmNoWQJewjcbX0RkmJpO', // password123
        name: 'Rajesh Singh Jamwal',
        phone: '+919876543210'
      })
      .select()

    if (error) {
      console.error('❌ Error inserting admin user:', error)
    } else {
      console.log('✅ Admin user created successfully')
    }
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

seedAdminUser()