import { useEffect, useState } from 'react';
import { useAppStore } from '../stores/app.store';
import { getShopById } from '../services/shop.service';
import { setCustomErrorToast } from '../utils/notification';
import { MESSAGES } from '../constants/messages.constant';

export const useFetchShopByIdHook = (id: any) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [shop, setShop] = useState<any>();
  const { editRegisterId } = useAppStore();
  const initialValues = {
    companyName: '',
    name: '',
    shopTypeEnum: '',
    headBranchId: null,
    storeSubscriptionType: null,
    email: '',
    phone: '',
    postalCode: '',
    prefectures: '',
    manicipalities: '',
    address: '',
    shopExclusivity: '',
    exIntroductionFee: 0,
    nonExReferralFee: 0,
    paymentType: '',
    pic: '',
    billingEmails: '',
    startDate: null, // Use `dayjs()` for an empty date if required: `dayjs()`
    billingDepartment: '',
    appealStatement: '',
    businessHours: '',
    shopVacations: [
      {
        start: '',
        end: ''
      }
    ],
    holidayMatching: false,
    shopHolidays: [],
    cancellationCategory: 'NONE',
    billingDataInvoices: [
      {
        zipCode: '',
        billingPrefecture: '',
        billingMunicipalities: '',
        billingAddress: '',
        billingDepartment: '',
        pic: ''
      }
    ],
    shopImageUrl: ''
  };

  const fetchShopById = async () => {
    try {
      setLoading(true);
      const response = await getShopById(id || editRegisterId);
      setShop(response);
      setLoading(false);
    } catch (error: any) {
      setCustomErrorToast(MESSAGES.HAVE_PROBLEM);
      setShop(initialValues);
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id || editRegisterId) {
      fetchShopById();
    } else {
      setShop(initialValues);
    }
  }, [id, editRegisterId]);

  return { shop, error, loading };
};
