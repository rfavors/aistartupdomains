import { Link } from 'react-router-dom';
import { SparklesIcon, HeartIcon, ShieldCheckIcon, StarIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    marketplace: [
      { name: 'Browse Domains', href: '/domains' },
      { name: 'Browse Websites', href: '/websites' },
      { name: 'AI Domain Generator', href: '/#generator' },
      { name: 'Featured Domains', href: '/#featured' },
    ],
    sellers: [
      { name: 'Sell Your Domain', href: '/seller-dashboard' },
      { name: 'Seller Guidelines', href: '/seller-guidelines' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Success Stories', href: '/success-stories' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Escrow & Payment FAQ', href: '/escrow-faq' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-mesh opacity-10"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1 animate-fade-in">
            <Link to="/" className="group flex items-center space-x-3 mb-6 hover-glow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">AI Startup Domains</span>
            </Link>
            <p className="text-gray-300 text-base mb-6 leading-relaxed">
              The premier marketplace for AI and startup domains. Buy, sell, and discover premium domains for your next venture.
            </p>
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4" />
                ))}
              </div>
              <span className="text-sm text-gray-400">Trusted by 15,000+ entrepreneurs</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600 transition-all duration-300 transform hover:scale-110 hover-glow">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600 transition-all duration-300 transform hover:scale-110 hover-glow">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 hover-glow">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500 transition-all duration-300 transform hover:scale-110 hover-glow">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
            <h3 className="text-base font-bold text-white mb-6 flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2 text-primary-400" />
              Marketplace
            </h3>
            <ul className="space-y-3">
              {footerLinks.marketplace.map((link, index) => (
                <li key={link.name} className="animate-fade-in" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 text-sm flex items-center group"
                  >
                    <span className="w-1 h-1 bg-primary-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
            <h3 className="text-base font-bold text-white mb-6 flex items-center">
              <HeartIcon className="w-5 h-5 mr-2 text-red-400" />
              For Sellers
            </h3>
            <ul className="space-y-3">
              {footerLinks.sellers.map((link, index) => (
                <li key={link.name} className="animate-fade-in" style={{animationDelay: `${0.3 + index * 0.1}s`}}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 text-sm flex items-center group"
                  >
                    <span className="w-1 h-1 bg-red-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
            <h3 className="text-base font-bold text-white mb-6 flex items-center">
              <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-400" />
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={link.name} className="animate-fade-in" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 text-sm flex items-center group"
                  >
                    <span className="w-1 h-1 bg-green-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
            <h3 className="text-base font-bold text-white mb-6 flex items-center">
              <StarIcon className="w-5 h-5 mr-2 text-yellow-400" />
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={link.name} className="animate-fade-in" style={{animationDelay: `${0.5 + index * 0.1}s`}}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 text-sm flex items-center group"
                  >
                    <span className="w-1 h-1 bg-yellow-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 mb-12">
          <div className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 rounded-3xl p-8 glass-effect border border-primary-500/20">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-primary-500/20 rounded-full text-primary-300 text-sm font-medium mb-4">
                <HeartIcon className="w-4 h-4 mr-2" />
                Stay Updated
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 gradient-text">
                Get the latest domain insights
              </h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Subscribe to our newsletter for exclusive domain deals, market trends, and AI-powered recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-medium hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 transform hover:scale-105 hover-glow">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <p className="text-gray-300 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                © {currentYear} AIStartupDomains.com. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <ShieldCheckIcon className="w-4 h-4 mr-1 text-green-400" />
                  SSL Secured
                </span>
                <span className="flex items-center">
                  <HeartIcon className="w-4 h-4 mr-1 text-red-400" />
                  Made with love
                </span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-y-[-2px]">
                Terms
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-y-[-2px]">
                Privacy
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-y-[-2px]">
                Cookies
              </Link>
              <Link to="/help" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-y-[-2px]">
                Help
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-y-[-2px]">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;