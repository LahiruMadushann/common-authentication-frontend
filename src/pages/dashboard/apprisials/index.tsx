import { useTypedSelector } from '@/src/app/store';
import { RatingAndOtherDataSec } from '@/src/layouts/singleApprisialCompo/ratingAndOtherDataSec';
import { TabSection } from '@/src/layouts/singleApprisialCompo/tabSection';
import { useApprisialStore } from '@/src/stores/apprisials.store';
const SingleApprisial = () => {
  const { singleAprisial } = useApprisialStore();
  const appraisalId = singleAprisial?.appraisalid?.content;
  const userId = useTypedSelector((state) => state.auth.userId);

  const assessedDate = singleAprisial?.assessed?.assessedDateTime;


  return (
    <>
      <RatingAndOtherDataSec user={singleAprisial?.customer} appraisalId={appraisalId} userId={userId} assessedDate={assessedDate} />
      <TabSection assessedData={singleAprisial} />
    </>
  );
};

export default SingleApprisial;
