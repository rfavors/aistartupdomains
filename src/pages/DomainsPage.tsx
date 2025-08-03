import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Domain {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  traffic?: string;
  age?: string;
  featured: boolean;
  seller: string;
  image?: string;
}

const DomainsPage = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with API call
  useEffect(() => {
    const mockDomains: Domain[] = [
      {
        id: '1',
        name: 'AIStartupHub.com',
        price: 12500,
        category: 'AI & SaaS',
        description: 'Perfect domain for an AI startup incubator or community platform',
        traffic: '2.5K monthly',
        age: '3 years',
        featured: true,
        seller: 'DomainPro'
      },
      {
        id: '2',
        name: 'SmartFintech.io',
        price: 8900,
        category: 'Fintech',
        description: 'Ideal for financial technology companies and apps',
        traffic: '1.8K monthly',
        age: '2 years',
        featured: true,
        seller: 'TechDomains'
      },
      {
        id: '3',
        name: 'HealthAI.com',
        price: 15000,
        category: 'Health & AI',
        description: 'Premium domain for healthcare AI solutions',
        traffic: '3.2K monthly',
        age: '4 years',
        featured: false,
        seller: 'MedTech'
      },
      {
        id: '4',
        name: 'CryptoVault.ai',
        price: 6500,
        category: 'Crypto',
        description: 'Perfect for cryptocurrency and blockchain projects',
        traffic: '1.2K monthly',
        age: '1 year',
        featured: false,
        seller: 'BlockchainPro'
      },
      {
        id: '5',
        name: 'EduTechPro.com',
        price: 4200,
        category: 'EdTech',
        description: 'Great for educational technology platforms',
        traffic: '900 monthly',
        age: '2 years',
        featured: false,
        seller: 'EduDomains'
      },
      {
        id: '6',
        name: 'GreenTechAI.io',
        price: 9800,
        category: 'GreenTech',
        description: 'Ideal for sustainable technology and AI solutions',
        traffic: '2.1K monthly',
        age: '3 years',
        featured: true,
        seller: 'EcoTech'
      }
    ];
    setDomains(mockDomains);
    setFilteredDomains(mockDomains);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = domains;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(domain => 
        domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        domain.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        domain.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(domain => domain.category === selectedCategory);
    }

    // Price range filter
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-5k':
          filtered = filtered.filter(domain => domain.price < 5000);
          break;
        case '5k-10k':
          filtered = filtered.filter(domain => domain.price >= 5000 && domain.price < 10000);
          break;
        case '10k-20k':
          filtered = filtered.filter(domain => domain.price >= 10000 && domain.price < 20000);
          break;
        case 'over-20k':
          filtered = filtered.filter(domain => domain.price >= 20000);
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
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredDomains(filtered);
  }, [domains, searchTerm, selectedCategory, priceRange, sortBy]);

  const categories = ['all', 'AI & SaaS', 'Fintech', 'Health & AI', 'Crypto', 'EdTech', 'GreenTech'];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under-5k', label: 'Under $5,000' },
    { value: '5k-10k', label: '$5,000 - $10,000' },
    { value: '10k-20k', label: '$10,000 - $20,000' },
    { value: 'over-20k', label: 'Over $20,000' }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Premium Domains</h1>
          <p className="text-gray-600 mb-6">
            Discover hand-curated premium domains perfect for your next startup or business venture.
          </p>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search domains..."
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
              <option value="name">Name: A to Z</option>
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

          {/* Domain Grid */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {filteredDomains.length} of {domains.length} domains
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDomains.map((domain) => (
                <div key={domain.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {domain.featured && (
                    <div className="bg-gradient-to-r from-primary-500 to-blue-600 px-4 py-2">
                      <span className="text-white text-sm font-medium">Featured</span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {domain.name}
                      </h3>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {domain.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {domain.description}
                    </p>
                    
                    {(domain.traffic || domain.age) && (
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        {domain.traffic && (
                          <div>
                            <span className="text-gray-500">Traffic</span>
                            <p className="font-medium text-gray-900">{domain.traffic}</p>
                          </div>
                        )}
                        {domain.age && (
                          <div>
                            <span className="text-gray-500">Age</span>
                            <p className="font-medium text-gray-900">{domain.age}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">
                          {formatPrice(domain.price)}
                        </span>
                        <p className="text-xs text-gray-500">by {domain.seller}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="btn-secondary text-sm px-3 py-2">
                          Make Offer
                        </button>
                        <Link
                          to={`/domain/${domain.id}`}
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
            
            {filteredDomains.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No domains found matching your criteria</p>
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

export default DomainsPage;