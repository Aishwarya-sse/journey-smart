// Header Component with Navigation

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Train, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Ticket, 
  Search,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isLoggedIn, getUser, removeUser } from '@/utils/storage';
import { cn } from '@/lib/utils';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const user = getUser();

  const handleLogout = () => {
    removeUser();
    navigate('/login');
  };

  const navLinks = [
    { href: '/search', label: 'Book Tickets', icon: Search },
    { href: '/bookings', label: 'My Bookings', icon: History },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-lg">
            <Train className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl hidden sm:inline">
            RailBook
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {loggedIn && navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive(link.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {loggedIn ? (
            <>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                <User size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">{user?.username}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden md:flex text-muted-foreground hover:text-destructive"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background animate-fade-in">
          <div className="container py-4 space-y-2">
            {loggedIn ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg mb-4">
                  <User size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
                      isActive(link.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <link.icon size={16} />
                    {link.label}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
