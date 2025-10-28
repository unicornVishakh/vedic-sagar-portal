import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

interface NavItem {
  label: string;
  href: string;
}

interface PillNavProps {
  logo: string;
  logoAlt: string;
  items: NavItem[];
  className?: string;
  ease?: string;
}

const PillNav = ({ logo, logoAlt, items, className = '', ease = 'power2.out' }: PillNavProps) => {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const currentIndex = items.findIndex(item => item.href === location.pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname, items]);

  useEffect(() => {
    const activeItem = itemRefs.current[activeIndex];
    const pill = pillRef.current;

    if (activeItem && pill) {
      const { offsetLeft, offsetWidth } = activeItem;
      gsap.to(pill, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.6,
        ease: ease,
      });
    }
  }, [activeIndex, ease]);

  const handleMouseEnter = (index: number) => {
    const item = itemRefs.current[index];
    const pill = pillRef.current;

    if (item && pill) {
      const { offsetLeft, offsetWidth } = item;
      gsap.to(pill, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.4,
        ease: ease,
      });
    }
  };

  const handleMouseLeave = () => {
    const activeItem = itemRefs.current[activeIndex];
    const pill = pillRef.current;

    if (activeItem && pill) {
      const { offsetLeft, offsetWidth } = activeItem;
      gsap.to(pill, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.4,
        ease: ease,
      });
    }
  };

  return (
    <nav className={`flex items-center justify-between px-6 py-4 ${className}`} ref={navRef}>
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={logo} alt={logoAlt} className="h-12 w-12" />
      </Link>

      {/* Navigation Items */}
      <div className="relative flex items-center gap-2 bg-muted rounded-full px-2 py-2">
        {/* Animated Pill */}
        <div
          ref={pillRef}
          className="absolute h-10 bg-primary rounded-full transition-all"
          style={{ left: 0, top: '50%', transform: 'translateY(-50%)' }}
        />

        {/* Nav Items */}
        {items.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive ? 'text-primary-foreground' : 'text-foreground hover:text-foreground/80'
              }`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => setActiveIndex(index)}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default PillNav;
