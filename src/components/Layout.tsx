import { Home, CalendarDays, Newspaper, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/home", icon: Home },
    { label: "Events", path: "/events", icon: CalendarDays },
    { label: "News", path: "/news", icon: Newspaper },
    { label: "Donate", path: "/donation", icon: Heart },
  ];

  const NavLinks = () => (
    <nav className="flex flex-row gap-2">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            location.pathname === item.path
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/download.png"
              alt="Arya Samaj Logo"
              className="w-12 h-12"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Veda Vogue
            </h1>
          </div>
          <NavLinks />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col pb-16 md:pb-0">
        <div className="flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t bg-muted/30 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Built and Maintained by Neural AI | © {new Date().getFullYear()} Arya Samaj
            </p>
          </div>
        </footer>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
        <nav className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-md transition-colors w-1/4 ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
