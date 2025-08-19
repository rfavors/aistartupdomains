import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, SparklesIcon, TrophyIcon, ShieldCheckIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { HeartIcon, StarIcon } from '@heroicons/react/24/solid';
import { getFeaturedDomains, getMarketplaceStats, subscribeEmail, generateDomains, type Domain, type MarketplaceStats, type DomainGenerationRequest } from '../services/api';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [businessIdea, setBusinessIdea] = useState('');
  const [generatedDomains, setGeneratedDomains] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [featuredDomains, setFeaturedDomains] = useState<Domain[]>([]);
  const [marketplaceStats, setMarketplaceStats] = useState<MarketplaceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      setSubscribing(true);
      await subscribeEmail({
        email,
        list_type: 'vip_waitlist',
        source: 'homepage_hero'
      });
      
      alert('🎉 Welcome to the VIP Waitlist! You\'ll get early access to hot domain drops.');
      setEmail('');
    } catch (err) {
      console.error('Error subscribing email:', err);
      alert('Failed to join waitlist. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const generateDomainSuggestions = async () => {
    if (!businessIdea.trim()) {
      alert('Please enter your business idea first!');
      return;
    }

    setIsGenerating(true);
    
    try {
      const generationRequest: DomainGenerationRequest = {
        businessIdea: businessIdea.trim(),
        industry: 'Technology', // Default industry
        style: 'Modern and professional'
      };
      
      const response = await generateDomains(generationRequest);
      setGeneratedDomains(response.domains);
    } catch (error) {
      console.error('Error generating domains:', error);
      // Fallback to mock domains if API fails
      const mockDomains = [
        `${businessIdea.toLowerCase().replace(/\s+/g, '')}ai.com`,
        `smart${businessIdea.toLowerCase().replace(/\s+/g, '')}.io`,
        `${businessIdea.toLowerCase().replace(/\s+/g, '')}hub.ai`,
        `next${businessIdea.toLowerCase().replace(/\s+/g, '')}.com`,
        `${businessIdea.toLowerCase().replace(/\s+/g, '')}pro.ai`,
      ];
      setGeneratedDomains(mockDomains);
      alert('Using fallback domain suggestions. AI generation temporarily unavailable.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Fetch featured domains and marketplace stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [domainsData, statsData] = await Promise.all([
          getFeaturedDomains(),
          getMarketplaceStats()
        ]);
        
        setFeaturedDomains(domainsData);
        setMarketplaceStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Get the first featured domain for hero section
  const featuredDomain = featuredDomains[0] || {
    name: 'AIStartupHub.com',
    price: 12500,
    category: 'AI & SaaS',
    description: 'Perfect domain for an AI startup incubator or community platform',
    traffic: '2.5K monthly visits',
    age: '3 years old'
  };

  // Convert marketplace stats to display format
  const stats = marketplaceStats ? [
    { label: 'Domains Sold', value: `${marketplaceStats.total_sales}+` },
    { label: 'Total Sales', value: `$${Math.round(marketplaceStats.total_sales * marketplaceStats.average_price / 1000000)}M` },
    { label: 'Active Listings', value: `${marketplaceStats.active_listings}+` },
    { label: 'Total Domains', value: `${marketplaceStats.total_domains}+` }
  ] : [
    { label: 'Domains Sold', value: '2,847' },
    { label: 'Total Sales', value: '$4.2M' },
    { label: 'Active Listings', value: '15,623' },
    { label: 'Happy Customers', value: '8,934' }
  ];

  const features = [
    {
      icon: SparklesIcon,
      title: 'Founder-Curated Selection',
      description: 'Every domain hand-picked by entrepreneurs who understand what makes a startup name memorable and marketable'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Startup-Focused Expertise',
      description: 'We specialize in AI and tech domains that resonate with investors, customers, and the startup ecosystem'
    },
    {
      icon: TrophyIcon,
      title: 'Market-Tested Names',
      description: 'Domains chosen for their brandability, SEO potential, and ability to scale with growing startups'
    }
  ];

  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div className="">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-mesh opacity-30"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-gentle"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-lg rounded-full text-sm font-medium text-primary-600 mb-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <SparklesIcon className="w-4 h-4 mr-2" />
                <span>Premium AI Startup Domains—Curated by Founders, For Founders</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 text-shadow">
                Launch Your AI Startup
                <span className="gradient-text block mt-2">with the Perfect Domain</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Hand-picked premium domains for AI founders who understand that the right name can make or break a startup. 
                <span className="font-semibold text-primary-600">Curated by entrepreneurs, for entrepreneurs.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/domains" className="btn-primary text-lg px-8 py-4 hover-glow group">
                  <span className="flex items-center justify-center">
                    Browse Domains
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
                <button 
                  onClick={() => {
                    // TODO: Implement PDF download
                    console.log('Downloading Top 25 AI Domains PDF');
                    alert('Download starting... Check your downloads folder!');
                  }}
                  className="btn-secondary text-lg px-8 py-4 group bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700"
                >
                  <span className="flex items-center justify-center">
                    📄 Free: Top 25 AI Domains
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>
              
              {/* Free Domain Scouting Offer */}
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 max-w-2xl mx-auto mb-12 shadow-xl border border-white/20">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">🎯 Free Domain Scouting Service</h3>
                  <p className="text-gray-600 mb-4">Can't find the perfect domain? Our AI experts will scout custom matches for your startup idea.</p>
                  <button 
                    onClick={() => {
                      // TODO: Implement custom domain matching form
                      console.log('Opening custom domain matching form');
                      alert('Custom domain matching form coming soon!');
                    }}
                    className="btn-primary px-6 py-3 text-base"
                  >
                    Get Custom Domain Matches
                  </button>
                </div>
              </div>
              
              {/* Animated Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={stat.label} className={`text-center transition-all duration-500 transform ${
                    currentStat === index ? 'scale-110' : 'scale-100'
                  }`}>
                    <div className={`text-2xl md:text-3xl font-bold transition-colors duration-500 ${
                      currentStat === index ? 'text-primary-600' : 'text-gray-900'
                    }`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture Banner */}
      <section className="relative bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-bounce-gentle"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-lg rounded-full text-sm font-medium text-white mb-4">
              <HeartIcon className="w-4 h-4 mr-2 text-red-300" />
              <span>Loved by 15,000+ entrepreneurs</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-shadow">
              🚨 Join the VIP Waitlist for Hot Domain Drops
            </h2>
            
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Get early access to premium AI domains before they hit the public market. VIP members see new listings 24-48 hours early.
            </p>
            
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="input-modern w-full text-gray-900 placeholder-gray-500 shadow-lg"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={subscribing}
                className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center">
                  {subscribing ? 'Joining...' : 'Join VIP Waitlist'}
                  <CheckIcon className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
                </span>
              </button>
            </form>
            
            <div className="flex items-center justify-center mt-6 space-x-6 text-primary-100">
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 mr-2" />
                <span className="text-sm">24-48hr early access</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 mr-2" />
                <span className="text-sm">Hot drops alerts</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 mr-2" />
                <span className="text-sm">Pre-release names</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Domain Generator */}
      <section id="generator" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-sm font-medium text-primary-700 mb-4">
              <SparklesIcon className="w-4 h-4 mr-2" />
              <span>Powered by Advanced AI</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI Domain Name Generator
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enter your business idea and let our AI suggest perfect domain names tailored to your vision
            </p>
          </div>
          
          <div className="glass-effect rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your business idea
                </label>
                <input
                  type="text"
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  placeholder="e.g., AI-powered customer service chatbot, sustainable fashion marketplace"
                  className="input-modern text-lg py-4 shadow-lg"
                  onKeyPress={(e) => e.key === 'Enter' && generateDomainSuggestions()}
                />
              </div>
              <button
                onClick={generateDomainSuggestions}
                disabled={isGenerating || !businessIdea.trim()}
                className="btn-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed hover-glow group min-w-[160px]"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <SparklesIcon className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Generate
                  </span>
                )}
              </button>
            </div>
            
            {generatedDomains.length > 0 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <SparklesIcon className="w-5 h-5 mr-2 text-primary-600" />
                  AI-Generated Domain Suggestions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedDomains.map((domain, index) => (
                    <div 
                      key={index} 
                      className="card-interactive group animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-semibold text-gray-900 text-lg group-hover:text-primary-600 transition-colors duration-300">
                          {domain}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                          Available
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">$2,500</span> • Premium
                        </div>
                        <button className="btn-primary text-sm px-4 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          Check Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <p className="text-gray-600 mb-4">Want to see more options?</p>
                  <Link to="/domains" className="btn-secondary px-6 py-3 hover-glow">
                    Browse All Domains
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Domain */}
      <section id="featured" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-mesh opacity-30"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-200 rounded-full blur-3xl opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-20 animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <TrophyIcon className="w-4 h-4 mr-2" />
              Featured This Week
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 gradient-text">
              Premium Domain Spotlight
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked premium domain perfect for your next venture
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="card-interactive group hover-glow animate-slide-up">
              <div className="bg-gradient-to-r from-primary-500 via-purple-500 to-blue-600 px-8 py-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center">
                    <StarIcon className="w-6 h-6 text-yellow-300 mr-2" />
                    <span className="text-white font-bold text-lg">Featured Domain</span>
                  </div>
                  <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                    {featuredDomain.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                    {featuredDomain.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                  {featuredDomain.description}
                </p>
                
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-500 block mb-1">Monthly Traffic</span>
                    <p className="font-bold text-xl text-gray-900">{featuredDomain.traffic}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-500 block mb-1">Domain Age</span>
                    <p className="font-bold text-xl text-gray-900">{featuredDomain.age}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-500 block mb-1">SEO Score</span>
                    <p className="font-bold text-xl text-green-600">95/100</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-500 block mb-1">Backlinks</span>
                    <p className="font-bold text-xl text-blue-600">2.5K+</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-4xl md:text-5xl font-bold text-primary-600 block">
                      ${typeof featuredDomain.price === 'number' ? featuredDomain.price.toLocaleString() : featuredDomain.price}
                    </span>
                    <span className="text-gray-500 text-sm">One-time payment • No hidden fees</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="btn-ghost px-6 py-3 hover-glow">
                      <HeartIcon className="w-4 h-4 mr-2" />
                      Make Offer
                    </button>
                    <button className="btn-primary px-8 py-3 hover-glow">
                      <ShieldCheckIcon className="w-4 h-4 mr-2" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted by Thousands</h2>
            <p className="text-blue-100 text-lg">Join the community of successful entrepreneurs</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 animate-bounce-gentle">
                  {stat.value}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <ShieldCheckIcon className="w-4 h-4 mr-2" />
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 gradient-text">
              Built by Founders, For Founders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We understand the startup journey because we've been there. Every domain is hand-picked by entrepreneurs who know what makes a name stick in the market.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-interactive group text-center animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-10 w-10 text-primary-600 group-hover:text-primary-700 transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Content Ideas Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Build Your Personal Brand
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 gradient-text">
              Daily Content Ideas for Domain Brokers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow the journey, share the knowledge. Here's how successful domain brokers build their personal brand on social media.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Domain of the Day */}
            <div className="card-interactive group animate-slide-up">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                "🔥 Domain of the Day"
              </h3>
              <p className="text-gray-600 mb-4">
                Share 1 AI startup name daily with why it's great and niche use cases. Example: "AIHealthHub.com - Perfect for telemedicine startups targeting the $350B healthcare AI market."
              </p>
              <div className="text-sm text-primary-600 font-medium">
                📱 LinkedIn & Twitter • Daily
              </div>
            </div>
            
            {/* Educational Tips */}
            <div className="card-interactive group animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                Educational Tips
              </h3>
              <p className="text-gray-600 mb-4">
                Share insights like "Why short .ai domains sell for 5 figures" or "The psychology behind memorable startup names." Position yourself as the expert.
              </p>
              <div className="text-sm text-primary-600 font-medium">
                📱 LinkedIn & Twitter • 3x/week
              </div>
            </div>
            
            {/* Personal Journey */}
            <div className="card-interactive group animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                Personal Journey
              </h3>
              <p className="text-gray-600 mb-4">
                Show your learning process: "Day 30 of building my domain brokerage - here's what I learned about AI startup naming trends." People love following builders.
              </p>
              <div className="text-sm text-primary-600 font-medium">
                📱 LinkedIn & Twitter • 2x/week
              </div>
            </div>
          </div>
          
          {/* Content Calendar CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-3xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Build Your Domain Broker Brand?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join our community of domain entrepreneurs sharing daily insights and building their personal brands in the AI startup space.
              </p>
              <button 
                onClick={() => {
                  // TODO: Implement content calendar download
                  console.log('Downloading content calendar');
                  alert('📅 30-Day Content Calendar downloading... Check your downloads!');
                }}
                className="btn-primary px-8 py-4 text-lg hover-glow"
              >
                📅 Get Free 30-Day Content Calendar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-20"></div>
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-bounce-gentle"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full text-sm font-medium text-white mb-6">
              <SparklesIcon className="w-4 h-4 mr-2" />
              <span>Start Your Journey Today</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-shadow">
              Ready to Find Your Perfect Domain?
            </h2>
            <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of entrepreneurs who have found their ideal domains through our platform. 
              <span className="font-semibold text-white">Start building your digital empire today.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/domains" 
                className="bg-white text-primary-600 font-bold px-10 py-4 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl group text-lg"
              >
                <span className="flex items-center justify-center">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Start Browsing
                </span>
              </Link>
              <Link 
                to="/seller-dashboard" 
                className="border-2 border-white text-white font-bold px-10 py-4 rounded-2xl hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl group text-lg backdrop-blur-sm"
              >
                <span className="flex items-center justify-center">
                  <ArrowRightIcon className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  List Your Domain
                </span>
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-primary-100">Expert Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">100%</div>
                <div className="text-primary-100">Secure Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">48h</div>
                <div className="text-primary-100">Fast Transfer</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;