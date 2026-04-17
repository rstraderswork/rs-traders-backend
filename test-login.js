import http from 'http'

const BASE_URL = 'localhost'
const PORT = 3000

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          })
        } catch {
          resolve({
            status: res.statusCode,
            data: data
          })
        }
      })
    })

    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

async function testLogin() {
  console.log('🔐 Testing Login...')

  try {
    const result = await makeRequest('/auth/login', 'POST', {
      email: 'rajesh@rstaders.com',
      password: 'password123'
    })

    console.log(`Status: ${result.status}`)
    if (result.status === 200) {
      console.log('✅ Login successful!')
      console.log('Token received:', result.data.token ? 'Yes' : 'No')
    } else {
      console.log('❌ Login failed:', result.data)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testLogin()