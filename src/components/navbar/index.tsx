import Logo from '@/src/assets/logo-top.png';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/src/context/auth-context';
import { Link } from 'react-router-dom'; // Import Link

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="w-full bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/"> {/* Wrap logo in Link component */}
            <img className="h-16 w-auto cursor-pointer" src={Logo} alt="CTN Logo" />
          </Link>
        </div>

        {/* Right: Logout Button */}
        {isAuthenticated && (
          <Button
            className="bg-[#002b5c] text-white px-6 py-2 rounded-sm hover:bg-[#001f43]"
            onClick={logout}
          >
            ログアウト
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
