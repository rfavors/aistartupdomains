const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// POST /api/email/subscribe - Subscribe to newsletter/waitlist
router.post('/subscribe', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('list_type').optional().isIn(['newsletter', 'vip_waitlist', 'content_calendar']).withMessage('Invalid list type'),
  body('first_name').optional().isLength({ min: 1, max: 100 }),
  body('last_name').optional().isLength({ max: 100 }),
  body('source').optional().isLength({ max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      email, 
      list_type = 'newsletter', 
      first_name = '', 
      last_name = '', 
      source = 'website' 
    } = req.body;

    // Check if database is connected
    if (!req.app.locals.db || !req.app.locals.dbConnected()) {
      // Mock response when database is not available
      let message = 'Successfully subscribed to newsletter!';
      if (list_type === 'vip_waitlist') {
        message = 'Welcome to the VIP waitlist! You\'ll get early access to hot domain drops.';
      } else if (list_type === 'content_calendar') {
        message = 'Thanks for subscribing! Your free 30-day content calendar will be sent shortly.';
      }

      return res.status(201).json({
        message,
        subscriber: {
          id: Math.floor(Math.random() * 1000) + 1,
          email,
          list_type,
          subscribed_at: new Date().toISOString()
        }
      });
    }

    // Check if email already exists for this list type
    const existingSubscriber = await req.app.locals.db.query(
      'SELECT id FROM email_subscribers WHERE email = $1 AND list_type = $2',
      [email, list_type]
    );

    if (existingSubscriber.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Email already subscribed to this list',
        message: 'You are already subscribed to this list!' 
      });
    }

    // Insert new subscriber
    const query = `
      INSERT INTO email_subscribers (email, list_type, first_name, last_name, source, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING id, email, list_type, created_at
    `;

    const result = await req.app.locals.db.query(query, [
      email, list_type, first_name, last_name, source
    ]);

    const subscriber = result.rows[0];

    // Here you would integrate with your email service (ConvertKit, Beehiiv, etc.)
    // await addToEmailService(email, list_type, first_name, last_name);

    let message = 'Successfully subscribed to newsletter!';
    if (list_type === 'vip_waitlist') {
      message = 'Welcome to the VIP waitlist! You\'ll get early access to hot domain drops.';
    } else if (list_type === 'content_calendar') {
      message = 'Thanks for subscribing! Your free 30-day content calendar will be sent shortly.';
    }

    res.status(201).json({
      message,
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        list_type: subscriber.list_type,
        subscribed_at: subscriber.created_at
      }
    });

  } catch (error) {
    console.error('Error subscribing email:', error);
    res.status(500).json({ error: 'Failed to subscribe email' });
  }
});

// POST /api/email/unsubscribe - Unsubscribe from newsletter
router.post('/unsubscribe', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('list_type').optional().isIn(['newsletter', 'vip_waitlist', 'content_calendar'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, list_type } = req.body;

    // Check if database is connected
    if (!req.app.locals.db || !req.app.locals.dbConnected()) {
      // Mock response when database is not available
      return res.status(200).json({
        message: 'Successfully unsubscribed from ' + (list_type || 'all lists'),
        email
      });
    }

    let query, params;
    if (list_type) {
      query = 'UPDATE email_subscribers SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 AND list_type = $3';
      params = ['unsubscribed', email, list_type];
    } else {
      // Unsubscribe from all lists
      query = 'UPDATE email_subscribers SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2';
      params = ['unsubscribed', email];
    }

    const result = await req.app.locals.db.query(query, params);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Email not found in our records' });
    }

    res.json({ message: 'Successfully unsubscribed from email list' });

  } catch (error) {
    console.error('Error unsubscribing email:', error);
    res.status(500).json({ error: 'Failed to unsubscribe email' });
  }
});

