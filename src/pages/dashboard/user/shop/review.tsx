import { MainWrapperLayout } from '@/src/layouts';
import ReviewSubmision from '@/src/layouts/user/maching-store/shop/review';
import { useLocation, useParams } from 'react-router-dom';

interface ReviewPageState {
  store: string;
  area: string;
  district: string;
}
const Review = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const state = location.state as ReviewPageState | undefined;

  const store = state?.store;
  const area = state?.area;
  const district = state?.district;

  if (store && area && district) {
    return (
      <div className="bg-white">
        <MainWrapperLayout>
          <ReviewSubmision store={store} area={area} district={district} />
        </MainWrapperLayout>
      </div>
    );
  }
  return <div>No review data available</div>;
};

export default Review;
