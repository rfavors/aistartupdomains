const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { Pool } = require('pg');

// Import routes
const domainsRoutes = require('./routes/domains');
const usersRoutes = require('./routes/users');
const emailRoutes = require('./routes/email');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
let pool = null;
let dbConnected = false;

// Try to connect to database, but continue without it if connection fails
try {
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'ai_startup_domains',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  });

  // Test database connection
  pool.connect((err, client, release) => {
    if (err) {
      console.warn('⚠️  Database connection failed, running in mock mode:', err.message);
      console.log('📝 To connect to database, ensure PostgreSQL is running and credentials are correct');
      pool = null;
      dbConnected = false;
    } else {
      console.log('✅ Connected to PostgreSQL database');
      dbConnected = true;
      release();
    }
  });
} catch (error) {
  console.warn('⚠️  Database setup failed, running in mock mode:', error.message);
  pool = null;
  dbConnected = false;
}

// Make pool and connection status available to routes
app.locals.db = pool;
app.locals.dbConnected = () => dbConnected;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/domains', domainsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/ai', require('./routes/ai'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;