// GET /api/email/subscribers - Get subscriber statistics (admin only)
router.get('/subscribers', async (req, res) => {
  try {
    const { list_type, status = 'active' } = req.query;

    // Check if database is connected
    if (!req.app.locals.db || !req.app.locals.dbConnected()) {
      // Mock response when database is not available
      const mockStats = {
        daily_stats: [
          { list_type: 'newsletter', count: 45, date: new Date().toISOString().split('T')[0] },
          { list_type: 'vip_waitlist', count: 23, date: new Date().toISOString().split('T')[0] },
          { list_type: 'content_calendar', count: 12, date: new Date().toISOString().split('T')[0] }
        ],
        totals: {
          newsletter: 1250,
          vip_waitlist: 890,
          content_calendar: 456
        }
      };

      if (list_type) {
        mockStats.daily_stats = mockStats.daily_stats.filter(stat => stat.list_type === list_type);
      }

      return res.json(mockStats);
    }

    let query = `
      SELECT 
        list_type,
        COUNT(*) as count,
        DATE_TRUNC('day', created_at) as date
      FROM email_subscribers 
      WHERE status = $1
    `;
    let params = [status];

    if (list_type) {
      query += ' AND list_type = $2';
      params.push(list_type);
    }

    query += `
      GROUP BY list_type, DATE_TRUNC('day', created_at)
      ORDER BY date DESC, list_type
      LIMIT 100
    `;

    const result = await req.app.locals.db.query(query, params);

    // Also get total counts by list type
    const totalQuery = `
      SELECT 
        list_type,
        COUNT(*) as total_count
      FROM email_subscribers 
      WHERE status = $1
      ${list_type ? 'AND list_type = $2' : ''}
      GROUP BY list_type
    `;

    const totalResult = await req.app.locals.db.query(totalQuery, params.slice(0, list_type ? 2 : 1));

    res.json({
      daily_stats: result.rows,
      totals: totalResult.rows
    });

  } catch (error) {
    console.error('Error fetching subscriber stats:', error);
    res.status(500).json({ error: 'Failed to fetch subscriber statistics' });
  }
});

// POST /api/email/contact - Contact form submission
router.post('/contact', [
  body('name').isLength({ min: 1, max: 100 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').isLength({ min: 1, max: 200 }).withMessage('Subject is required'),
  body('message').isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10-2000 characters'),
  body('domain_id').optional().isInt().withMessage('Invalid domain ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message, domain_id } = req.body;

    // Check if database is connected
    if (!req.app.locals.db || !req.app.locals.dbConnected()) {
      // Mock response when database is not available
      return res.status(201).json({
        message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
        inquiry: {
          id: Math.floor(Math.random() * 1000) + 1,
          name,
          email,
          subject,
          submitted_at: new Date().toISOString()
        }
      });
    }

    // Insert inquiry into database
    const query = `
      INSERT INTO inquiries (domain_id, name, email, subject, message, status)
      VALUES ($1, $2, $3, $4, $5, 'new')
      RETURNING id, created_at
    `;

    const result = await req.app.locals.db.query(query, [
      domain_id || null, name, email, subject, message
    ]);

    const inquiry = result.rows[0];

    // Update domain analytics if this is a domain inquiry
    if (domain_id) {
      await req.app.locals.db.query(
        `UPDATE domain_analytics 
         SET inquiries_count = inquiries_count + 1, updated_at = CURRENT_TIMESTAMP 
         WHERE domain_id = $1`,
        [domain_id]
      );
    }

    // Here you would send notification email to admin
    // await sendInquiryNotification(inquiry);

    res.status(201).json({
      message: 'Your inquiry has been submitted successfully. We\'ll get back to you soon!',
      inquiry_id: inquiry.id,
      submitted_at: inquiry.created_at
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// Helper function to integrate with email services (placeholder)
async function addToEmailService(email, listType, firstName, lastName) {
  // This would integrate with ConvertKit, Beehiiv, or other email service
  // Example for ConvertKit:
  /*
  const convertkit = require('@convertkit/convertkit-js');
  const ck = new convertkit(process.env.CONVERTKIT_API_KEY);
  
  const formId = getFormIdByListType(listType);
  await ck.addSubscriberToForm(formId, {
    email,
    first_name: firstName,
    last_name: lastName
  });
  */
  
  console.log(`Would add ${email} to ${listType} list`);
}

function getFormIdByListType(listType) {
  const formIds = {
    newsletter: process.env.CONVERTKIT_NEWSLETTER_FORM_ID,
    vip_waitlist: process.env.CONVERTKIT_VIP_FORM_ID,
    content_calendar: process.env.CONVERTKIT_CONTENT_FORM_ID
  };
  return formIds[listType] || formIds.newsletter;
}

module.exports = router;