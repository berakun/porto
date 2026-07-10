require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3002
const JWT_SECRET = process.env.JWT_SECRET || 'porto-secret-key-change-in-production'
const DIST_PATH = path.join(__dirname, '..', 'dist')

app.use(cors({
  origin: ['https://berakun.web.id', 'http://localhost:1370', 'http://localhost:3002'],
  credentials: true
}))
app.use(express.json())

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'qwerty123',
  database: process.env.DB_NAME || 'porto',
  waitForConnections: true,
  connectionLimit: 5
})

// Initialize database and tables
async function initDB() {
  try {
    await pool.query('CREATE DATABASE IF NOT EXISTS porto')

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Create portfolio_data table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS portfolio_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data_key VARCHAR(50) UNIQUE NOT NULL,
        data_value JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Check if default admin exists
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', ['berakun'])
    if (existing.length === 0) {
      const hash = await bcrypt.hash('qwerty123', 10)
      await pool.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', ['berakun', hash])
      console.log('Default admin user created: berakun/qwerty123')
    }

    // Seed default expertise categories if empty
    const [catExisting] = await pool.query('SELECT id FROM portfolio_data WHERE data_key = ?', ['expertise_categories'])
    if (catExisting.length === 0) {
      const defaultCategories = JSON.stringify([
        { id: 'development', label: '01. DEVELOPMENT' },
        { id: 'chatbot', label: '02. CHATBOT' },
        { id: 'database', label: '03. DATABASE' }
      ])
      await pool.query('INSERT INTO portfolio_data (data_key, data_value) VALUES (?, ?)', ['expertise_categories', defaultCategories])
      console.log('Default expertise categories seeded')
    }

    // Seed default expertise items if empty
    const [expExisting] = await pool.query('SELECT id FROM portfolio_data WHERE data_key = ?', ['expertise'])
    if (expExisting.length === 0) {
      const defaultExpertise = JSON.stringify([
        { id: 1, category: 'development', icon: 'code', title: 'Web Development', description: 'Building responsive web applications with modern frontend frameworks.', tags: ['Vue.js', 'React', 'JavaScript', 'Tailwind CSS', 'HTML/CSS'] },
        { id: 2, category: 'development', icon: 'dns', title: 'APIs & Backend', description: 'Developing RESTful API interfaces and backend services.', tags: ['PHP', 'Laravel', 'Node.js', 'REST APIs'] },
        { id: 3, category: 'development', icon: 'settings_suggest', title: 'Tools & Version Control', description: 'Managing codebases and ensuring code quality.', tags: ['Git', 'Linux'] },
        { id: 4, category: 'chatbot', icon: 'forum', title: 'Conversational AI', description: 'Building intelligent chatbot systems with AI-powered conversational flows.', tags: ['Conversational AI', 'Chatbot Development'] },
        { id: 5, category: 'chatbot', icon: 'smart_toy', title: 'Chatbot Integration', description: 'Developing multi-channel chatbot platforms across WhatsApp, Telegram, Web, and Facebook Messenger.', tags: ['Multi-channel', 'JavaScript', 'REST APIs'] },
        { id: 6, category: 'database', icon: 'storage', title: 'Database Management', description: 'Designing and optimizing relational databases for web applications.', tags: ['MySQL'] }
      ])
      await pool.query('INSERT INTO portfolio_data (data_key, data_value) VALUES (?, ?)', ['expertise', defaultExpertise])
      console.log('Default expertise seeded')
    }

    // Seed default experiences if empty
    const [oldExpExisting] = await pool.query('SELECT id FROM portfolio_data WHERE data_key = ?', ['experiences'])
    if (oldExpExisting.length === 0) {
      const defaultExperiences = JSON.stringify([
        { id: 1, title: 'KCM Interior Design', role: 'Full-stack Developer', description: 'Interior design platform with admin dashboard, GPS attendance system, RAB management, and financial reporting. Built with Vue.js frontend and PHP Laravel backend.', icon: 'business', tags: ['Vue.js', 'Laravel', 'MySQL'] },
        { id: 2, title: 'Chatbot AI Platform', role: 'Chatbot AI Developer @ Botika', description: 'Enterprise chatbot platform with multi-channel integrations (WhatsApp, Telegram, Web, Facebook Messenger). JavaScript-based agentic architecture with custom monitoring dashboards.', icon: 'smart_toy', tags: ['JavaScript', 'Conversational AI', 'Multi-channel'] },
        { id: 3, title: 'Custom Dashboards', role: 'Full-stack Developer @ Botika', description: 'Monitoring and analytics dashboards for chatbot performance tracking. Real-time data visualization and reporting tools for enterprise clients.', icon: 'dashboard', tags: ['Vue.js', 'PHP', 'MySQL'] },
        { id: 4, title: 'Omni CRM', role: 'Full-stack Developer', description: 'Omnichannel CRM with ticketing system, inbox management, and dashboard reports. Real-time messaging with Socket.io integration.', icon: 'support_agent', tags: ['Vue 3', 'Express', 'Socket.io'] }
      ])
      await pool.query('INSERT INTO portfolio_data (data_key, data_value) VALUES (?, ?)', ['experiences', defaultExperiences])
      console.log('Default experiences seeded')
    }

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

// Auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// === Auth Endpoints ===

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' })

    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' })

    const user = users[0]
    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ success: true, token, username: user.username })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/auth/verify', authMiddleware, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, username FROM users WHERE id = ?', [req.userId])
    if (users.length === 0) return res.status(401).json({ error: 'User not found' })
    res.json({ success: true, username: users[0].username })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/auth/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Current and new password required' })
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.userId])
    if (users.length === 0) return res.status(404).json({ error: 'User not found' })

    const validPassword = await bcrypt.compare(currentPassword, users[0].password_hash)
    if (!validPassword) return res.status(401).json({ error: 'Current password is incorrect' })

    const newHash = await bcrypt.hash(newPassword, 10)
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.userId])
    res.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// === Experience Endpoints ===

