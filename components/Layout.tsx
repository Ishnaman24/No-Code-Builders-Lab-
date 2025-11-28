import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Film, LogOut, Menu, X, List, Heart, Compass } from 'lucide-react';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoggedIn, logout } = useApp();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide nav on landing page if not logged in
  const isLanding = location.pathname === '/' && !isLoggedIn;

  const navLinks = [
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/watchlist', label: 'Watchlist', icon: List },
    { to: '/preferences', label: 'Preferences', icon: Heart },
  ];

  if (isLanding) {
    return <main className="min-h-screen flex flex-col font-sans">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-vista-bg text-slate-100 font-sans selection:bg-rose-500/30">
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled 
            ? 'bg-vista-bg/80 backdrop-blur-xl border-slate-800/50 py-3 shadow-lg' 
            : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to={isLoggedIn ? "/explore" : "/"} className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-900/20 transition-transform group-hover:scale-105">
                <Film className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                CINEVISTA
              </span>
            </Link>

            {isLoggedIn && (
              <nav className="hidden md:flex items-center gap-1">
                <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/5 backdrop-blur-md mr-4">
                  {navLinks.map((link) => {
                     const isActive = location.pathname.startsWith(link.to);
                     return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                          isActive
                            ? 'bg-gradient-to-r from-rose-600 to-violet-600 text-white shadow-md' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <link.icon size={16} />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
                
                <button
                  onClick={logout}
                  className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </nav>
            )}

            {isLoggedIn && (
              <div className="md:hidden">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            )}
            
            {!isLoggedIn && (
               <div className="flex items-center gap-4">
                 <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</Link>
                 <Link to="/" className="px-5 py-2.5 text-sm font-semibold bg-white text-black rounded-full hover:bg-slate-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    Get Started
                 </Link>
               </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-vista-bg/95 backdrop-blur-xl border-b border-slate-800 transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium flex items-center gap-3 ${
                  location.pathname.startsWith(link.to)
                    ? 'bg-white/10 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-slate-800 my-2"></div>
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-12">
        {children}
      </main>

      <footer className="border-t border-slate-800/50 bg-vista-bg py-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="w-6 h-6 rounded bg-rose-500 flex items-center justify-center">
                <Film className="text-white w-3 h-3" />
             </div>
             <span className="font-bold text-lg text-white">CINEVISTA</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} CineVista AI. Experience the future of cinema discovery.
          </p>
        </div>
      </footer>
    </div>
  );
};