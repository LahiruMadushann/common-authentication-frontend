import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTopOnNavigate = (dependency?: any) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [dependency]);
};
