import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DomainsPage from './pages/DomainsPage';
import WebsitesPage from './pages/WebsitesPage';
import BlogPage from './pages/BlogPage';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DomainDetail from './pages/DomainDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/domains" element={<DomainsPage />} />
            <Route path="/websites" element={<WebsitesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/domain/:slug" element={<DomainDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
