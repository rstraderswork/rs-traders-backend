import supabase from './utils/supabase.js'

async function recreateUser() {
  try {
    // Delete existing user
    await supabase.from('users').delete().eq('email', 'rajesh@rstaders.com');

    // Try to insert with explicit column specification
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: 'rajesh@rstaders.com',
        password: '$2a$10$hd8hpNhRc6xGb9qZrUUzZuUymAykbEhrbMqFKK1scwocmKFjS7pZa',
        name: 'Rajesh Singh Jamwal',
        phone: '+919876543210'
      });

    if (error) {
      console.error('Insert error:', error);
    } else {
      console.log('User inserted successfully');
    }

    // Check what was inserted
    const { data: checkData, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'rajesh@rstaders.com')
      .single();

    if (checkError) {
      console.error('Check error:', checkError);
    } else {
      console.log('User data after insert:', checkData);
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

recreateUser()