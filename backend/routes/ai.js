const express = require('express');
const OpenAI = require('openai');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Rate limiting for AI generation (more restrictive)
const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many AI generation requests, please try again later.'
  }
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate domain suggestions based on business idea
router.post('/generate-domains', aiRateLimit, async (req, res) => {
  try {
    const { businessIdea, industry, keywords, style } = req.body;

    // Validate input
    if (!businessIdea || businessIdea.trim().length < 10) {
      return res.status(400).json({
        error: 'Business idea must be at least 10 characters long'
      });
    }

    // Construct the prompt for domain generation
    const prompt = `Generate 10 creative, brandable domain names for a business with the following details:

Business Idea: ${businessIdea}
Industry: ${industry || 'Technology'}
Keywords: ${keywords || 'N/A'}
Style Preference: ${style || 'Modern and professional'}

Requirements:
- Domain names should be 6-15 characters long
- Easy to remember and pronounce
- Suitable for a ${industry || 'technology'} business
- Avoid hyphens and numbers
- Focus on .com extensions
- Be creative and brandable
- Consider AI, tech, and startup themes if relevant

Return only the domain names, one per line, without explanations or additional text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a creative domain name generator specializing in brandable, memorable domain names for startups and businesses. Generate only domain names without explanations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.8
    });

    const generatedText = completion.choices[0]?.message?.content;
    
    if (!generatedText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the generated domain names
    const domainNames = generatedText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Clean up the domain name (remove numbers, bullets, etc.)
        return line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim();
      })
      .filter(domain => {
        // Basic validation
        return domain.length >= 4 && domain.length <= 20 && 
               /^[a-zA-Z0-9.-]+$/.test(domain) &&
               !domain.startsWith('.') && !domain.endsWith('.');
      })
      .slice(0, 10); // Ensure we don't return more than 10

    // Add .com if not present
    const formattedDomains = domainNames.map(domain => {
      if (!domain.includes('.')) {
        return domain + '.com';
      }
      return domain;
    });

    res.json({
      success: true,
      domains: formattedDomains,
      input: {
        businessIdea,
        industry,
        keywords,
        style
      }
    });

  } catch (error) {
    console.error('Error generating domains:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        error: 'AI service quota exceeded. Please try again later.'
      });
    }
    
    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please try again in a few minutes.'
      });
    }

    res.status(500).json({
      error: 'Failed to generate domain suggestions. Please try again.'
    });
  }
});

// Check domain availability (mock implementation)
router.post('/check-availability', async (req, res) => {
  try {
    const { domains } = req.body;

    if (!Array.isArray(domains) || domains.length === 0) {
      return res.status(400).json({
        error: 'Please provide an array of domains to check'
      });
    }

    if (domains.length > 20) {
      return res.status(400).json({
        error: 'Maximum 20 domains can be checked at once'
      });
    }

    // Mock availability check (in production, integrate with domain registrar API)
    const results = domains.map(domain => {
      // Simulate random availability (70% available)
      const isAvailable = Math.random() > 0.3;
      const estimatedPrice = isAvailable ? 
        Math.floor(Math.random() * 50000) + 1000 : // $1K - $50K
        null;

      return {
        domain: domain,
        available: isAvailable,
        estimatedPrice: estimatedPrice,
        registrar: isAvailable ? 'GoDaddy' : null,
        checkedAt: new Date().toISOString()
      };
    });

    res.json({
      success: true,
      results: results,
      checkedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error checking domain availability:', error);
    res.status(500).json({
      error: 'Failed to check domain availability'
    });
  }
});

// Get domain suggestions based on existing successful domains
router.get('/trending-suggestions', async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;

    // Mock trending suggestions based on successful patterns
    const trendingSuggestions = [
      { domain: 'aiflow.com', category: 'AI & ML', reason: 'Short, brandable, tech-focused' },
      { domain: 'nexusai.com', category: 'AI & ML', reason: 'Strong brand potential' },
      { domain: 'dataforge.com', category: 'Analytics', reason: 'Descriptive and powerful' },
      { domain: 'cloudvault.com', category: 'Cloud', reason: 'Security-focused branding' },
      { domain: 'smartops.com', category: 'Operations', reason: 'Clear value proposition' },
      { domain: 'techpulse.com', category: 'Technology', reason: 'Dynamic and modern' },
      { domain: 'innovatehub.com', category: 'Innovation', reason: 'Community-focused' },
      { domain: 'digitalsphere.com', category: 'Digital', reason: 'Comprehensive scope' },
      { domain: 'futuretech.com', category: 'Technology', reason: 'Forward-thinking' },
      { domain: 'smartsolutions.com', category: 'Solutions', reason: 'Professional appeal' }
    ];

    let filtered = trendingSuggestions;
    if (category) {
      filtered = trendingSuggestions.filter(item => 
        item.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    const limitedResults = filtered.slice(0, parseInt(limit));

    res.json({
      success: true,
      suggestions: limitedResults,
      total: filtered.length
    });

  } catch (error) {
    console.error('Error getting trending suggestions:', error);
    res.status(500).json({
      error: 'Failed to get trending suggestions'
    });
  }
});

module.exports = router;