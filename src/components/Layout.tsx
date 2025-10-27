import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Donate", path: "/donation" },
    { label: "Reach Out", path: "/donation#contact" },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`flex ${mobile ? "flex-col" : "flex-col md:flex-row"} gap-2`}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => mobile && setOpen(false)}
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
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col h-full">
                <div className="flex-1 py-6">
                  <NavLinks mobile />
                </div>
                <div className="pb-6">
                  <img src="/placeholder.svg" alt="Logo" className="w-16 h-16 mx-auto" />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-bold text-primary">Vedic Knowledge</h1>

          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 border-r bg-sidebar">
        <div className="flex flex-col h-full p-6">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-primary mb-8">Vedic Knowledge</h1>
            <NavLinks />
          </div>
          <div className="pb-4">
            <img src="/placeholder.svg" alt="Logo" className="w-20 h-20 mx-auto" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 w-full">
        {children}
        
        {/* Footer */}
        <footer className="mt-auto border-t bg-muted/30 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Built and Maintained by Neural AI | © {new Date().getFullYear()} Arya Samaj
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
