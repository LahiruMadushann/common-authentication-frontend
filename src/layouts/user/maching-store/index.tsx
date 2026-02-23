import StoreList from './storeList';
import { Loader } from '@/src/components/loader/loader';

function MatchingStoreLayout({ data }: any) {
  return (
    <div className="w-full   ">
      {data === undefined ? (
        <Loader />
      ) : (
        <div className="mt-6 w-full  ">
          <StoreList shopList={data ? data : []} />
        </div>
      )}
    </div>
  );
}

export default MatchingStoreLayout;
