import bcrypt from 'bcryptjs'

const password = 'password123'

bcrypt.hash(password, 10).then(hash => {
  console.log('Generated hash:', hash)
}).catch(err => {
  console.error('Error:', err)
})