import { Navbar, NavigatePage } from '@/src/components';
import { Footer } from '@/src/components/footer/footer';
import { MobileRegionSelector, RegionSelector } from '@/src/components/footer/regionsSelector';
import { useAuth } from '@/src/context/auth-context';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  background?: string;
}

const MainWrapperLayout: FunctionComponent<Props> = (props) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Track route changes
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setUserRole(storedRole);
    if (!isAuthenticated) {
      // navigate('/login');
    }
  }, [isAuthenticated]);

  // Scroll to top on route change (for child components as well)
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0, // Optional: for smooth scrolling
      });
    };
    scrollToTop();
  }, [location]); // Triggers when the route changes

  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated && <Navbar />}
      <div className={`flex-grow max-w-7xl mx-auto p-4 w-full ${props.background}`}>
        <NavigatePage />
        {props.children}
      </div>
      
      {isAuthenticated && (
        <>
          {/* {userRole === 'ROLE_USER' && (
            <>
              <div className="hidden lg:block">
                <RegionSelector />
              </div>
              <div className="lg:hidden">
                <MobileRegionSelector />
              </div>
            </>
          )} */}
          <Footer />
        </>
      )}
    </div>
  );
};

export default MainWrapperLayout;