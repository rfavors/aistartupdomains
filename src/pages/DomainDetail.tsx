import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  HeartIcon,
  ShareIcon,
  EyeIcon,
  CalendarIcon,
  GlobeAltIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface DomainDetail {
  id: string;
  title: string;
  type: 'domain' | 'website';
  price: number;
  description: string;
  seller: {
    name: string;
    avatar?: string;
    rating: number;
    totalSales: number;
    joinedAt: string;
  };
  features: string[];
  stats: {
    views: number;
    inquiries: number;
    listedAt: string;
    lastUpdated: string;
  };
  images?: string[];
  tags: string[];
  isFeatured: boolean;
  isVerified: boolean;
  relatedDomains: {
    id: string;
    title: string;
    price: number;
    type: 'domain' | 'website';
  }[];
}

const DomainDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [domain, setDomain] = useState<DomainDetail | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    offer: ''
  });

  useEffect(() => {
    // Mock data - replace with API call
    const mockDomain: DomainDetail = {
      id: id || '1',
      title: 'AIStartupHub.com',
      type: 'domain',
      price: 12500,
      description: 'Premium domain perfect for AI startups, incubators, and technology companies. This memorable and brandable domain name combines the growing AI industry with the startup ecosystem, making it ideal for platforms that connect AI entrepreneurs, investors, and innovators.',
      seller: {
        name: 'John Doe',
        rating: 4.8,
        totalSales: 23,
        joinedAt: '2023-06-15'
      },
      features: [
        'Short and memorable',
        'Exact match keywords',
        'High commercial value',
        'Global appeal',
        'SEO friendly',
        'Brandable'
      ],
      stats: {
        views: 245,
        inquiries: 8,
        listedAt: '2025-01-15',
        lastUpdated: '2025-01-28'
      },
      tags: ['AI', 'Startup', 'Technology', 'Business', 'Premium'],
      isFeatured: true,
      isVerified: true,
      relatedDomains: [
        {
          id: '2',
          title: 'SmartFintech.io',
          price: 8900,
          type: 'domain'
        },
        {
          id: '3',
          title: 'TechAI.com',
          price: 15000,
          type: 'domain'
        },
        {
          id: '4',
          title: 'AIInnovate.net',
          price: 6500,
          type: 'domain'
        }
      ]
    };

    setDomain(mockDomain);
  }, [id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle inquiry submission
    console.log('Inquiry submitted:', inquiryForm);
    setShowInquiryForm(false);
    // Reset form
    setInquiryForm({
      name: '',
      email: '',
      phone: '',
      message: '',
      offer: ''
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: domain?.title,
        text: `Check out this ${domain?.type}: ${domain?.title}`,
        url: window.location.href
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!domain) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading domain details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-gray-500">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <Link 
                  to={domain.type === 'domain' ? '/domains' : '/websites'} 
                  className="text-gray-400 hover:text-gray-500"
                >
                  {domain.type === 'domain' ? 'Domains' : 'Websites'}
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <span className="text-gray-900 font-medium">{domain.title}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{domain.title}</h1>
                    {domain.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                    {domain.isVerified && (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" title="Verified Listing" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      <span>{domain.stats.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Listed {formatDate(domain.stats.listedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {domain.tags.map((tag, index) => (
                      <span key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    {isLiked ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    <ShareIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="text-4xl font-bold text-primary-600 mb-4">
                {formatCurrency(domain.price)}
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {domain.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {domain.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{domain.stats.views}</div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{domain.stats.inquiries}</div>
                  <div className="text-sm text-gray-600">Inquiries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{domain.title.length}</div>
                  <div className="text-sm text-gray-600">Characters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">.com</div>
                  <div className="text-sm text-gray-600">Extension</div>
                </div>
              </div>
            </div>

            {/* Related Domains */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Related {domain.type === 'domain' ? 'Domains' : 'Websites'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {domain.relatedDomains.map((related) => (
                  <Link
                    key={related.id}
                    to={`/${related.type}/${related.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{related.title}</h3>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                          related.type === 'domain' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {related.type.charAt(0).toUpperCase() + related.type.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary-600">
                          {formatCurrency(related.price)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase/Inquiry Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {formatCurrency(domain.price)}
                </div>
                <p className="text-gray-600">Buy It Now Price</p>
              </div>
              
              <div className="space-y-3">
                <button className="w-full btn-primary">
                  Buy Now
                </button>
                <button
                  onClick={() => setShowInquiryForm(true)}
                  className="w-full btn-secondary"
                >
                  Make Inquiry
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Make Offer
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <GlobeAltIcon className="h-4 w-4" />
                  <span>Secure transaction</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Verified seller</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span>30-day money back guarantee</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {domain.seller.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{domain.seller.name}</div>
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {domain.seller.rating} ({domain.seller.totalSales} sales)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Member since:</span>
                  <span>{formatDate(domain.seller.joinedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total sales:</span>
                  <span>{domain.seller.totalSales}</span>
                </div>
                <div className="flex justify-between">
                  <span>Response time:</span>
                  <span>Within 2 hours</span>
                </div>
              </div>
              
              <button className="w-full mt-4 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                Contact Seller
              </button>
            </div>

            {/* Domain Tools */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Domain Tools</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <ChartBarIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Domain Valuation</span>
                </button>
                <button className="w-full flex items-center gap-2 text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">WHOIS Lookup</span>
                </button>
                <button className="w-full flex items-center gap-2 text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">SEO Analysis</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send Inquiry</h3>
              <button
                onClick={() => setShowInquiryForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Amount (USD)
                </label>
                <input
                  type="number"
                  value={inquiryForm.offer}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, offer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell the seller about your interest..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInquiryForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainDetail;