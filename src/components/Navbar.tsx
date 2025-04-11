
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, X, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { checkAdminStatus } from "@/integrations/blockchain";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavLink = ({ href, children, className, onClick }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        "transition-colors hover:text-foreground/80",
        isActive ? "text-foreground font-medium" : "text-foreground/60",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  useEffect(() => {
    // Check if user is admin
    setIsAdmin(checkAdminStatus());
  }, []);

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <nav className="container mx-auto flex h-16 items-center px-4 sm:px-6">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Shield className="h-6 w-6 text-blockchain-blue mr-2" />
              <span className="font-bold text-xl hidden sm:inline-block">BlockVerify</span>
            </Link>
            
            {!isMobile && (
              <div className="ml-8 hidden md:flex gap-6">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/verify">Verify</NavLink>
                <NavLink href="/about">About</NavLink>
                {isAdmin && (
                  <NavLink href="/admin" className="flex items-center">
                    <Shield className="h-4 w-4 mr-1 text-blockchain-blue" />
                    Admin
                  </NavLink>
                )}
              </div>
            )}
          </div>
          
          <div className="hidden md:flex gap-3">
            {user ? (
              <>
                <Button variant="outline" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/admin">Admin Login</Link>
                </Button>
              </>
            )}
          </div>

          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pr-0">
                <nav className="flex flex-col gap-4">
                  <NavLink href="/" onClick={() => setIsOpen(false)}>Home</NavLink>
                  <NavLink href="/verify" onClick={() => setIsOpen(false)}>Verify</NavLink>
                  <NavLink href="/about" onClick={() => setIsOpen(false)}>About</NavLink>
                  {isAdmin && (
                    <NavLink href="/admin" onClick={() => setIsOpen(false)} className="flex items-center">
                      <Shield className="h-4 w-4 mr-1 text-blockchain-blue" />
                      Admin Panel
                    </NavLink>
                  )}
                  
                  <div className="flex flex-col gap-2 mt-4">
                    {user ? (
                      <>
                        <Button variant="outline" asChild>
                          <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                        </Button>
                        <Button onClick={handleLogout}>Logout</Button>
                      </>
                    ) : (
                      <>
                        <Button asChild>
                          <Link to="/auth" onClick={() => setIsOpen(false)}>Login</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to="/admin" onClick={() => setIsOpen(false)}>Admin Login</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
