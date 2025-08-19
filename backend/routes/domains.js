const express = require('express');
const { body, validationResult, query } = require('express-validator');
const router = express.Router();

// Mock data for when database is not available
const mockDomains = [
  {
    id: 1,
    name: 'aitech.com',
    price: 15000,
    description: 'Premium domain for AI technology companies. Perfect for startups in artificial intelligence.',
    traffic_monthly: 5000,
    domain_age_years: 3,
    is_featured: true,
    seo_score: 85,
    backlinks_count: 150,
    keywords: ['ai', 'technology', 'artificial intelligence'],
    created_at: new Date('2024-01-15'),
    category: 'Technology',
    category_slug: 'technology',
    seller_name: 'John Smith',
    seller_company: 'Tech Ventures',
    views_count: 245,
    inquiries_count: 12
  },
  {
    id: 2,
    name: 'smartfinance.io',
    price: 8500,
    description: 'Ideal domain for fintech startups and financial services.',
    traffic_monthly: 2800,
    domain_age_years: 2,
    is_featured: true,
    seo_score: 78,
    backlinks_count: 89,
    keywords: ['finance', 'fintech', 'smart'],
    created_at: new Date('2024-02-01'),
    category: 'Finance',
    category_slug: 'finance',
    seller_name: 'Sarah Johnson',
    seller_company: 'FinDomains LLC',
    views_count: 189,
    inquiries_count: 8
  },
  {
    id: 3,
    name: 'healthtech.co',
    price: 12000,
    description: 'Perfect for healthcare technology companies and medical startups.',
    traffic_monthly: 3500,
    domain_age_years: 4,
    is_featured: false,
    seo_score: 82,
    backlinks_count: 120,
    keywords: ['health', 'medical', 'technology'],
    created_at: new Date('2024-01-20'),
    category: 'Healthcare',
    category_slug: 'healthcare',
    seller_name: 'Dr. Michael Chen',
    seller_company: 'MedDomains',
    views_count: 156,
    inquiries_count: 6
  }
];

const mockCategories = [
  { id: 1, name: 'Technology', slug: 'technology', domain_count: 45 },
  { id: 2, name: 'Finance', slug: 'finance', domain_count: 32 },
  { id: 3, name: 'Healthcare', slug: 'healthcare', domain_count: 28 },
  { id: 4, name: 'E-commerce', slug: 'ecommerce', domain_count: 38 },
  { id: 5, name: 'Education', slug: 'education', domain_count: 22 }
];

const mockStats = {
  totalDomains: 165,
  totalValue: 2450000,
  averagePrice: 14848,
  soldThisMonth: 23
};

