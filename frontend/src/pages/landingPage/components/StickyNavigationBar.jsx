import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const StickyNavigationBar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  const navigationItems = [
    { label: 'Solution', anchor: '#solution', section: 'solution', tooltip: 'Explore organized chat interface' },
    { label: 'Features', anchor: '#features', section: 'features', tooltip: 'Key benefits and comparisons' },
    { label: 'Demo', anchor: '#demo', section: 'demo', tooltip: 'See it in action' },
    { label: 'Pricing', anchor: '#pricing', section: 'pricing', tooltip: 'Calculate your ROI' },
    { label: 'Security', anchor: '#security', section: 'security', tooltip: 'Trust and compliance' },
    { label: 'Contact', anchor: '#contact', section: 'contact', tooltip: 'Get in touch' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement?.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(progress);

      const sections = navigationItems?.map(item => item?.section);
      let currentSection = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element?.getBoundingClientRect();
          if (rect?.top <= 120 && rect?.bottom >= 120) {
            currentSection = section;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (anchor) => {
    setIsMenuOpen(false);
    const element = document.querySelector(anchor);
    if (element) {
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <header className="nav-header fixed top-0 left-0 right-0 z-[1000]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="nav-logo cursor-pointer" onClick={() => handleNavClick('#hero')}>
              ChatFlow Pro
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {navigationItems?.map((item) => (
                <a
                  key={item?.section}
                  href={item?.anchor}
                  className={`nav-link ${activeSection === item?.section ? 'active' : ''}`}
                  onClick={(e) => {
                    e?.preventDefault();
                    handleNavClick(item?.anchor);
                  }}
                  title={item?.tooltip}
                >
                  {item?.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:block">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
                className="hidden sm:flex border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              >
                Login
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/chat')}
                className="hidden sm:flex bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Try Chat
              </Button>
            </div>

            <button
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <Icon name={isMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </header>
      <div 
        className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
      />
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="nav-logo">ChatFlow Pro</div>
            <button
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            {navigationItems?.map((item) => (
              <a
                key={item?.section}
                href={item?.anchor}
                className={`nav-link py-3 px-4 rounded-lg hover:bg-muted transition-colors ${
                  activeSection === item?.section ? 'active bg-muted' : ''
                }`}
                onClick={(e) => {
                  e?.preventDefault();
                  handleNavClick(item?.anchor);
                }}
              >
                {item?.label}
              </a>
            ))}
          </nav>

          <div className="mt-8">
            <Button 
              variant="default" 
              className="cta-button w-full"
              onClick={() => {
                toggleMenu();
                navigate('/login');
              }}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StickyNavigationBar;