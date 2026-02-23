import { Button, Modal } from 'antd';
import placeholder from '../../assets/images/no-image-placeholder.png';
import { formatPhoneNumber } from '@/src/utils/formatPhoneNumber';

interface PreviewScreenProps {
  visible: boolean;
  onClose: () => void;
  formData: {
    name?: string;
    appealStatement?: string;
    shopHolidays?: Array<{ week?: number; day?: string }>;
    shopVacations?: Array<{ start?: string; end?: string }>;
    shopImageUrl?: string;
    postalCode?: string;
    prefectures?: string;
    manicipalities?: string;
    address?: string;
    phone?: string;
    businessHours?: string;
    companyName?: string;
  };
}

const PreviewScreen: React.FC<PreviewScreenProps> = ({ visible, onClose, formData }) => {
  const formatShopHolidays = () => {
    if (!formData?.shopHolidays || formData?.shopHolidays?.length === 0) return '--';

    const dayNames: any = {
      SUNDAY: '日曜日',
      MONDAY: '月曜日',
      TUESDAY: '火曜日',
      WEDNESDAY: '水曜日',
      THURSDAY: '木曜日',
      FRIDAY: '金曜日',
      SATURDAY: '土曜日'
    };
    const filteredHolidays = formData?.shopHolidays?.filter(
      (holiday) => holiday?.day !== '' && holiday?.day !== null
    );

    return filteredHolidays
      ?.map((holiday: any) => {
        const week = holiday?.week;
        const dayName = dayNames[holiday?.day];
        if (!week || !dayName) {
          return '-';
        }

        return `第${week}${dayName}`;
      })
      .join(',');
  };

  const formatShopVacations = () => {
    if (!formData?.shopVacations || formData?.shopVacations?.length === 0) {
      return '--';
    }

    const vacation = formData?.shopVacations[0];

    // Check if vacation exists
    if (!vacation || !vacation.start || !vacation.end) {
      return '--';
    }

    const startDate = vacation?.start?.split(' ')[0] ?? '--';
    const endDate = vacation?.end?.split(' ')[0] ?? '--';

    return `${startDate} ~ ${endDate}`;
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
      width="auto"
      wrapClassName="notranslate"
      style={{ maxWidth: '60vw', maxHeight: '90vh', overflow: 'auto' }}>
      <div className="container mx-auto mt-4 p-4">
        <div>
          <p className="text-2xl md:text-3xl lg:text-3xl font-bold">{formData?.name ?? '--'}</p>
          <p className="mt-2 text-sm md:text-base lg:text-lg">
            {formData?.appealStatement ?? '--'}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 flex justify-start">
            <div
              className="w-72 h-72 rounded overflow-hidden"
              style={{ maxWidth: '300px', maxHeight: '300px' }}>
              <img
                src={formData?.shopImageUrl ?? placeholder}
                alt="Shop Image"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="col-span-2">
            <table className="mt-2 w-full text-sm md:text-base lg:text-lg">
              <tbody>
                <tr className="border-b-[2vh] border-transparent">
                  <td className="pr-4">住所</td>
                  <td>
                    {formData?.postalCode ?? '--'}{' '} {formData?.prefectures ?? '--'}
                    {formData?.manicipalities ?? '--'}{' '} {formData?.address ?? '--'}
                  </td>
                </tr>
                <tr className="border-b-[2vh] border-transparent">
                  <td>電話番号</td>
                  <td>{formatPhoneNumber(formData?.phone ?? '--')}</td>
                </tr>
                <tr className="border-b-[2vh] border-transparent">
                  <td>営業時間</td>
                  <td>{formData?.businessHours ?? '--'}</td>
                </tr>
                <tr className="border-b-[2vh] border-transparent">
                  <td>定休日</td>
                  <td>{formatShopHolidays() ?? '--'}</td>
                </tr>
                <tr className="border-b-[2vh] border-transparent">
                  <td>休暇期間</td>
                  <td>{formatShopVacations() ?? '--'}</td>
                </tr>
                <tr className="border-b-[2vh] border-transparent">
                  <td>運営</td>
                  <td>{formData?.companyName ?? '--'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Button key="back" onClick={onClose} className="bg-orange-500 text-white">
            買取店情報の編集に戻る
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PreviewScreen;
