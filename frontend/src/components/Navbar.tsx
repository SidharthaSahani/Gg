import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  isAdmin?: boolean;
  adminEmail?: string | null;
  onLogout?: () => void;
}

export default function Navbar({ isAdmin = false, adminEmail, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToContact = () => {
    // Close the mobile menu if it's open
    setIsMenuOpen(false);
    
    // Wait for menu to close then scroll
    setTimeout(() => {
      const footerElement = document.getElementById('contact-footer');
      if (footerElement) {
        footerElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If no footer with id found, scroll to the actual page footer
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side: Logo and Restaurant Name */}
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-4">
              <img
                src="/logoHD.png" 
                alt="Grill & Gather Logo" 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-contain" 
              />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {isAdmin ? 'Restaurant Admin' : 'Grills & Gather'}
              </h1>
            </a>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin && adminEmail && (
              <div className="text-base text-gray-600">
                <span className="font-medium">Admin:</span> {adminEmail}
              </div>
            )}

            {isAdmin && onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-base"
              >
                <span>Logout</span>
              </button>
            )}

            {/* Navigation links */}
            <div className="flex items-center gap-3 sm:gap-4">
              {isAdmin ? (
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition text-base"
                >
                  Home
                </a>
              ) : (
                <>
                  <Link to="/" className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition text-base">
                    Home
                  </Link>
                  <Link to="/about" className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition text-base">
                    About Us
                  </Link>
                  <a href="#contact" className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition text-base" onClick={(e) => {
                    e.preventDefault();
                    scrollToContact();
                  }}>
                    Contact
                  </a>
                </>
              )}

            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Only visible when menu is open */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-3">
              {isAdmin && adminEmail && (
                <div className="text-base text-gray-600 py-2">
                  <span className="font-medium">Admin:</span> {adminEmail}
                </div>
              )}

              {isAdmin ? (
                <>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </a>
                  {isAdmin && onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-base"
                    >
                      Logout
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Link 
                    to="/" 
                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <a 
                    href="#contact" 
                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition text-base"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToContact();
                    }}
                  >
                    Contact
                  </a>

                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}