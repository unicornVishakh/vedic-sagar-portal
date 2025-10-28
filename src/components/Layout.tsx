import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import PillNav from "./PillNav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", href: "/home" },
    { label: "Donate", href: "/donation" },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`flex ${mobile ? "flex-col" : "flex-row"} gap-2`}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          onClick={() => mobile && setOpen(false)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            location.pathname === item.href
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
            <SheetContent side="left" className="w-64 flex flex-col"> {/* Added flex flex-col */}
              <div className="flex-1 py-6">
                <NavLinks mobile />
              </div>
              {/* Large Logo at the bottom */}
              <div className="mt-auto pb-6 flex justify-center"> {/* Added mt-auto and flex justify-center */}
                <img
                  src="/assets/download.png" // Use the Arya Samaj logo image
                  alt="Arya Samaj Logo"
                  className="w-32 h-auto" // Increased size
                />
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-bold text-primary">Veda Vogue</h1>

          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto">
          <PillNav
            logo="/assets/download.png"
            logoAlt="Arya Samaj Logo"
            items={navItems}
            className="h-20"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col">
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
    </div>
  );
};

export default Layout;