// GET experiences (public — landing page reads without auth)
app.get('/api/experiences', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT data_value FROM portfolio_data WHERE data_key = ?', ['experiences'])
    if (rows.length === 0) return res.json([])
    const data = rows[0].data_value
    res.json(typeof data === 'string' ? JSON.parse(data) : data)
  } catch (error) {
    console.error('Get experiences error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT experiences (auth required — admin saves)
app.put('/api/experiences', authMiddleware, async (req, res) => {
  try {
    const { experiences } = req.body
    if (!Array.isArray(experiences)) return res.status(400).json({ error: 'Experiences must be an array' })
    const jsonData = JSON.stringify(experiences)
    await pool.query(
      'INSERT INTO portfolio_data (data_key, data_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE data_value = VALUES(data_value)',
      ['experiences', jsonData]
    )
    res.json({ success: true, count: experiences.length })
  } catch (error) {
    console.error('Update experiences error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// === Expertise Endpoints ===

// GET expertise (public — landing page reads without auth)
app.get('/api/expertise', async (req, res) => {
  try {
    const [items] = await pool.query('SELECT data_value FROM portfolio_data WHERE data_key = ?', ['expertise'])
    const [cats] = await pool.query('SELECT data_value FROM portfolio_data WHERE data_key = ?', ['expertise_categories'])
    const expertise = items.length > 0 ? (typeof items[0].data_value === 'string' ? JSON.parse(items[0].data_value) : items[0].data_value) : []
    const categories = cats.length > 0 ? (typeof cats[0].data_value === 'string' ? JSON.parse(cats[0].data_value) : cats[0].data_value) : []
    res.json({ expertise, categories })
  } catch (error) {
    console.error('Get expertise error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT expertise (auth required — admin saves)
app.put('/api/expertise', authMiddleware, async (req, res) => {
  try {
    const { expertise, categories } = req.body
    if (Array.isArray(expertise)) {
      await pool.query(
        'INSERT INTO portfolio_data (data_key, data_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE data_value = VALUES(data_value)',
        ['expertise', JSON.stringify(expertise)]
      )
    }
    if (Array.isArray(categories)) {
      await pool.query(
        'INSERT INTO portfolio_data (data_key, data_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE data_value = VALUES(data_value)',
        ['expertise_categories', JSON.stringify(categories)]
      )
    }
    res.json({ success: true })
  } catch (error) {
    console.error('Update expertise error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// === Health check ===
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// === Static file serving (Vue frontend) ===
app.use(express.static(DIST_PATH))
app.get('{*path}', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(DIST_PATH, 'index.html'))
  }
})

// Start server
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running on port ${PORT}`)
  })
})
