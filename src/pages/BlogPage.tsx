import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  featuredImage?: string;
  readTime: number;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Mock blog posts - replace with API call
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Top AI Domains for Sale This Week - January 2025',
        excerpt: 'Discover the most promising AI domain names available this week, perfect for your next startup venture.',
        content: 'Full blog post content here...',
        author: 'Sarah Johnson',
        publishedAt: '2025-01-29',
        tags: ['AI Domains', 'Weekly Featured', 'Startup'],
        readTime: 5
      },
      {
        id: '2',
        title: 'How to Choose the Perfect Domain Name for Your AI Startup',
        excerpt: 'A comprehensive guide to selecting domain names that will help your AI startup succeed in the competitive market.',
        content: 'Full blog post content here...',
        author: 'Michael Chen',
        publishedAt: '2025-01-26',
        tags: ['Domain Strategy', 'AI Startup', 'Branding'],
        readTime: 8
      },
      {
        id: '3',
        title: 'The Rise of .AI Domains: Why They\'re Worth the Investment',
        excerpt: 'Exploring the growing popularity of .AI domains and why they\'re becoming essential for tech companies.',
        content: 'Full blog post content here...',
        author: 'Emily Rodriguez',
        publishedAt: '2025-01-23',
        tags: ['.AI Domains', 'Investment', 'Tech Trends'],
        readTime: 6
      },
      {
        id: '4',
        title: 'Domain Valuation: Understanding What Makes a Domain Valuable',
        excerpt: 'Learn the key factors that determine domain value and how to assess the worth of premium domains.',
        content: 'Full blog post content here...',
        author: 'David Park',
        publishedAt: '2025-01-20',
        tags: ['Domain Valuation', 'Investment', 'Premium Domains'],
        readTime: 7
      },
      {
        id: '5',
        title: 'Success Stories: Startups That Found Their Perfect Domain',
        excerpt: 'Real stories from entrepreneurs who found success after acquiring the right domain name for their business.',
        content: 'Full blog post content here...',
        author: 'Lisa Wang',
        publishedAt: '2025-01-17',
        tags: ['Success Stories', 'Case Studies', 'Entrepreneurship'],
        readTime: 10
      },
      {
        id: '6',
        title: 'The Future of Domain Names in the Age of AI',
        excerpt: 'Exploring how artificial intelligence is changing the domain industry and what it means for investors.',
        content: 'Full blog post content here...',
        author: 'Alex Thompson',
        publishedAt: '2025-01-14',
        tags: ['AI', 'Future Trends', 'Domain Industry'],
        readTime: 9
      }
    ];
    
    setPosts(mockPosts);
    setFeaturedPost(mockPosts[0]);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Top AI Domains for Sale This Week
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest domain trends, investment insights, and featured listings in the AI and startup space.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-600 px-6 py-4">
                <span className="text-white font-semibold">Featured Article</span>
              </div>
              
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredPost.tags.map((tag, index) => (
                    <span key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>
                
                <p className="text-gray-600 text-lg mb-6">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatDate(featuredPost.publishedAt)}</span>
                    </div>
                    <span>{featuredPost.readTime} min read</span>
                  </div>
                  
                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="btn-primary"
                  >
                    Read Full Article
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blog Posts */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
            
            <div className="space-y-8">
              {posts.slice(1).map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                      <Link to={`/blog/${post.id}`}>
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <UserIcon className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                        <span>{post.readTime} min read</span>
                      </div>
                      
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Newsletter Signup */}
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Weekly Domain Newsletter
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Get the latest AI domain listings and industry insights delivered to your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button type="submit" className="w-full btn-primary">
                  Subscribe
                </button>
              </form>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TagIcon className="h-5 w-5" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, index) => (
                  <button
                    key={index}
                    className="bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-800 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Domains */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Featured Domains
              </h3>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-medium text-gray-900">AIStartupHub.com</h4>
                  <p className="text-sm text-gray-600">Perfect for AI incubators</p>
                  <p className="text-primary-600 font-semibold">$12,500</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-medium text-gray-900">SmartFintech.io</h4>
                  <p className="text-sm text-gray-600">Ideal for fintech startups</p>
                  <p className="text-primary-600 font-semibold">$8,900</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">HealthAI.com</h4>
                  <p className="text-sm text-gray-600">Healthcare AI solutions</p>
                  <p className="text-primary-600 font-semibold">$15,000</p>
                </div>
              </div>
              <Link
                to="/domains"
                className="block text-center mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View All Domains →
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">TechAI.com sold</span>
                  <span className="text-gray-500">2h ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New listing: CryptoBot.ai</span>
                  <span className="text-gray-500">5h ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">StartupAI.io featured</span>
                  <span className="text-gray-500">1d ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">MLPlatform.com sold</span>
                  <span className="text-gray-500">2d ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;