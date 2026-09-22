require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const http = require('http')

// ── Local file logging (logs/app.log) ──
const { appendFileSync, mkdirSync, existsSync } = require('fs')
const logsDir = require('path').join(__dirname, 'logs')
if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true })
function writeLog(level, message) {
  const timeStr = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 19)
  const line = `[${timeStr}] [${level}] ${message}\n`
  try {
    appendFileSync(require('path').join(logsDir, 'app.log'), line)
  } catch (err) {
    // Fallback: log file write failure to stderr to avoid silent data loss
    process.stderr.write(`[writeLog] Failed to write log: ${err.message}\n`)
  }
}

const app = express()
const PORT = process.env.PORT || 3002
const JWT_SECRET = process.env.JWT_SECRET || 'porto-secret-key-change-in-production'
const DIST_PATH = path.join(__dirname, '..', 'dist')

// ── Security Headers (helmet) ──
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
}))
app.disable('x-powered-by')

// ── CORS ──
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
    : ['https://berakun.web.id', 'http://localhost:1370', 'http://localhost:3002'],
  credentials: true,
}))

// ── Body parsers ──
app.use(express.json())
app.use(cookieParser())

// ── Rate Limiters ──
// Shared IP key generator for all rate limiters
function getClientKey(req) {
  return req.headers['cf-connecting-ip']
    || req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.socket.remoteAddress
    || 'unknown'
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5,                    // 5 attempts gagal
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientKey,
})

const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 5,               // 5 request per IP
  message: { error: 'Too many requests. Slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientKey,
})

// ── Input sanitization ──
function stripTags(str) {
  if (typeof str !== 'string') return ''
  return str.replace(/<[^>]*>/g, '').replace(/[<>]/g, '')
}
function sanitize(obj, fields) {
  const out = {}
  for (const k of fields) {
    if (obj[k] !== undefined) out[k] = stripTags(String(obj[k]))
    else out[k] = ''
  }
  return out
}

// ── MySQL connection pool ──
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'qwerty123',
  database: process.env.DB_NAME || 'porto',
  waitForConnections: true,
  connectionLimit: 5,
  dateStrings: true,
  timezone: '+07:00',
})

// ── Initialize database and tables ──
async function initDB() {
  try {
    await pool.query('CREATE DATABASE IF NOT EXISTS porto')
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)
    await pool.query(`CREATE TABLE IF NOT EXISTS portfolio_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      data_key VARCHAR(50) UNIQUE NOT NULL,
      data_value JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)
    await pool.query(`CREATE TABLE IF NOT EXISTS visitor_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ip VARCHAR(45) NOT NULL,
      country VARCHAR(100) DEFAULT '',
      city VARCHAR(100) DEFAULT '',
      isp VARCHAR(150) DEFAULT '',
      browser VARCHAR(100) DEFAULT '',
      os VARCHAR(100) DEFAULT '',
      referrer VARCHAR(500) DEFAULT '',
      page VARCHAR(500) DEFAULT '/',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_created (created_at),
      INDEX idx_ip (ip)
    )`)

    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', ['berakun'])
    if (existing.length === 0) {
      const hash = await bcrypt.hash('qwerty123', 10)
      await pool.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', ['berakun', hash])
      writeLog('INFO', 'Default admin user created: berakun')
    }

    const [catExisting] = await pool.query('SELECT id FROM portfolio_data WHERE data_key = ?', ['expertise_categories'])
    if (catExisting.length === 0) {
      const defaultCategories = JSON.stringify([
        { id: 'development', label: '01. DEVELOPMENT' },
        { id: 'chatbot', label: '02. CHATBOT' },
        { id: 'database', label: '03. DATABASE' }
      ])
      await pool.query('INSERT INTO portfolio_data (data_key, data_value) VALUES (?, ?)', ['expertise_categories', defaultCategories])
      writeLog('INFO', 'Default expertise categories seeded')
    }

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
      writeLog('INFO', 'Default expertise seeded')
    }

    const [oldExpExisting] = await pool.query('SELECT id FROM portfolio_data WHERE data_key = ?', ['experiences'])
    if (oldExpExisting.length === 0) {
      const defaultExperiences = JSON.stringify([
        { id: 1, title: 'KCM Interior Design', role: 'Full-stack Developer', description: 'Interior design platform with admin dashboard, GPS attendance system, RAB management, and financial reporting. Built with Vue.js frontend and PHP Laravel backend.', icon: 'business', tags: ['Vue.js', 'Laravel', 'MySQL'] },
        { id: 2, title: 'Chatbot AI Platform', role: 'Chatbot AI Developer @ Botika', description: 'Enterprise chatbot platform with multi-channel integrations (WhatsApp, Telegram, Web, Facebook Messenger). JavaScript-based agentic architecture with custom monitoring dashboards.', icon: 'smart_toy', tags: ['JavaScript', 'Conversational AI', 'Multi-channel'] },
        { id: 3, title: 'Custom Dashboards', role: 'Full-stack Developer @ Botika', description: 'Monitoring and analytics dashboards for chatbot performance tracking. Real-time data visualization and reporting tools for enterprise clients.', icon: 'dashboard', tags: ['Vue.js', 'PHP', 'MySQL'] },
        { id: 4, title: 'Omni CRM', role: 'Full-stack Developer', description: 'Omnichannel CRM with ticketing system, inbox management, and dashboard reports. Real-time messaging with Socket.io integration.', icon: 'support_agent', tags: ['Vue 3', 'Express', 'Socket.io'] }
      ])
      await pool.query('INSERT INTO portfolio_data (data_key, data_value) VALUES (?, ?)', ['experiences', defaultExperiences])
      writeLog('INFO', 'Default experiences seeded')
    }

    writeLog('INFO', 'Database initialized successfully')
  } catch (error) {
    writeLog('ERROR', `Database initialization error: ${error.message}`)
  }
}

// ── Auth middleware ──
// Reads token from HttpOnly cookie first, then Authorization header (backward compat)
const authMiddleware = async (req, res, next) => {
  let token = null
  if (req.cookies?.token) {
    token = req.cookies.token
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// ── Auth Endpoints ──

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' })

    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' })

    const user = users[0]
    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
    // Set HttpOnly cookie ONLY — jangan kirim token di JSON body
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
      path: '/',
    })
    res.json({ success: true, username: user.username })
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

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token', { path: '/' })
  res.json({ success: true, message: 'Logged out' })
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

// ── Experience Endpoints ──

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

// ── Work Tracing Endpoints ──

// GET work-tracing (public — landing page reads without auth)
app.get('/api/work-tracing', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM work_tracing ORDER BY sort_order ASC, start_date DESC')
    rows.forEach(r => { if (typeof r.tags === 'string') r.tags = JSON.parse(r.tags); else if (!Array.isArray(r.tags)) r.tags = [] })
    res.json(rows)
  } catch (error) {
    console.error('Get work tracing error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/work-tracing', authMiddleware, async (req, res) => {
  try {
    const { title, company, type, location, start_date, end_date, is_current, description, tags } = req.body
    if (!title || !company || !start_date) return res.status(400).json({ error: 'title, company, start_date required' })
    const formatDate = (d) => {
      if (!d) return null
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d
      const date = new Date(d)
      return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0]
    }
    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : (tags || []))
    const [result] = await pool.query(
      'INSERT INTO work_tracing (title, company, type, location, start_date, end_date, is_current, description, tags, sort_order) VALUES (?,?,?,?,?,?,?,?,?,0)',
      [title, company, type||'full-time', location||'', formatDate(start_date), formatDate(end_date), is_current||false, description||'', tagsJson]
    )
    const [rows] = await pool.query('SELECT * FROM work_tracing WHERE id = ?', [result.insertId])
    rows[0].tags = typeof rows[0].tags === 'string' ? JSON.parse(rows[0].tags || '[]') : (Array.isArray(rows[0].tags) ? rows[0].tags : [])
    res.json({ success: true, item: rows[0] })
  } catch (error) {
    console.error('Add work tracing error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.put('/api/work-tracing/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { title, company, type, location, start_date, end_date, is_current, description, tags, sort_order } = req.body
    const formatDate = (d) => {
      if (!d) return null
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d
      const date = new Date(d)
      return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0]
    }
    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : (tags || []))
    await pool.query(
      'UPDATE work_tracing SET title=?, company=?, type=?, location=?, start_date=?, end_date=?, is_current=?, description=?, tags=?, sort_order=? WHERE id=?',
      [title, company, type||'full-time', location||'', formatDate(start_date), formatDate(end_date), is_current||false, description||'', tagsJson, sort_order||0, id]
    )
    const [rows] = await pool.query('SELECT * FROM work_tracing WHERE id = ?', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
    rows[0].tags = typeof rows[0].tags === 'string' ? JSON.parse(rows[0].tags || '[]') : (Array.isArray(rows[0].tags) ? rows[0].tags : [])
    res.json({ success: true, item: rows[0] })
  } catch (error) {
    console.error('Update work tracing error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.delete('/api/work-tracing/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM work_tracing WHERE id = ?', [id])
    res.json({ success: true })
  } catch (error) {
    console.error('Delete work tracing error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ── Expertise Endpoints ──

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

// ── Visitor Tracking ──

const geoCache = new Map()

function lookupGeo(ip) {
  return new Promise((resolve) => {
    if (geoCache.has(ip)) return resolve(geoCache.get(ip))
    if (!ip || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      const fallback = { country: 'Local', city: '', isp: '' }
      geoCache.set(ip, fallback)
      return resolve(fallback)
    }
    const geoApiUrl = process.env.GEO_API_URL || 'http://ip-api.com/json'
    const req = http.get(`${geoApiUrl}/${ip}?fields=status,country,city,isp`, { timeout: 3000 }, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try {
          const j = JSON.parse(data)
          const geo = j.status === 'success' ? { country: j.country || '', city: j.city || '', isp: j.isp || '' } : { country: '', city: '', isp: '' }
          geoCache.set(ip, geo)
          resolve(geo)
        } catch { resolve({ country: '', city: '', isp: '' }) }
      })
    })
    req.on('error', () => resolve({ country: '', city: '', isp: '' }))
    req.on('timeout', () => { req.destroy(); resolve({ country: '', city: '', isp: '' }) })
  })
}

function parseUA(ua) {
  if (!ua) return { browser: '', os: '' }
  let browser = 'Unknown'
  if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Edg/')) browser = 'Edge'
  else if (ua.includes('OPR/')) browser = 'Opera'
  else if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari')) browser = 'Safari'
  let os = 'Unknown'
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac OS X')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  return { browser, os }
}

function getClientIP(req) {
  return req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress?.replace('::ffff:', '') || ''
}

// POST /api/track — public, logs a visit
app.post('/api/track', async (req, res) => {
  try {
    const ip = getClientIP(req)
    const { page, referrer } = req.body || {}
    const ua = req.headers['user-agent'] || ''
    const { browser, os } = parseUA(ua)
    const geo = await lookupGeo(ip)
    await pool.query(
      'INSERT INTO visitor_logs (ip, country, city, isp, browser, os, referrer, page) VALUES (?,?,?,?,?,?,?,?)',
      [ip, geo.country, geo.city, geo.isp, browser, os, referrer || '', page || '/']
    )
    res.json({ success: true })
  } catch (error) {
    console.error('Track error:', error)
    res.json({ success: false })
  }
})

// ── Analytics query builder (parameterized, no string concat) ──
function buildDateFilter(startDate, endDate) {
  const conditions = []
  const params = []
  if (startDate) {
    conditions.push('created_at >= ?')
    params.push(startDate + ' 00:00:00')
  }
  if (endDate) {
    conditions.push('created_at <= ?')
    params.push(endDate + ' 23:59:59')
  }
  return { conditions, params }
}

function buildWhere(conditions, extraConditions = []) {
  const all = [...conditions, ...extraConditions]
  return all.length > 0 ? ` WHERE ${all.join(' AND ')}` : ''
}

// GET /api/analytics — auth required, returns aggregated stats
app.get('/api/analytics', authMiddleware, async (req, res) => {
  try {
    const { start_date, end_date } = req.query
    const { conditions, params: dateParams } = buildDateFilter(start_date, end_date)

    const [todayRows] = await pool.query(
      "SELECT COUNT(DISTINCT ip) as count FROM visitor_logs WHERE DATE(created_at) = CURDATE()"
    )

    const totalVisitsSQL = 'SELECT COUNT(*) as count FROM visitor_logs' + buildWhere(conditions)
    const [totalVisits] = await pool.query(totalVisitsSQL, dateParams)

    const uniqueIPsSQL = 'SELECT COUNT(DISTINCT ip) as count FROM visitor_logs' + buildWhere(conditions)
    const [uniqueIPs] = await pool.query(uniqueIPsSQL, dateParams)

    const countriesSQL = 'SELECT country, COUNT(*) as visits, COUNT(DISTINCT ip) as unique_visitors FROM visitor_logs' + buildWhere(conditions, ['country != ""']) + ' GROUP BY country ORDER BY visits DESC LIMIT 20'
    const [countries] = await pool.query(countriesSQL, dateParams)

    const browsersSQL = 'SELECT browser, COUNT(*) as count FROM visitor_logs' + buildWhere(conditions, ['browser != ""']) + ' GROUP BY browser ORDER BY count DESC'
    const [browsers] = await pool.query(browsersSQL, dateParams)

    const osSQL = 'SELECT os, COUNT(*) as count FROM visitor_logs' + buildWhere(conditions, ['os != ""']) + ' GROUP BY os ORDER BY count DESC'
    const [osList] = await pool.query(osSQL, dateParams)

    const referrersSQL = 'SELECT referrer, COUNT(*) as count FROM visitor_logs' + buildWhere(conditions, ['referrer != ""', 'referrer != "Direct"']) + ' GROUP BY referrer ORDER BY count DESC LIMIT 10'
    const [referrers] = await pool.query(referrersSQL, dateParams)

    const dailyVisitsSQL = conditions.length > 0
      ? 'SELECT DATE(created_at) as date, COUNT(*) as visits, COUNT(DISTINCT ip) as unique_visitors FROM visitor_logs' + buildWhere(conditions) + ' GROUP BY DATE(created_at) ORDER BY date'
      : 'SELECT DATE(created_at) as date, COUNT(*) as visits, COUNT(DISTINCT ip) as unique_visitors FROM visitor_logs WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY date'
    const [dailyVisits] = await pool.query(dailyVisitsSQL, dateParams)

    const recentSQL = 'SELECT ip, country, city, isp, browser, os, referrer, page, created_at FROM visitor_logs' + buildWhere(conditions) + ' ORDER BY created_at DESC LIMIT 50'
    const [recentRows] = await pool.query(recentSQL, dateParams)
    // Convert MySQL timestamp string (UTC) to ISO format for proper JS Date parsing
    const recent = recentRows.map(r => ({
      ...r,
      created_at: r.created_at ? new Date(r.created_at + 'Z').toISOString() : null
    }))

    res.json({
      todayVisitors: todayRows[0].count,
      totalVisits: totalVisits[0].count,
      uniqueVisitors: uniqueIPs[0].count,
      countries,
      browsers,
      operatingSystems: osList,
      referrers,
      dailyVisits,
      recent
    })
  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ── Contact Messages ──
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const body = sanitize(req.body, ['name', 'phone', 'project_type', 'message'])
    if (!body.name || !body.project_type || !body.message) {
      return res.status(400).json({ error: 'Name, project type, and message are required' })
    }
    await pool.query(
      'INSERT INTO contact_messages (name, phone, project_type, message) VALUES (?, ?, ?, ?)',
      [body.name, body.phone || '', body.project_type, body.message]
    )
    res.json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('Contact message error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/contact-messages', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC')
    res.json(rows)
  } catch (error) {
    console.error('Fetch messages error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.patch('/api/contact-messages/:id/read', authMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE contact_messages SET is_read = TRUE WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (_err) {
    writeLog('ERROR', `Mark message read error: ${_err.message}`)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.delete('/api/contact-messages/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (error) {
    console.error('Delete message error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Static file serving (Vue frontend) ──
app.use(express.static(DIST_PATH))
app.get('{*path}', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(DIST_PATH, 'index.html'))
  }
})

// ── Start server ──
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    writeLog('INFO', `Portfolio auth server started on port ${PORT}`);
    writeLog('INFO', `Portfolio server running on port ${PORT}`)
  })
})

// Global error handlers
process.on('uncaughtException', (err) => { writeLog('ERROR', `Uncaught: ${err.message}`); console.error(err); });
process.on('unhandledRejection', (err) => { writeLog('ERROR', `Unhandled rejection: ${err}`); console.error(err); });
