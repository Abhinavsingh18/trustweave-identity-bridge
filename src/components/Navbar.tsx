
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-blockchain-blue" />
              <span className="ml-2 text-xl font-bold text-blockchain-dark dark:text-white">TrustWeave</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blockchain-blue dark:text-gray-300 dark:hover:text-white">
              Home
            </Link>
            <Link to="/verify" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blockchain-blue dark:text-gray-300 dark:hover:text-white">
              Verify Identity
            </Link>
            <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blockchain-blue dark:text-gray-300 dark:hover:text-white">
              Dashboard
            </Link>
            <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blockchain-blue dark:text-gray-300 dark:hover:text-white">
              About
            </Link>
            
            {!user ? (
              <>
                <Button variant="outline" className="ml-4" onClick={() => navigate("/auth")}>
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button 
                  className="ml-2 bg-blockchain-blue hover:bg-blockchain-teal text-white"
                  onClick={() => {
                    navigate("/auth");
                    setTimeout(() => {
                      // This will automatically switch to the register tab when arrived at the auth page
                      const registerTab = document.querySelector('[value="register"]');
                      if (registerTab) {
                        (registerTab as HTMLElement).click();
                      }
                    }, 100);
                  }}
                >
                  Register
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-4">
                    <User className="h-4 w-4 mr-2" />
                    {user.email?.split('@')[0] || 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blockchain-blue dark:text-gray-300 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/verify"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blockchain-blue dark:text-gray-300 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Verify Identity
            </Link>
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blockchain-blue dark:text-gray-300 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blockchain-blue dark:text-gray-300 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {!user ? (
                <>
                  <Button variant="outline" className="w-full mb-2" onClick={() => {
                    navigate("/auth");
                    setIsOpen(false);
                  }}>
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button 
                    className="w-full bg-blockchain-blue hover:bg-blockchain-teal text-white"
                    onClick={() => {
                      navigate("/auth");
                      setIsOpen(false);
                      setTimeout(() => {
                        // This will automatically switch to the register tab when arrived at the auth page
                        const registerTab = document.querySelector('[value="register"]');
                        if (registerTab) {
                          (registerTab as HTMLElement).click();
                        }
                      }, 100);
                    }}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 text-sm font-medium text-gray-400">
                    Signed in as: {user.email}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
