import useBodyClass from '@/src/hooks/useBodyClass';
import { BillingDetailsListLayout, MainWrapperLayout } from '@/src/layouts';

function BillingDetailsPage() {
  useBodyClass('white_page');
  return (
    <MainWrapperLayout>
      <BillingDetailsListLayout />
    </MainWrapperLayout>
  );
}

export default BillingDetailsPage;
