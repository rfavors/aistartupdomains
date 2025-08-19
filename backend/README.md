# AI Startup Domains - Backend API

This is the backend API server for the AI Startup Domains marketplace, built with Express.js, PostgreSQL, and OpenAI integration.

## Features

- **Domain Management**: CRUD operations for domain listings
- **AI Domain Generation**: OpenAI-powered domain name suggestions
- **User Authentication**: JWT-based authentication system
- **Email Integration**: Newsletter/waitlist management with ConvertKit/Beehiiv
- **Database**: PostgreSQL with comprehensive schema
- **Security**: Rate limiting, CORS, helmet protection

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- OpenAI API key
- ConvertKit or Beehiiv API credentials (optional)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE ai_startup_domains;
```

2. Run the schema creation script:
```bash
psql -d ai_startup_domains -f database/schema.sql
```

3. (Optional) Seed with sample data:
```bash
psql -d ai_startup_domains -f database/seed.sql
```

### 3. Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your actual values:

#### Required API Keys:

**OpenAI API Key** (Required for AI domain generation):
- Sign up at: https://platform.openai.com/
- Go to: https://platform.openai.com/api-keys
- Create a new API key
- Add to `.env`: `OPENAI_API_KEY=sk-your_key_here`

**ConvertKit API** (Optional - for email marketing):
- Sign up at: https://convertkit.com/
- Go to: Account Settings > Advanced Settings
- Copy API Key and API Secret
- Create a form and get the Form ID
- Add to `.env`:
  ```
  CONVERTKIT_API_KEY=your_api_key
  CONVERTKIT_API_SECRET=your_api_secret
  CONVERTKIT_FORM_ID=your_form_id
  ```

**Database Configuration**:
- Update database credentials in `.env`
- Default: `postgresql://postgres:password@localhost:5432/ai_startup_domains`

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Domains
- `GET /api/domains` - List domains with filtering and pagination
- `GET /api/domains/featured` - Get featured domains
- `GET /api/domains/stats` - Get marketplace statistics
- `GET /api/domains/categories` - List all categories
- `GET /api/domains/:id` - Get single domain details
- `POST /api/domains` - Create new domain listing (auth required)

### AI Generation
- `POST /api/ai/generate-domains` - Generate domain suggestions using AI
- `POST /api/ai/check-availability` - Check domain availability
- `GET /api/ai/trending-suggestions` - Get trending domain suggestions

### Email
- `POST /api/email/subscribe` - Subscribe to newsletter/waitlist
- `POST /api/email/unsubscribe` - Unsubscribe from lists
- `POST /api/email/contact` - Submit contact form
- `GET /api/email/stats` - Get subscriber statistics (admin)

### Users
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/profile` - Update user profile (auth required)
- `GET /api/users/domains` - Get user's domain listings (auth required)

## Database Schema

The database includes the following main tables:
- `users` - User accounts and profiles
- `categories` - Domain categories
- `domains` - Domain listings with metadata
- `domain_images` - Domain screenshot/logo images
- `inquiries` - Domain purchase inquiries
- `email_subscribers` - Newsletter/waitlist subscribers
- `domain_analytics` - Domain view/inquiry tracking
- `transactions` - Domain sale transactions

## Security Features

- **Rate Limiting**: API endpoints are rate-limited to prevent abuse
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers for protection
- **Input Validation**: All inputs are validated and sanitized
- **JWT Authentication**: Secure token-based authentication
- **SQL Injection Protection**: Parameterized queries

## Development

### Running Tests
```bash
npm test
```

### Code Formatting
```bash
npm run format
```

### Database Migrations
For schema changes, update `database/schema.sql` and run:
```bash
psql -d ai_startup_domains -f database/schema.sql
```

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use a secure JWT secret
3. Configure production database
4. Set up SSL/TLS certificates
5. Use a process manager like PM2
6. Configure reverse proxy (nginx)
7. Set up monitoring and logging

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **OpenAI API Error**:
   - Verify API key is correct
   - Check API quota/billing
   - Ensure proper format: `sk-...`

3. **CORS Issues**:
   - Check `FRONTEND_URL` in `.env`
   - Verify frontend is running on correct port

4. **Rate Limiting**:
   - Wait for rate limit window to reset
   - Check rate limit configuration

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check server logs for errors
4. Ensure all environment variables are set correctly