import useBodyClass from '@/src/hooks/useBodyClass';
import { BuyerRegisterForm } from './buyerRegisterForm';
import { Navbar } from '@/src/components';
import { MainWrapperLayout } from '@/src/layouts';
import { useAuth } from '@/src/context/auth-context';

const BuyerRegisterPage: React.FC = () => {
  useBodyClass('white_page');
  const { isAuthenticated } = useAuth();
  return (
    <MainWrapperLayout>
      {!isAuthenticated && <Navbar />}
      <div className="flex justify-center items-center max-w-screen px-4 py-6   bg-white">
        <BuyerRegisterForm />
      </div>
    </MainWrapperLayout>
  );
};

export default BuyerRegisterPage;
