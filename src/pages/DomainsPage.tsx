import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getDomains, getCategories, type Domain, type Category, type DomainFilters } from '../services/api';

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch domains and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories([{ id: 0, name: 'all' }, ...categoriesData]);
        
        // Fetch domains with current filters
        const filters: DomainFilters = {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchTerm || undefined,
          status: 'available'
        };
        
        // Add price range filter
        if (priceRange !== 'all') {
          const [min, max] = getPriceRange(priceRange);
          if (min !== undefined) filters.min_price = min;
          if (max !== undefined) filters.max_price = max;
        }
        
        const response = await getDomains(filters, { page: currentPage, limit: 12 });
        setDomains(response.data);
        setFilteredDomains(response.data);
        
        if (response.pagination) {
          setTotalPages(response.pagination.total_pages);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch domains');
        console.error('Error fetching domains:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCategory, searchTerm, priceRange, sortBy, currentPage]);
  
  // Helper function to convert price range string to min/max values
  const getPriceRange = (range: string): [number | undefined, number | undefined] => {
    switch (range) {
      case 'under-5k': return [undefined, 5000];
      case '5k-10k': return [5000, 10000];
      case '10k-20k': return [10000, 20000];
      case 'over-20k': return [20000, undefined];
      default: return [undefined, undefined];
    }
  };

  // Local filtering and sorting (since API handles most filtering)
  useEffect(() => {
    let filtered = [...domains];

    // Sort domains locally
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      }
    });

    setFilteredDomains(filtered);
  }, [domains, sortBy]);


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
                  <option key={category.id} value={category.name}>
                    {category.name === 'all' ? 'All Categories' : category.name}
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
                {loading ? (
                  'Loading domains...'
                ) : error ? (
                  <span className="text-red-600">Error: {error}</span>
                ) : (
                  `Showing ${filteredDomains.length} of ${domains.length} domains`
                )}
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">Failed to load domains</div>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : filteredDomains.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">No domains found matching your criteria</div>
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDomains.map((domain) => (
                  <div key={domain.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {domain.is_featured && (
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
                      
                      {(domain.traffic_stats || domain.domain_age) && (
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          {domain.traffic_stats && (
                            <div>
                              <span className="text-gray-500">Traffic</span>
                              <p className="font-medium text-gray-900">{domain.traffic_stats}</p>
                            </div>
                          )}
                          {domain.domain_age && (
                            <div>
                              <span className="text-gray-500">Age</span>
                              <p className="font-medium text-gray-900">{domain.domain_age}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary-600">
                            {formatPrice(domain.price)}
                          </span>
                          {domain.seller_name && (
                            <p className="text-xs text-gray-500">by {domain.seller_name}</p>
                          )}
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
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
            
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