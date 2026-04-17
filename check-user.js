import supabase from './utils/supabase.js'

async function checkUser() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'rajesh@rstaders.com')
      .single()

    if (error) {
      console.error('Error:', error)
    } else {
      console.log('User data:', data)
    }
  } catch (err) {
    console.error('Error:', err.message)
  }
}

checkUser()