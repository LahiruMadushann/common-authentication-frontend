import { useNavigate, useLocation } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useTabStore } from '@/src/stores/tabStore';

export default function NavigatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathsToHideArrow = ['/', '/login', '/user', '/register'];
  const shouldHideArrow = pathsToHideArrow.includes(location.pathname);
  const { tabKey, setTabKeyAction } = useTabStore();


  const navigateToPreviousPage = () => {
    switch (tabKey) {
      case '7':
      case '6':
        setTabKeyAction('5');
        break;
      case '4':
        setTabKeyAction('1');
        break;
      default:
        navigate(-1);
    }
  };

  useEffect(() => {
    // Scroll to top whenever the location changes (including back navigation)
    window.scrollTo({
      top: 0
    });
  }, [location,tabKey]);

  return (
    <div>
      {!shouldHideArrow && (
        <div className="mb-5">
          <Button variant="default" onClick={navigateToPreviousPage}>
            <IoMdArrowRoundBack size="20" />
          </Button>
        </div>
      )}
    </div>
  );
}
