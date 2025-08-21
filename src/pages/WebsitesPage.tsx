import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FunnelIcon, MagnifyingGlassIcon, ChartBarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface Website {
  id: string;
  title: string;
  domain: string;
  price: number;
  category: string;
  description: string;
  monthlyRevenue?: number;
  monthlyTraffic?: string;
  age?: string;
  featured: boolean;
  seller: string;
  image?: string;
  technologies?: string[];
}

const WebsitesPage = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with API call
  useEffect(() => {
    const mockWebsites: Website[] = [
      {
        id: '1',
        title: 'AI Content Generator SaaS',
        domain: 'contentai.pro',
        price: 45000,
        category: 'AI & SaaS',
        description: 'Fully functional AI-powered content generation platform with 500+ active users',
        monthlyRevenue: 3200,
        monthlyTraffic: '12K visits',
        age: '18 months',
        featured: true,
        seller: 'SaaS Builder',
        technologies: ['React', 'Node.js', 'OpenAI API', 'Stripe']
      },
      {
        id: '2',
        title: 'Crypto Portfolio Tracker',
        domain: 'cryptotrack.io',
        price: 28000,
        category: 'Crypto',
        description: 'Real-time cryptocurrency portfolio tracking with advanced analytics',
        monthlyRevenue: 1800,
        monthlyTraffic: '8.5K visits',
        age: '12 months',
        featured: true,
        seller: 'CryptoDevs',
        technologies: ['Vue.js', 'Python', 'CoinGecko API', 'PostgreSQL']
      },
      {
        id: '3',
        title: 'Health & Fitness App',
        domain: 'fitnesstracker.app',
        price: 35000,
        category: 'Health & Fitness',
        description: 'Mobile-first fitness tracking application with workout plans and nutrition tracking',
        monthlyRevenue: 2400,
        monthlyTraffic: '15K visits',
        age: '2 years',
        featured: false,
        seller: 'HealthTech Pro',
        technologies: ['React Native', 'Firebase', 'Stripe', 'HealthKit']
      },
      {
        id: '4',
        title: 'E-learning Platform',
        domain: 'learnfast.edu',
        price: 52000,
        category: 'EdTech',
        description: 'Complete online learning management system with video courses and certificates',
        monthlyRevenue: 4100,
        monthlyTraffic: '22K visits',
        age: '3 years',
        featured: true,
        seller: 'EduTech Solutions',
        technologies: ['Laravel', 'Vue.js', 'MySQL', 'AWS S3', 'Vimeo API']
      },
      {
        id: '5',
        title: 'Social Media Scheduler',
        domain: 'socialscheduler.com',
        price: 18000,
        category: 'Marketing',
        description: 'Automated social media posting and scheduling tool for businesses',
        monthlyRevenue: 950,
        monthlyTraffic: '5.2K visits',
        age: '8 months',
        featured: false,
        seller: 'MarketingTools',
        technologies: ['React', 'Express.js', 'MongoDB', 'Twitter API', 'Facebook API']
      },
      {
        id: '6',
        title: 'Green Energy Marketplace',
        domain: 'greenenergy.market',
        price: 38000,
        category: 'GreenTech',
        description: 'Marketplace connecting renewable energy providers with consumers',
        monthlyRevenue: 2800,
        monthlyTraffic: '11K visits',
        age: '16 months',
        featured: false,
        seller: 'EcoTech Ventures',
        technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe Connect']
      }
    ];
    setWebsites(mockWebsites);
    setFilteredWebsites(mockWebsites);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = websites;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(website => 
        website.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(website => website.category === selectedCategory);
    }

    // Price range filter
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-20k':
          filtered = filtered.filter(website => website.price < 20000);
          break;
        case '20k-40k':
          filtered = filtered.filter(website => website.price >= 20000 && website.price < 40000);
          break;
        case '40k-60k':
          filtered = filtered.filter(website => website.price >= 40000 && website.price < 60000);
          break;
        case 'over-60k':
          filtered = filtered.filter(website => website.price >= 60000);
          break;
      }
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'revenue':
        filtered.sort((a, b) => (b.monthlyRevenue || 0) - (a.monthlyRevenue || 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredWebsites(filtered);
  }, [websites, searchTerm, selectedCategory, priceRange, sortBy]);

  const categories = ['all', 'AI & SaaS', 'Crypto', 'Health & Fitness', 'EdTech', 'Marketing', 'GreenTech'];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under-20k', label: 'Under $20,000' },
    { value: '20k-40k', label: '$20,000 - $40,000' },
    { value: '40k-60k', label: '$40,000 - $60,000' },
    { value: 'over-60k', label: 'Over $60,000' }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Startup Websites for Sale</h1>
          <p className="text-gray-600 mb-6">
            Discover profitable online businesses and ready-to-launch websites with proven revenue streams.
          </p>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search websites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary flex items-center gap-2"
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
            </button>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="revenue">Revenue: High to Low</option>
              <option value="title">Title: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange('all');
                  setSortBy('featured');
                }}
                className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Website Grid */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {filteredWebsites.length} of {websites.length} websites
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredWebsites.map((website) => (
                <div key={website.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {website.featured && (
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-600 px-4 py-2">
                      <span className="text-white text-sm font-medium">Featured</span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {website.title}
                        </h3>
                        <p className="text-primary-600 text-sm font-medium">{website.domain}</p>
                      </div>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {website.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {website.description}
                    </p>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {website.monthlyRevenue && (
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
                          <div>
                            <span className="text-xs text-gray-500">Monthly Revenue</span>
                            <p className="font-semibold text-green-600">
                              {formatPrice(website.monthlyRevenue)}
                            </p>
                          </div>
                        </div>
                      )}
                      {website.monthlyTraffic && (
                        <div className="flex items-center gap-2">
                          <ChartBarIcon className="h-4 w-4 text-primary-500" />
                          <div>
                            <span className="text-xs text-gray-500">Monthly Traffic</span>
                            <p className="font-semibold text-primary-600">{website.monthlyTraffic}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Technologies */}
                    {website.technologies && (
                      <div className="mb-4">
                        <span className="text-xs text-gray-500 mb-2 block">Technologies</span>
                        <div className="flex flex-wrap gap-1">
                          {website.technologies.slice(0, 4).map((tech, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {tech}
                            </span>
                          ))}
                          {website.technologies.length > 4 && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              +{website.technologies.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">
                          {formatPrice(website.price)}
                        </span>
                        <p className="text-xs text-gray-500">by {website.seller}</p>
                        {website.age && (
                          <p className="text-xs text-gray-500">Age: {website.age}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="btn-secondary text-sm px-3 py-2">
                          Make Offer
                        </button>
                        <Link
                          to={`/website/${website.id}`}
                          className="btn-primary text-sm px-3 py-2"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredWebsites.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No websites found matching your criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange('all');
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitesPage;