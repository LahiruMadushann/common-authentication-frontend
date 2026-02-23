import { useEffect, useState } from 'react';
import './buyerRegisterForm.css';
import { Button } from 'antd';
import { CheckEmailValidation, RegisterBuyer } from '@/src/services/buyer.service';
import { uploadImage } from '@/src/services/upload.service';
import { useAppStore } from '@/src/stores/app.store';
import { updateShopBuyer } from '@/src/services/shop.service';
import { useFetchShopByIdHook } from '../../hooks/useShopHook';
import dayjs from 'dayjs';
import axios from 'axios';
import { setCustomErrorToast, setSuccessToast } from '../../utils/notification';
import { getZipCodes } from '@/src/services/zipcode.service';
import { generateHourOptions, generateMinuteOptions } from '../../utils/generateTimeList';
import { useBuyerStore } from '../../stores/buyer.store';
import { Form as AntdForm } from 'antd';
import { Input } from '@/src/components/input/input';
import { Form } from '@/src/components/common/form';
import { Col, Row } from '@/src/components/common/grid';
import { FormItem } from '@/src/components/common/formItem';
import { Select } from '@/src/components/common/select';
import { Uploader } from '@/src/components/common/uploader';
import { Radio } from '@/src/components/common/radio';
import { DateTimePicker } from '@/src/components/common/datepicker';
import { InputCard } from '@/src/components/common/inputCard';
import { Checkbox } from '@/src/components/common/checkbox';
import PreviewScreen from '@/src/components/screens/previewScreen';
import {
  branchTypes,
  cancellationCategory,
  exclusiveOptions,
  paymentMethods,
  shopTypes
} from '@/src/data/buyerRegisterData';
import { MESSAGES } from '@/src/constants/messages.constant';
import { BRANCH_TYPES, BUCKET_URL } from '@/src/constants/common.constant';
import { useGetAllBranchesHook } from '@/src/hooks/useGetAllBranchesHook';
import { TableLoadingSkeleton } from '@/src/components/loading-screens';
import { useTabStore } from '@/src/stores/tabStore';
import { useScrollToTopOnNavigate } from '@/src/hooks/useScrollTop';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';

type InputValues = {
  postCode: string;
  prefectures: string;
  municipalities: string;
  Address: string;
};

type zipCodeFNType = 'billing' | 'nonBilling';

export const BuyerRegisterForm = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();

  const { clearImage, results, setResult, firstRegister, setFirstRegister } = useBuyerStore();
  const [pageLoading, setPageLoading] = useState(false);
  const [file, setFile] = useState<any>(null);
  const {
    editRegisterFormStatus,
    editRegisterId,
    setMainTabIndex,
    setEditRegisterId,
    setCheckFetch,
    checkFetch
  } = useAppStore();
  const shopId = editRegisterId; // TODO - need to remove this unncessery state.
  const { shop, loading, error } = useFetchShopByIdHook(editRegisterId || shopId);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [selectBranchType, setSelectbranchType] = useState<any>();
  const [selectedShopExclusivety, setSelectedShopExclusivety] = useState('');
  const [inputValues, setInputValues] = useState<InputValues>({
    postCode: '',
    prefectures: '',
    municipalities: '',
    Address: ''
  });
  const [zipCode, setZipCode] = useState('');
  const [billingPostalCode, setBilingPostalCode] = useState<any>('');
  const [businessHours, setBusinessHours] = useState({
    startHour: '08',
    startMinute: '00',
    endHour: '22',
    endMinute: '30'
  });
  const [form] = AntdForm.useForm();
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<any>({});
  const [copyData, setCopyData] = useState<any>({
    postCode: '',
    prefectures: '',
    municipalities: '',
    Address: '',
    billingDepartment: ''
  });
  const [pasteDataCheck, setPasteDataCheck] = useState(false);
  const [editPasteDataCheck, setEditPasteDataCheck] = useState(false);
  const hourOptions = generateHourOptions();
  const minuteOptions = generateMinuteOptions();
  const [initialValues, setInitialValues] = useState<any>();
  const [isChecked, setIsChecked] = useState(false);
  const [vacationStart, setVactionStart] = useState(shop ? shop?.shopVacations[0]?.start : null);
  const [vacationEnd, setVactionEnd] = useState(shop ? shop?.shopVacations[0]?.end : null);
  const { setTabKeyAction } = useTabStore();
  const { headBranches } = useGetAllBranchesHook();
  const [zipCodeResult, setZipCodeResult] = useState<any>();
  const [billlingZipCodeResult, setBillingZipCodeResult] = useState<any>();
  const [zipCodeError, setZipCodeEror] = useState(false);
  const { storeTypeDisable, headBranchId } = useBuyerStore();
  useScrollToTopOnNavigate(editRegisterId);
  const fetchZipCode = async (zipCode: string, type: zipCodeFNType) => {
    const response = await getZipCodes(zipCode);
    if (type == 'billing') {
      setZipCodeResult(response);
    } else if (type == 'nonBilling') {
      setBillingZipCodeResult(response);
    }
    if (response === null) {
      setCustomErrorToast(MESSAGES.ENTER_ZIP_CODE);
    }
  };

  const defaultValues = {
    companyName: '',
    name: '',
    shopTypeEnum: storeTypeDisable ? BRANCH_TYPES.SUB : null,
    headBranchId: storeTypeDisable ? headBranchId : null,
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

  useEffect(() => {
    const isValidZipCode = /^\d{3}-\d{4}$|^\d{7}$/.test(billingPostalCode);
    const isValidSecondZipCode = /^\d{3}-\d{4}$|^\d{7}$/.test(zipCode);

    if (isValidSecondZipCode && zipCode?.length > 6) {
      fetchZipCode(zipCode, 'billing');
    }

    if (isValidZipCode && billingPostalCode?.length > 6) {
      fetchZipCode(billingPostalCode, 'nonBilling');
      setZipCodeEror(false);
    } else {
      setZipCodeEror(true);
    }
  }, [zipCode, billingPostalCode]);

  useEffect(() => {
    if (pasteDataCheck && !editPasteDataCheck) {
      setInputValues({
        postCode: copyData.postCode,
        prefectures: copyData.prefectures,
        municipalities: copyData.municipalities,
        Address: copyData.Address
      });
    } else if (shopId && editPasteDataCheck) {
      setInputValues({
        postCode: zipCode,
        prefectures: copyData.prefectures,
        municipalities: copyData.municipalities,
        Address: shop ? copyData.Address : ''
      });
    }
  }, [pasteDataCheck, copyData, editPasteDataCheck, shopId]);

  const handleChange = (field: any) => (e: any) => {
    const value = e.target.value;
    setInputValues((prev: any) => ({ ...prev, [field]: value }));
    setCopyData((prev: any) => ({ ...prev, [field]: value }));
    if (field === 'postCode') {
      setEditPasteDataCheck(false);
      setBilingPostalCode(value);
    }
  };

  const handleCheckboxChange = (checked: any) => {
    setIsChecked(checked);
  };

  useEffect(() => {
    let mappedData: any = [{}];
    if (editRegisterId) {
      if (shop) {
        mappedData = shop?.billingDataInvoices?.map((invoice: any) => ({
          postCode: invoice.zipCode || '',
          prefectures: invoice.billingPrefecture || '',
          municipalities: invoice.billingMuncipalities || '',
          Address: invoice.billingAddress || '',
          billingDepartment: invoice.billingDepartment || '',
          pic: invoice.pic || ''
        }));

        if (mappedData?.length > 0) {
          setCopyData(mappedData[0]);
          setPasteDataCheck(true);
          setBilingPostalCode(mappedData[0].postCode);
        }
        setBillingZipCodeResult({
          ...billlingZipCodeResult,
          pref: mappedData[0].prefectures,
          town: mappedData[0].municipalities
        });
        setVactionStart(shop?.shopVacations[0]?.start);
        setVactionEnd(shop?.shopVacations[0]?.end);
        setResult(shop?.shopHolidays);
        setSelectedShopExclusivety(shop?.shopExclusivity);
        setZipCode(shop?.postalCode);
        handleCheckboxChange(shop?.holidayMatching);
        setSelectbranchType(shop?.shopTypeEnum);
        setInitialValues({
          companyName: shop ? shop?.companyName : '',
          name: shop ? shop?.name : '',
          shopTypeEnum: editRegisterId
            ? shop && shop?.shopTypeEnum
            : storeTypeDisable
              ? BRANCH_TYPES.SUB
              : '',
          headBranchId: shop ? shop?.headBranchId : null,
          storeSubscriptionType: shop ? shop?.storeSubscriptionType : null,
          email: shop ? shop?.username : '',
          phone: shop ? shop?.phoneNumber : '',
          postalCode: shop?.postalCode,
          prefectures: zipCodeResult?.pref,
          manicipalities: zipCodeResult?.town,
          address: shop ? shop?.address : '',
          shopExclusivity: shop ? shop?.shopExclusivity : '',
          exIntroductionFee: Number(shop ? shop?.refferal : null),
          nonExReferralFee: Number(shop ? shop?.introduction : null),
          paymentType: shop ? shop?.paymentMethod : '',
          pic: mappedData[0]?.pic,
          billingEmails: shop?.billingDataInvoices?.[0]?.billingEmails?.[0]?.email ?? '',
          startDate: dayjs('2024-03-01'),
          billingDepartment: mappedData[0].billingDepartment,
          appealStatement: shop ? shop?.appealStatement : '',
          businessHours: shop ? shop?.businessHours : '',
          shopVacations: [
            {
              start: shop ? shop?.shopVacations[0]?.start : '',
              end: shop ? shop?.shopVacations[0]?.end : ''
            }
          ],
          holidayMatching: shop ? shop?.holidayMatching : false,
          shopHolidays: shop ? shop?.result : null,
          cancellationCategory: shop ? shop?.cancellationCategory : 'NONE',
          billingDataInvoices: [
            {
              zipCode: billingPostalCode,
              billingPrefecture: shop ? mappedData[0]?.billingPrefecture : '',
              billingMunicipalities: shop ? mappedData[0]?.billingMunicipalities : '',
              billingAddress: shop ? shop?.billingAddress : copyData.billingAddress,
              billingDepartment: shop ? mappedData[0].billingDepartment : '',
              pic: shop ? shop?.companyName : ''
            }
          ],
          shopImageUrl: shop ? shop?.shopImageUrl : ''
        });
      }
    } else {
      setInitialValues(defaultValues);
      setVactionStart(null);
      setVactionEnd(null);
      setZipCodeResult({});
      setBillingZipCodeResult({});
      setInputValues({
        postCode: '',
        prefectures: '',
        municipalities: '',
        Address: ''
      });
      setCopyData({
        postCode: '',
        prefectures: '',
        municipalities: '',
        Address: '',
        billingDepartment: ''
      });
      setResult([
        {
          id: null,
          week: '',
          day: ''
        }
      ]);
    }
  }, [shop, shopId, editRegisterId]);

  const pasteData = () => {
    setPasteDataCheck(true);
    if (editRegisterFormStatus || shopId) {
      setEditPasteDataCheck(true);
    }
    setBilingPostalCode(zipCode);
  };

  useEffect(() => {
    if (shop?.businessHours) {
      const businessHoursParts = shop?.businessHours.split('~');

      if (businessHoursParts.length === 2) {
        const [startTime, endTime] = businessHoursParts;

        const startParts = startTime?.split(':');
        const endParts = endTime?.split(':');

        if (startParts?.length === 2 && endParts?.length === 2) {
          const [startHour, startMinute] = startParts;
          const [endHour, endMinute] = endParts;

          setBusinessHours({
            startHour,
            startMinute,
            endHour,
            endMinute
          });
        } else {
          console.error('Invalid time format:', startTime, endTime);
        }
      } else {
        console.error('Invalid businessHours format:', shop?.businessHours);
      }
    } else {
      console.error('shop or shop?.businessHours is undefined');
    }
  }, [shop]);

  const headBranchoptions = headBranches?.map((branch: any) => ({
    label: branch.name,
    value: branch.ShopId
  }));

  useEffect(() => {
    if (location.pathname.includes('/register')) {
      setFirstRegister(true);
    }
  }, [location.pathname, setFirstRegister]);

  const onFinish = async (value: any) => {
    let isvalid;
    if (!(shop?.username == value?.email) || !shopId || shop?.username == value?.email) {
      try {
        if (!(shop?.username == value?.email) || !shopId) {
          try {
            await CheckEmailValidation(value.email);
          } catch (error: any) {
            if (error.status == 409) {
              setCustomErrorToast(MESSAGES.DUPLICATE_EMAIL);
            } else {
              setCustomErrorToast(MESSAGES.HAVE_PROBLEM);
            }
          }
        }
        isvalid = true;
      } catch (error: any) {
        isvalid = false;
        if (error.status == 401) {
          setCustomErrorToast(MESSAGES.SESSION_EXPIRES);
        } else if (shop?.username == value.email || !shopId || !(shop?.username == value?.email)) {
          setCustomErrorToast(MESSAGES.DUPLICATE_EMAIL);
        } else if (error.status == 409) {
          setCustomErrorToast(MESSAGES.DUPLICATE_EMAIL);
        } else {
          setCustomErrorToast(MESSAGES.HAVE_PROBLEM);
        }
      }
    }

    if (isvalid || editRegisterFormStatus || shopId) {
      let filename;
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.-]/g, '');

      try {
        setPageLoading(true);
        if (fileInfo) {
          filename = `${timestamp}.${fileInfo.type.split('/').pop().toLowerCase()}`;
          const fileData = {
            bucketName: 'ctn-uploads',
            keyName: filename
          };

          const response = await uploadImage(fileData);
          await axios.put(response.url, file, {
            headers: {
              'Content-Disposition': `attachment; filename=${filename}`
            }
          });
          filename = `${timestamp}.${fileInfo?.type.split('/').pop().toLowerCase()}`;
        }
        const newData = {
          companyName: value.companyName,
          name: value.name,
          shopTypeEnum: value.shopTypeEnum,
          headBranchId: selectBranchType === BRANCH_TYPES.HEAD ? null : value.headBranchId,
          storeSubscriptionType: value.storeSubscriptionType,
          ...(!shopId ? { email: value.email } : { username: value.email }),
          // email: value.email,
          phoneNumber: value.phone,
          postalCode: value.postalCode,
          prefectures: zipCodeResult?.pref,
          manicipalities: zipCodeResult?.town,
          appealStatement: value.appealStatement,
          businessHours: `${businessHours.startHour}:${businessHours.startMinute}~${businessHours.endHour}:${businessHours.endMinute}`,
          address: value.address,
          shopExclusivity: value.shopExclusivity,
          introduction: Number(value.nonExReferralFee),
          refferal: Number(value.exIntroductionFee),
          paymentMethod: value.paymentType,
          // cancellationCategory: value.cancellationCategory,
          shopVacations:
            vacationStart === null && vacationEnd === null
              ? []
              : [
                  {
                    id: null,
                    start: `${vacationStart}.000`,
                    end: `${vacationEnd}.000`
                  }
                ],
          holidayMatching: isChecked,
          shopHolidays: results
            ?.filter((item: any) => item.day) // Exclude items where 'day' is empty, null, or undefined
            .map((item: any) => ({
              ...item,
              id: null, // You can customize this value
              week: item.week // Retain the week property
            })),
          billingDataInvoices: [
            {
              zipCode: billingPostalCode,
              billingPrefecture: billlingZipCodeResult?.pref,
              billingMuncipalities: billlingZipCodeResult?.town,
              billingAddress: copyData.Address,
              billingDepartment: value.billingDepartment,
              pic: value.pic,
              billingEmails: [
                {
                  email: value?.billingEmails ?? {}
                }
              ]
            }
          ],
          shopImageUrl: clearImage
            ? ''
            : fileInfo
              ? `${BUCKET_URL}/${filename}`
              : shop
                ? shop?.shopImageUrl
                : null
        };
        if (editRegisterFormStatus || shopId) {
          await updateShopBuyer(0, {
            ...newData,
            id: editRegisterId || shopId
          });
          setPageLoading(true);
          setSuccessToast(MESSAGES.SUCCESS_BUYER_UPDATE);
          setPageLoading(false);
          setMainTabIndex(true);
          setEditRegisterId(null);
          setTabKeyAction('5');
          setCheckFetch(!checkFetch);
        } else {
          setPageLoading(true);
          await RegisterBuyer(newData);
          setSuccessToast(MESSAGES.SUCCESS_BUYER_REGISTRATION);
          setEditRegisterId(null);
          setPageLoading(false);
          setMainTabIndex(true);
          setCheckFetch(!checkFetch);
          console.log("firstRegister", firstRegister);
          if (firstRegister) {
            navigate('/login', { replace: true });
            return;
          } else {
            setTabKeyAction('5');
          }
          console.log("firstRegister", firstRegister);

        }
      } catch (error: any) {
        setPageLoading(false);
        if (error.status == 401) {
          setCustomErrorToast(MESSAGES.SESSION_EXPIRES);
        } else {
          setCustomErrorToast(MESSAGES.HAVE_PROBLEM);
        }
        setMainTabIndex(false);
      }
    }
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const showPreview = () => {
    const currentFormValues = form.getFieldsValue();
    setFormValues({
      ...currentFormValues,
      businessHours: `${businessHours.startHour}:${businessHours.startMinute}~${businessHours.endHour}:${businessHours.endMinute}`,
      shopVacations: [{ start: vacationStart, end: vacationEnd }],
      shopHolidays: results,
      billingDataInvoices: [
        {
          zipCode: billingPostalCode,
          billingPrefecture: billlingZipCodeResult?.pref,
          billingMunicipalities: billlingZipCodeResult?.town,
          billingAddress: copyData.Address,
          billingDepartment: currentFormValues.billingDepartment,
          pic: currentFormValues.pic,
          billingEmails: [{ email: currentFormValues.billingEmails }]
        }
      ],
      prefectures: zipCodeResult?.pref,
      manicipalities: zipCodeResult?.town,
      shopImageUrl: fileInfo ? URL.createObjectURL(file) : shop?.shopImageUrl || null
    });
    setPreviewVisible(true);
  };

  const closePreview = () => {
    setPreviewVisible(false);
  };

  if (loading || pageLoading) return <TableLoadingSkeleton />;

  return (
    <div className="  w-full h-full p-2  overflow-x-hidden">
      {firstRegister && (
        <div className=" w-full flex items-center mb-2">
          <Button className=" bg-[#e95412] hover:!bg-[#e95412] " onClick={() => navigate('/login')}>
            <IoMdArrowRoundBack className=" text-white" size="20" />
          </Button>
        </div>
      )}

      <h1 className=" text-white text-center py-1 mb-1 bg-[#e95412]">買取店登録</h1>
      <Form
        onFinish={onFinish}
        className=" flex flex-col gap-0 w-full h-full overflow-y-auto"
        initialValues={initialValues}
        form={form}>
        <Row gutter={[0, 0]} className=" w-full h-full ">
          <Col span={24} sm={24} md={16} className=" w-full h-full md:pr-4">
            <FormItem
              fullWidth
              layout="horizontal"
              className="  text-white w-full "
              name="companyName">
              <Input
                name="companyName"
                label="会社名"
                className="w-full bg-[#fff9c5] py-2"
                defaultValue={shop?.companyName}
                required
              />
            </FormItem>
            <FormItem fullWidth layout="horizontal" className="  text-white w-full " name="name">
              <Input required label="店名" className="w-full bg-[#fff9c5] py-2" />
            </FormItem>
            <Row className=" w-full m-0 p-0" gutter={{ xs: 0, sm: 10 }}>
              <Col span={24} sm={24} md={12} className="">
                <FormItem
                  fullWidth
                  layout="horizontal"
                  className=" custom-form-item text-white w-full disabled:!text-black"
                  name="shopTypeEnum"
                  rules={[
                    {
                      required: true,
                      message: MESSAGES.REQUIRED_FIELD
                    }
                  ]}>
                  <Select
                    options={branchTypes}
                    disable={storeTypeDisable}
                    fullWidth
                    label="組織区分"
                    className="h-10 w-full bg-[#fff9c5] disabled:!text-black"
                    onChange={(input, option) => {
                      setSelectbranchType(input);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={24} sm={24} md={12}>
                <FormItem
                  fullWidth
                  layout="horizontal"
                  className="  text-white w-full "
                  name="postalCode"
                  rules={[
                    {
                      pattern: /^\d{3}-\d{4}$|^\d{7}$/,
                      message: MESSAGES.INVALID_ZIPCODE
                    }
                  ]}>
                  <Input
                    label="郵便番号"
                    className="w-full  bg-[#fff9c5] py-2"
                    onChange={(e) => {
                      const value = e.target.value;
                      setCopyData({ ...copyData, postCode: value });
                      setPasteDataCheck(false);
                      setEditPasteDataCheck(false);
                      setZipCode(value);
                    }}
                    required
                  />
                </FormItem>
              </Col>
              <Col span={24} sm={24} md={12}>
                <FormItem
                  fullWidth
                  layout="horizontal"
                  className="custom-form-item  text-white w-full "
                  name="headBranchId"
                  rules={[
                    {
                      required: selectBranchType === BRANCH_TYPES.SUB,
                      message: MESSAGES.REQUIRED_FIELD
                    }
                  ]}>
                  <Select
                    options={headBranchoptions}
                    fullWidth
                    label="本店選択"
                    className="h-10 w-full bg-[#fff9c5]"
                    disable={selectBranchType === BRANCH_TYPES.HEAD || storeTypeDisable}
                  />
                </FormItem>
              </Col>
              <Col span={24} sm={24} md={12}>
                <FormItem fullWidth layout="horizontal" className="  text-white w-full ">
                  <Input
                    label="都道府県"
                    className="w-full bg-[#fff9c5] py-2"
                    value={zipCodeResult?.pref}
                    onChange={(e) => {
                      setCopyData({ ...copyData, prefectures: e.target.value });
                      setPasteDataCheck(false);
                    }}
                    required
                  />
                </FormItem>
              </Col>
              <Col span={24} sm={24} md={12}>
                <FormItem
                  fullWidth
                  layout="horizontal"
                  className=" custom-form-item text-white w-full "
                  name="storeSubscriptionType"
                  rules={[
                    {
                      required: true,
                      message: MESSAGES.REQUIRED_FIELD
                    }
                  ]}>
                  <Select
                    options={shopTypes}
                    fullWidth
                    label="店舗種別"
                    className="h-10 w-full bg-[#fff9c5]"
                  />
                </FormItem>
              </Col>
              <Col span={24} sm={24} md={12}>
                <FormItem fullWidth layout="horizontal" className="  text-white w-full ">
                  <Input
                    label="市区町村"
                    className="w-full bg-[#fff9c5] py-2"
                    value={zipCodeResult?.town}
                    onChange={(e) => {
                      setCopyData({
                        ...copyData,
                        municipalities: e.target.value
                      });
                      setPasteDataCheck(false);
                    }}
                    required
                  />
                </FormItem>
              </Col>

              <Col span={24} sm={24} md={12}>
                <FormItem
                  fullWidth
                  layout="horizontal"
                  className=" custom-form-item-2 text-white "
                  name="email"
                  rules={[
                    {
                      type: 'email',
                      message: MESSAGES.INVALID_EMAIL
                    }
                  ]}>
                  <Input label="メール" className=" w-full bg-[#fff9c5] py-2" required />
                </FormItem>
              </Col>
              <Col span={24} sm={24} md={12}>
                <FormItem
                  fullWidth
                  layout="horizontal"
                  className="  text-white w-full "
                  name="address">
                  <Input
                    label="番地等"
                    className="w-full bg-[#fff9c5] py-2"
                    onChange={(e) => {
                      setCopyData({ ...copyData, Address: e.target.value });
                      setPasteDataCheck(false);
                      setEditPasteDataCheck(false);
                    }}
                    required
                  />
                </FormItem>
              </Col>
            </Row>

            <FormItem
              fullWidth
              layout="horizontal"
              className="  text-white w-full "
              name="phone"
              rules={[
                {
                  pattern: /^(\+?[1-9]\d{1,14}|0\d{1,4}-\d{1,4}-\d{4}|0120-\d{3}-\d{3}|0800-\d{3}-\d{4})$/,
                  message: MESSAGES.CONTACT_VALIDATION
                }
              ]}>
              <Input label="電話" className=" w-full md:w-1/4 bg-[#fff9c5] py-2" required />
            </FormItem>
            <FormItem
              fullWidth
              layout="horizontal"
              className="  text-white w-full "
              name="appealStatement">
              <Input label="アピール文" className="w-full truncate bg-[#fff9c5] py-2" />
            </FormItem>
            <div className="flex items-center flex-col md:flex-row ">
              <label className=" text-sm  text-white py-4 font-bold w-full text-center md:text-left md:w-[7rem] px-2 mr-2 !bg-[#587c94] h-full border-b-[1px] border-white">
                営業時間
              </label>
              <FormItem
                fullWidth
                layout="horizontal"
                className="text-white flex-1 flex items-center bg-white w-full "
                name="businessHours">
                <div className="flex items-center ml-4 md:ml-0 py-2 md:py-0 ">
                  <Select
                    options={hourOptions}
                    value={businessHours.startHour}
                    onChange={(value) =>
                      setBusinessHours((prev) => ({
                        ...prev,
                        startHour: value
                      }))
                    }
                    className="w-20 mr-1 bg-[#fff9c5]"
                  />
                  <span className="mx-1 text-lg  text-black">:</span>
                  <Select
                    options={minuteOptions}
                    value={businessHours.startMinute}
                    onChange={(value) =>
                      setBusinessHours((prev) => ({
                        ...prev,
                        startMinute: value
                      }))
                    }
                    className="w-20 ml-1 bg-[#fff9c5]"
                  />

                  <span className="mx-1 text-lg  text-black">~</span>

                  <Select
                    options={hourOptions}
                    value={businessHours.endHour}
                    onChange={(value) => setBusinessHours((prev) => ({ ...prev, endHour: value }))}
                    className="w-20 mr-1 bg-[#fff9c5]"
                  />
                  <span className="mx-1 text-lg  text-black">:</span>

                  <Select
                    options={minuteOptions}
                    value={businessHours.endMinute}
                    onChange={(value) =>
                      setBusinessHours((prev) => ({
                        ...prev,
                        endMinute: value
                      }))
                    }
                    className="w-20 ml-1 bg-[#fff9c5]"
                  />
                </div>
              </FormItem>
            </div>

            <FormItem
              fullWidth
              layout="horizontal"
              className="  text-white w-full pb-2 md:pb-0 "
              name="shopImageUrl">
              <Uploader
                label="店舗画像"
                setFileInfo={setFileInfo}
                file={file}
                setFile={setFile}
                edit={editRegisterFormStatus ? editRegisterFormStatus : false}
                url={shop?.shopImageUrl ? shop?.shopImageUrl : undefined}
              />
            </FormItem>

            {/* <div className=" w-full flex items-start gap-2 ">
              <label
                className="!bg-[#587c94] text-sm border-b-[1px] border-white text-white py-6 font-bold w-[7rem] px-2"
                htmlFor="">
                独占／非独占
              </label>
              <FormItem
                fullWidth
                layout="horizontal"
                name="shopExclusivity"
                className=" custom-form-item  text-white w-full  flex !items-center "
                rules={[
                  {
                    required: true,
                    message: MESSAGES.REQUIRED_FIELD
                  }
                ]}>
                <Radio
                  optionType="default"
                  options={exclusiveOptions}
                  className="w-full  mt-4"
                  onChange={(e) => setSelectedShopExclusivety(e.target.value)}
                />
              </FormItem>
            </div> */}
            {/* <FormItem
              fullWidth
              layout="horizontal"
              className="  text-white w-full "
              name="exIntroductionFee">
              <Input
                required
                label="紹介料(独占)"
                className="w-1/4 bg-[#fff9c5] py-2"
                disabled={selectedShopExclusivety == ''}
              />
            </FormItem> */}
            {/* <FormItem
              fullWidth
              layout="horizontal"
              className="  text-white w-full "
              name="nonExReferralFee">
              <Input
                label="紹介料(非独占)"
                className="w-1/4 bg-[#fff9c5] py-2"
                disabled={selectedShopExclusivety == 'EX' || selectedShopExclusivety == ''}
                required
              />
            </FormItem> */}
            {/* <div className=" w-full flex items-start gap-2 ">
              <label
                className="!bg-[#587c94] text-sm border-b-[1px] border-white text-white py-6 font-bold w-[7rem] px-2"
                htmlFor="">
                支払方法
              </label>
              <FormItem
                fullWidth
                layout="horizontal"
                className="   text-white w-full "
                name="paymentType"
                rules={[
                  {
                    required: true,
                    message: MESSAGES.REQUIRED_FIELD
                  }
                ]}>
                <Radio optionType="default" options={paymentMethods} className="w-full  py-2" />
              </FormItem>
            </div> */}
            <div className=" flex items-center flex-col md:flex-row ">
              <label
                htmlFor=""
                className="text-sm block font-semibold py-6 px-2  !bg-[#587c94] border-b-[1px] border-white text-white w-full text-center md:text-left md:w-[7rem]">
                休暇期間
              </label>
              <div className=" w-full md:w-2/4 md:px-2  flex items-center justify-between gap-2 py-2">
                <FormItem
                  fullWidth
                  layout="horizontal"
                  className="  text-white w-full "
                  name="startDate">
                  <DateTimePicker
                    time={vacationStart}
                    setTime={setVactionStart}
                    initialValue={shop ? shop?.shopVacations[0]?.start : null}
                  />
                </FormItem>
                <div>~</div>
                <FormItem
                  fullWidth
                  layout="horizontal"
                  className="  text-white w-full"
                  name="endDate">
                  <DateTimePicker
                    time={vacationEnd}
                    minDate={vacationStart}
                    setTime={setVactionEnd}
                    initialValue={shop ? shop?.shopVacations[0]?.end : null}
                  />
                </FormItem>
              </div>
            </div>
            <div className=" w-full flex flex-col md:flex-row items-center gap-4 !h-full   !bg-[#587c94]  ">
              <label
                className=" text-sm min-w-fit md:pr-[2.9rem] text-white  font-bold pt-4 md:pt-0  px-2  "
                htmlFor="">
                定休日
              </label>
              <div className=" w-full flex flex-col items-start group gap-2 h-full bg-white px-2">
                <FormItem
                  fullWidth
                  layout="horizontal"
                  className="  text-white w-full "
                  name="holidayMatching">
                  <Checkbox
                    type="single"
                    value={isChecked || (shop && shop?.holidayMatching)}
                    onChange={handleCheckboxChange}
                    label="定休日にマッチングしない"
                    typeCheck={false}
                  />
                </FormItem>
                <div className=" w-full">
                  <FormItem fullWidth layout="horizontal" className="  text-white w-full ">
                    <InputCard id={editRegisterId ? editRegisterId : null} />
                  </FormItem>
                </div>
              </div>
            </div>
          </Col>
          <Col span={24} sm={24} md={8} className="w-full ">
            <div className=" w-full flex items-start gap-2  ">
              <label
                className="!bg-[#587c94] text-sm border-b-[1px] border-white  text-white  py-4 font-bold w-[7rem] px-2"
                htmlFor="">
                請求先情報
              </label>
              <div className=" flex items-center justify-center  flex-1 h-full mt-1 md:mt-2   ">
                <Button className=" w-full h-full py-2" onClick={pasteData}>
                  買取店住所 をコピー{' '}
                </Button>
              </div>
            </div>
            <FormItem fullWidth layout="horizontal" className="text-white w-full">
              <Input
                value={inputValues.postCode}
                label="郵便番号"
                className="w-full bg-[#fff9c5] py-2"
                onChange={handleChange('postCode')}
              />
              {zipCodeError && billingPostalCode?.length > 1 && (
                <h1 className=" text-red-600 py-1">{MESSAGES.INVALID_ZIPCODE}</h1>
              )}
            </FormItem>
            <FormItem fullWidth layout="horizontal" className="text-white w-full">
              <Input
                value={billlingZipCodeResult?.pref}
                label="都道府県"
                className="w-full bg-[#fff9c5] py-2"
                onChange={handleChange('prefectures')}
              />
            </FormItem>
            <FormItem fullWidth layout="horizontal" className="text-white w-full">
              <Input
                value={billlingZipCodeResult?.town}
                label="市区町村"
                className="w-full bg-[#fff9c5] py-2"
                onChange={handleChange('municipalities')}
              />
            </FormItem>
            <FormItem fullWidth layout="horizontal" className="text-white w-full">
              <Input
                value={inputValues.Address}
                label="番地等"
                className="w-full bg-[#fff9c5] py-2"
                onChange={handleChange('Address')}
              />
            </FormItem>
            <FormItem
              fullWidth
              layout="horizontal"
              className="  text-white w-full "
              name="billingDepartment">
              <Input label="部署" className="w-full bg-[#fff9c5] py-2" />
            </FormItem>
            <FormItem fullWidth layout="horizontal" className="  text-white w-full " name="pic">
              <Input label="担当者様" className="w-full bg-[#fff9c5] py-2" />
            </FormItem>
            <FormItem
              fullWidth
              layout="horizontal"
              className=" custom-form-item-2 text-white w-full "
              name="billingEmails"
              rules={[
                {
                  type: 'email',
                  message: MESSAGES.INVALID_EMAIL
                }
              ]}>
              <Input label="メール" className="w-full bg-[#fff9c5] py-2" />
            </FormItem>
          </Col>
        </Row>
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            htmlType="submit"
            className=" bg-orange-500 text-white mt-4  py-6  rounded-md w-full max-w-[200px]">
            {shopId ? '更新' : '登録する'}
          </Button>
          <Button
            onClick={showPreview}
            className="bg-orange-500 text-white mt-4  py-6  rounded-md w-full max-w-[200px]">
            プレビューする
          </Button>
        </div>
      </Form>
      <PreviewScreen visible={previewVisible} onClose={closePreview} formData={formValues} />
    </div>
  );
};
