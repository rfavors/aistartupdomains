-- Seed data for AI Startup Domains

-- Insert sample users (sellers)
INSERT INTO users (email, first_name, last_name, company, role, is_verified) VALUES
('john@domainpro.com', 'John', 'Smith', 'DomainPro', 'seller', true),
('sarah@techdomains.com', 'Sarah', 'Johnson', 'TechDomains', 'seller', true),
('mike@medtech.com', 'Mike', 'Chen', 'MedTech', 'seller', true),
('lisa@blockchainpro.com', 'Lisa', 'Rodriguez', 'BlockchainPro', 'seller', true),
('david@edudomains.com', 'David', 'Wilson', 'EduDomains', 'seller', true),
('emma@ecotech.com', 'Emma', 'Brown', 'EcoTech', 'seller', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample domains
INSERT INTO domains (name, price, category_id, description, traffic_monthly, domain_age_years, is_featured, seller_id, registrar, expires_at, seo_score, backlinks_count, keywords, status) VALUES
('AIStartupHub.com', 12500.00, 1, 'Perfect domain for an AI startup incubator or community platform. Brandable name with strong SEO potential.', 2500, 3, true, 1, 'GoDaddy', '2025-12-15', 85, 150, ARRAY['ai', 'startup', 'hub', 'incubator', 'community'], 'active'),

('SmartFintech.io', 8900.00, 2, 'Ideal for financial technology companies and apps. Short, memorable, and industry-specific.', 1800, 2, true, 2, 'Namecheap', '2025-08-22', 78, 95, ARRAY['fintech', 'smart', 'finance', 'technology'], 'active'),

('HealthAI.com', 15000.00, 3, 'Premium domain for healthcare AI solutions. Perfect for medical AI startups and health tech companies.', 3200, 4, false, 3, 'GoDaddy', '2026-03-10', 92, 220, ARRAY['health', 'ai', 'medical', 'healthcare'], 'active'),

('CryptoVault.ai', 6500.00, 6, 'Perfect for cryptocurrency and blockchain projects. Strong brand potential in the crypto space.', 1200, 1, false, 4, 'Cloudflare', '2025-06-18', 72, 65, ARRAY['crypto', 'vault', 'blockchain', 'security'], 'active'),

('EduTechPro.com', 4200.00, 4, 'Great for educational technology platforms. Professional name for EdTech startups and learning platforms.', 900, 2, false, 5, 'Namecheap', '2025-11-05', 68, 45, ARRAY['education', 'technology', 'learning', 'platform'], 'active'),

('GreenTechAI.io', 9800.00, 5, 'Ideal for sustainable technology and AI solutions. Perfect for climate tech and green energy startups.', 2100, 3, true, 6, 'GoDaddy', '2025-09-30', 81, 125, ARRAY['green', 'technology', 'ai', 'sustainable', 'climate'], 'active'),

('DataStreamPro.com', 7500.00, 1, 'Perfect for data analytics and streaming platforms. Strong technical brand for B2B SaaS companies.', 1500, 2, false, 1, 'Namecheap', '2025-07-12', 75, 88, ARRAY['data', 'analytics', 'streaming', 'saas'], 'active'),

('BioTechLabs.ai', 11200.00, 10, 'Premium domain for biotechnology and life sciences companies. Perfect for biotech startups and research labs.', 1900, 3, true, 3, 'GoDaddy', '2026-01-20', 83, 165, ARRAY['biotech', 'labs', 'life sciences', 'research'], 'active'),

('GameForgeAI.com', 5800.00, 8, 'Ideal for AI-powered gaming platforms and game development studios. Creative and memorable brand.', 1100, 1, false, 2, 'Cloudflare', '2025-05-25', 70, 55, ARRAY['gaming', 'ai', 'development', 'platform'], 'active'),

('SmartIoT.io', 6900.00, 9, 'Perfect for Internet of Things and smart device companies. Short, tech-focused domain name.', 1300, 2, false, 4, 'Namecheap', '2025-10-08', 74, 72, ARRAY['iot', 'smart', 'devices', 'technology'], 'active'),

('CloudSecureAI.com', 8200.00, 1, 'Ideal for cloud security and AI cybersecurity solutions. Strong enterprise appeal.', 1600, 2, false, 1, 'GoDaddy', '2025-12-03', 79, 110, ARRAY['cloud', 'security', 'ai', 'cybersecurity'], 'active'),

('RetailTechHub.com', 5500.00, 7, 'Great for e-commerce technology and retail innovation platforms. Perfect for retail tech startups.', 1000, 1, false, 5, 'Namecheap', '2025-08-15', 69, 48, ARRAY['retail', 'technology', 'ecommerce', 'innovation'], 'active'),

('QuantumCompute.ai', 18500.00, 1, 'Premium domain for quantum computing and advanced AI research. High-value tech domain.', 2800, 4, true, 2, 'GoDaddy', '2026-02-14', 88, 195, ARRAY['quantum', 'computing', 'ai', 'research'], 'active'),

('MedDeviceAI.com', 9500.00, 3, 'Perfect for medical device companies using AI technology. Specific and professional brand.', 1700, 3, false, 3, 'Cloudflare', '2025-11-28', 80, 135, ARRAY['medical', 'devices', 'ai', 'healthcare'], 'active'),

('AutoTechPro.io', 7200.00, 1, 'Ideal for automotive technology and autonomous vehicle companies. Strong industry focus.', 1400, 2, false, 6, 'Namecheap', '2025-09-12', 76, 92, ARRAY['automotive', 'technology', 'autonomous', 'vehicles'], 'active');

-- Insert domain analytics
INSERT INTO domain_analytics (domain_id, views_count, inquiries_count, last_viewed) 
SELECT 
    id,
    FLOOR(RANDOM() * 500 + 50)::INTEGER,
    FLOOR(RANDOM() * 20 + 1)::INTEGER,
    CURRENT_TIMESTAMP - (RANDOM() * INTERVAL '30 days')
FROM domains;

-- Insert some sample inquiries
INSERT INTO users (email, first_name, last_name, role, is_verified) VALUES
('buyer1@startup.com', 'Alex', 'Thompson', 'buyer', true),
('buyer2@techco.com', 'Maria', 'Garcia', 'buyer', true),
('buyer3@innovate.io', 'James', 'Lee', 'buyer', true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO inquiries (domain_id, buyer_id, seller_id, subject, message, offer_amount, status) VALUES
(1, 7, 1, 'Interest in AIStartupHub.com', 'Hi, I am interested in purchasing this domain for my AI startup. Would you consider $10,000?', 10000.00, 'open'),
(3, 8, 3, 'HealthAI.com inquiry', 'This domain would be perfect for our healthcare AI platform. Is the price negotiable?', 13000.00, 'responded'),
(6, 9, 6, 'GreenTechAI.io offer', 'We are launching a climate tech startup and this domain fits perfectly. Can we discuss terms?', 8500.00, 'open');

-- Insert some email subscribers
INSERT INTO email_subscribers (email, source) VALUES
('subscriber1@email.com', 'vip_waitlist'),
('subscriber2@email.com', 'vip_waitlist'),
('subscriber3@email.com', 'newsletter'),
('subscriber4@email.com', 'lead_magnet'),
('subscriber5@email.com', 'vip_waitlist');

-- Update domain analytics views for featured domains
UPDATE domain_analytics 
SET views_count = views_count + FLOOR(RANDOM() * 200 + 100)::INTEGER
WHERE domain_id IN (SELECT id FROM domains WHERE is_featured = true);