// GET /api/domains - Get all domains with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isString(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('search').optional().isString(),
  query('featured').optional().isBoolean(),
  query('sortBy').optional().isIn(['price', 'name', 'created_at', 'traffic', 'featured']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      search,
      featured,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    // Check if database is available
    if (!req.app.locals.db || !req.app.locals.dbConnected()) {
      // Use mock data
      let filteredDomains = [...mockDomains];
      
      // Apply filters
      if (category && category !== 'all') {
        filteredDomains = filteredDomains.filter(d => d.category_slug === category);
      }
      if (minPrice) {
        filteredDomains = filteredDomains.filter(d => d.price >= parseFloat(minPrice));
      }
      if (maxPrice) {
        filteredDomains = filteredDomains.filter(d => d.price <= parseFloat(maxPrice));
      }
      if (search) {
        const searchLower = search.toLowerCase();
        filteredDomains = filteredDomains.filter(d => 
          d.name.toLowerCase().includes(searchLower) ||
          d.description.toLowerCase().includes(searchLower) ||
          d.keywords.some(k => k.toLowerCase().includes(searchLower))
        );
      }
      if (featured === 'true') {
        filteredDomains = filteredDomains.filter(d => d.is_featured);
      }
      
      // Apply sorting
      filteredDomains.sort((a, b) => {
        let aVal, bVal;
        switch (sortBy) {
          case 'price':
            aVal = a.price;
            bVal = b.price;
            break;
          case 'name':
            aVal = a.name;
            bVal = b.name;
            break;
          case 'traffic':
            aVal = a.traffic_monthly || 0;
            bVal = b.traffic_monthly || 0;
            break;
          case 'featured':
            aVal = a.is_featured ? 1 : 0;
            bVal = b.is_featured ? 1 : 0;
            break;
          default:
            aVal = new Date(a.created_at);
            bVal = new Date(b.created_at);
        }
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
      
      const total = filteredDomains.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const domains = filteredDomains.slice(startIndex, startIndex + parseInt(limit));
      
      return res.json({
        domains,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    }

    // Database is available, proceed with database queries
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    let whereConditions = ['d.status = $1'];
    let queryParams = ['active'];
    let paramCount = 1;

    if (category && category !== 'all') {
      paramCount++;
      whereConditions.push(`c.slug = $${paramCount}`);
      queryParams.push(category);
    }

    if (minPrice) {
      paramCount++;
      whereConditions.push(`d.price >= $${paramCount}`);
      queryParams.push(minPrice);
    }

    if (maxPrice) {
      paramCount++;
      whereConditions.push(`d.price <= $${paramCount}`);
      queryParams.push(maxPrice);
    }

    if (search) {
      paramCount++;
      whereConditions.push(`(d.name ILIKE $${paramCount} OR d.description ILIKE $${paramCount} OR d.keywords && ARRAY[$${paramCount}])`);
      queryParams.push(`%${search}%`);
    }

    if (featured === 'true') {
      whereConditions.push('d.is_featured = true');
    }

    const whereClause = whereConditions.join(' AND ');
    
    // Build ORDER BY clause
    let orderBy;
    switch (sortBy) {
      case 'price':
        orderBy = `d.price ${sortOrder.toUpperCase()}`;
        break;
      case 'name':
        orderBy = `d.name ${sortOrder.toUpperCase()}`;
        break;
      case 'traffic':
        orderBy = `d.traffic_monthly ${sortOrder.toUpperCase()} NULLS LAST`;
        break;
      case 'featured':
        orderBy = `d.is_featured ${sortOrder.toUpperCase()}, d.created_at DESC`;
        break;
      default:
        orderBy = `d.created_at ${sortOrder.toUpperCase()}`;
    }

    // Main query
    const query = `
      SELECT 
        d.id,
        d.name,
        d.price,
        d.description,
        d.traffic_monthly,
        d.domain_age_years,
        d.is_featured,
        d.seo_score,
        d.backlinks_count,
        d.keywords,
        d.created_at,
        c.name as category,
        c.slug as category_slug,
        u.first_name || ' ' || u.last_name as seller_name,
        u.company as seller_company,
        da.views_count,
        da.inquiries_count
      FROM domains d
      LEFT JOIN categories c ON d.category_id = c.id
      LEFT JOIN users u ON d.seller_id = u.id
      LEFT JOIN domain_analytics da ON d.id = da.domain_id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);

    // Count query for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM domains d
      LEFT JOIN categories c ON d.category_id = c.id
      WHERE ${whereClause}
    `;

    const [domainsResult, countResult] = await Promise.all([
      req.app.locals.db.query(query, queryParams),
      req.app.locals.db.query(countQuery, queryParams.slice(0, -2)) // Remove limit and offset
    ]);

    const domains = domainsResult.rows;
    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      domains,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

// GET /api/domains/featured - Get featured domains
router.get('/featured', async (req, res) => {
  try {
    // Check if database is available
    if (!req.app.locals.db || !req.app.locals.dbConnected()) {
      // Use mock data - filter for featured domains
      const featuredDomains = mockDomains.filter(d => d.is_featured).slice(0, 6);
      return res.json({ domains: featuredDomains });
    }

    const query = `
      SELECT 
        d.id,
        d.name,
        d.price,
        d.description,
        d.traffic_monthly,
        d.domain_age_years,
        d.seo_score,
        d.keywords,
        c.name as category,
        u.first_name || ' ' || u.last_name as seller_name,
        da.views_count
      FROM domains d
      LEFT JOIN categories c ON d.category_id = c.id
      LEFT JOIN users u ON d.seller_id = u.id
      LEFT JOIN domain_analytics da ON d.id = da.domain_id
      WHERE d.is_featured = true AND d.status = 'active'
      ORDER BY d.created_at DESC
      LIMIT 6
    `;

    const result = await req.app.locals.db.query(query);
    res.json({ domains: result.rows });

  } catch (error) {
    console.error('Error fetching featured domains:', error);
    res.status(500).json({ error: 'Failed to fetch featured domains' });
  }
});

// GET /api/domains/stats - Get marketplace statistics
router.get('/stats', async (req, res) => {
  try {
    // Check if database is available
    if (!req.app.locals.db || !req.app.locals.dbConnected()) {
      // Use mock stats
      const formattedStats = [
        { label: 'Domains Sold', value: mockStats.soldThisMonth.toLocaleString() },
        { label: 'Total Sales', value: `$${(mockStats.totalValue / 1000000).toFixed(1)}M` },
        { label: 'Active Listings', value: mockStats.totalDomains.toLocaleString() },
        { label: 'Happy Customers', value: '1,250' }
      ];
      return res.json({ stats: formattedStats });
    }

    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM domains WHERE status = 'sold') as domains_sold,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE payment_status = 'completed') as total_sales,
        (SELECT COUNT(*) FROM domains WHERE status = 'active') as active_listings,
        (SELECT COUNT(DISTINCT buyer_id) FROM transactions WHERE payment_status = 'completed') as happy_customers
    `;

    const result = await req.app.locals.db.query(statsQuery);
    const stats = result.rows[0];

    // Format the response
    const formattedStats = [
      { label: 'Domains Sold', value: stats.domains_sold.toLocaleString() },
      { label: 'Total Sales', value: `$${(stats.total_sales / 1000000).toFixed(1)}M` },
      { label: 'Active Listings', value: stats.active_listings.toLocaleString() },
      { label: 'Happy Customers', value: stats.happy_customers.toLocaleString() }
    ];

    res.json({ stats: formattedStats });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET /api/domains/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    // Check if database is available
    if (!req.app.locals.db || !req.app.locals.dbConnected()) {
      // Use mock categories
      return res.json({ categories: mockCategories });
    }

    const query = `
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        COUNT(d.id) as domain_count
      FROM categories c
      LEFT JOIN domains d ON c.id = d.category_id AND d.status = 'active'
      GROUP BY c.id, c.name, c.slug, c.description
      ORDER BY c.name
    `;

    const result = await req.app.locals.db.query(query);
    res.json({ categories: result.rows });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/domains/:id - Get single domain
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        d.*,
        c.name as category,
        c.slug as category_slug,
        u.first_name || ' ' || u.last_name as seller_name,
        u.company as seller_company,
        u.email as seller_email,
        da.views_count,
        da.inquiries_count
      FROM domains d
      LEFT JOIN categories c ON d.category_id = c.id
      LEFT JOIN users u ON d.seller_id = u.id
      LEFT JOIN domain_analytics da ON d.id = da.domain_id
      WHERE d.id = $1 AND d.status = 'active'
    `;

    const result = await req.app.locals.db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    // Update view count
    await req.app.locals.db.query(
      'UPDATE domain_analytics SET views_count = views_count + 1, last_viewed = CURRENT_TIMESTAMP WHERE domain_id = $1',
      [id]
    );

    res.json({ domain: result.rows[0] });

  } catch (error) {
    console.error('Error fetching domain:', error);
    res.status(500).json({ error: 'Failed to fetch domain' });
  }
});

// POST /api/domains - Create new domain listing (requires authentication)
router.post('/', [
  body('name').isLength({ min: 3, max: 255 }).withMessage('Domain name must be between 3 and 255 characters'),
  body('price').isFloat({ min: 1 }).withMessage('Price must be a positive number'),
  body('category_id').isInt({ min: 1 }).withMessage('Valid category ID is required'),
  body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('traffic_monthly').optional().isInt({ min: 0 }),
  body('domain_age_years').optional().isInt({ min: 0 }),
  body('keywords').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // TODO: Add authentication middleware to get seller_id from JWT token
    // For now, using a default seller_id
    const seller_id = 1;

    const {
      name,
      price,
      category_id,
      description,
      traffic_monthly,
      domain_age_years,
      keywords
    } = req.body;

    const query = `
      INSERT INTO domains (
        name, price, category_id, description, traffic_monthly, 
        domain_age_years, seller_id, keywords
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      name,
      price,
      category_id,
      description,
      traffic_monthly || null,
      domain_age_years || null,
      seller_id,
      keywords || []
    ];

    const result = await req.app.locals.db.query(query, values);
    
    // Create analytics entry
    await req.app.locals.db.query(
      'INSERT INTO domain_analytics (domain_id) VALUES ($1)',
      [result.rows[0].id]
    );

    res.status(201).json({ domain: result.rows[0] });

  } catch (error) {
    console.error('Error creating domain:', error);
    if (error.code === '23505') { // Unique violation
      res.status(409).json({ error: 'Domain name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create domain listing' });
    }
  }
});

// Generate domain suggestions using OpenAI
router.post('/generate', [
  body('keywords').isLength({ min: 1, max: 200 }).withMessage('Keywords are required and must be under 200 characters'),
  body('industry').optional().isString().isLength({ max: 100 }).withMessage('Industry must be under 100 characters'),
  body('count').optional().isInt({ min: 1, max: 20 }).withMessage('Count must be between 1 and 20')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { keywords, industry = '', count = 10 } = req.body;

    // Check if OpenAI is configured with a valid API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your_openai_api_key_here' || process.env.OPENAI_API_KEY.startsWith('sk-your_')) {
      // Return mock generated domains if OpenAI is not configured
      const mockGeneratedDomains = [
        { name: 'aiventure.com', available: true, price: 12000, description: 'Perfect for AI venture capital and startup companies' },
        { name: 'smarttech.io', available: true, price: 8500, description: 'Ideal for smart technology solutions and IoT startups' },
        { name: 'innovateai.co', available: false, price: null, description: 'Great for AI innovation companies' },
        { name: 'techstartup.ai', available: true, price: 15000, description: 'Premium domain for technology startups' },
        { name: 'futuretech.com', available: true, price: 18000, description: 'Perfect for future technology companies' }
      ];
      
      return res.json({
        suggestions: mockGeneratedDomains.slice(0, count),
        keywords,
        industry
      });
    }

    // OpenAI integration for domain generation
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `Generate ${count} creative and brandable domain name suggestions for a startup in the ${industry || 'technology'} industry with these keywords: ${keywords}. 

For each domain suggestion, provide:
1. Domain name (with appropriate TLD like .com, .io, .ai, .co)
2. Brief description of why it's suitable
3. Estimated market value (between $5,000 - $50,000)

Return the response as a JSON array with objects containing: name, description, price, available (randomly true/false)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: prompt
      }],
      max_tokens: 1500,
      temperature: 0.8
    });

    let suggestions;
    try {
      suggestions = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // Fallback to mock data if parsing fails
      suggestions = [
        { name: 'aiventure.com', available: true, price: 12000, description: 'Perfect for AI venture capital and startup companies' },
        { name: 'smarttech.io', available: true, price: 8500, description: 'Ideal for smart technology solutions and IoT startups' }
      ];
    }

    res.json({
      suggestions,
      keywords,
      industry
    });

  } catch (error) {
    console.error('Error generating domains:', error);
    res.status(500).json({ error: 'Failed to generate domain suggestions' });
  }
});

module.exports = router;