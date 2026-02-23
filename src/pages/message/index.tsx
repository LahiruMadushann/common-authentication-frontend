import useBodyClass from '@/src/hooks/useBodyClass';
import { MainWrapperLayout } from '@/src/layouts';
import MessageLayout from '@/src/layouts/message';
import { useLocation, useParams } from 'react-router-dom';

const Message: React.FC = () => {
  const { senderId, receiverId } = useParams<{ senderId: string; receiverId: string }>();
  useBodyClass('white_page');
  return (
    <MainWrapperLayout background=" !bg-white">
      <MessageLayout senderId={senderId} receiverId={receiverId} />
    </MainWrapperLayout>
  );
};

export default Message;
