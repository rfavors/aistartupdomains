-- AI Startup Domains Database Schema

-- Create database (run this separately if needed)
-- CREATE DATABASE aistartupdomains;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(255),
    role VARCHAR(50) DEFAULT 'buyer', -- 'buyer', 'seller', 'admin'
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Domains table
CREATE TABLE IF NOT EXISTS domains (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    description TEXT,
    traffic_monthly INTEGER,
    domain_age_years INTEGER,
    is_featured BOOLEAN DEFAULT FALSE,
    is_sold BOOLEAN DEFAULT FALSE,
    seller_id INTEGER REFERENCES users(id),
    buyer_id INTEGER REFERENCES users(id),
    registrar VARCHAR(100),
    expires_at DATE,
    seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
    backlinks_count INTEGER DEFAULT 0,
    social_media_handles JSONB, -- Store social media availability
    keywords TEXT[], -- Array of relevant keywords
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'pending', 'sold', 'expired'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sold_at TIMESTAMP
);

-- Domain images table
CREATE TABLE IF NOT EXISTS domain_images (
    id SERIAL PRIMARY KEY,
    domain_id INTEGER REFERENCES domains(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries/Messages table
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    domain_id INTEGER REFERENCES domains(id),
    buyer_id INTEGER REFERENCES users(id),
    seller_id INTEGER REFERENCES users(id),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    offer_amount DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'responded', 'closed', 'accepted'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email subscribers (VIP waitlist)
CREATE TABLE IF NOT EXISTS email_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(50) DEFAULT 'vip_waitlist', -- 'vip_waitlist', 'newsletter', 'lead_magnet'
    is_active BOOLEAN DEFAULT TRUE,
    preferences JSONB, -- Store email preferences
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP
);

-- Domain analytics/stats
CREATE TABLE IF NOT EXISTS domain_analytics (
    id SERIAL PRIMARY KEY,
    domain_id INTEGER REFERENCES domains(id),
    views_count INTEGER DEFAULT 0,
    inquiries_count INTEGER DEFAULT 0,
    last_viewed TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    domain_id INTEGER REFERENCES domains(id),
    buyer_id INTEGER REFERENCES users(id),
    seller_id INTEGER REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    commission DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    transaction_id VARCHAR(255), -- External payment processor ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('AI & SaaS', 'ai-saas', 'Artificial Intelligence and Software as a Service domains'),
('Fintech', 'fintech', 'Financial technology and cryptocurrency domains'),
('Health & AI', 'health-ai', 'Healthcare and medical AI domains'),
('EdTech', 'edtech', 'Educational technology domains'),
('GreenTech', 'greentech', 'Sustainable and environmental technology domains'),
('Crypto', 'crypto', 'Cryptocurrency and blockchain domains'),
('E-commerce', 'ecommerce', 'Online retail and marketplace domains'),
('Gaming', 'gaming', 'Gaming and entertainment domains'),
('IoT', 'iot', 'Internet of Things and smart device domains'),
('Biotech', 'biotech', 'Biotechnology and life sciences domains')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_domains_category ON domains(category_id);
CREATE INDEX IF NOT EXISTS idx_domains_price ON domains(price);
CREATE INDEX IF NOT EXISTS idx_domains_featured ON domains(is_featured);
CREATE INDEX IF NOT EXISTS idx_domains_status ON domains(status);
CREATE INDEX IF NOT EXISTS idx_domains_seller ON domains(seller_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_domain ON inquiries(domain_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_buyer ON inquiries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_transactions_domain ON transactions(domain_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON domains
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domain_analytics_updated_at BEFORE UPDATE ON domain_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();