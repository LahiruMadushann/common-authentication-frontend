import { ShopDataType } from './shop.type';

interface InvoiceType extends ShopDataType {
  deadLine: any;
  lastDate: any;
  paymentDeadline: any;
  branches: ShopDataType;
  shopId:any;
}

interface UserShopInvoiceRequestType {
  year: string;
  month: string;
  shopId: string;
}

interface AppraisalId {
  content: number;
}

interface Customer {
  phone: {
    content: string;
  };
  name: string;
  email: {
    content: string;
  };
  post_number: string;
  prefecture: string;
  municipalities: string;
  address: string | null;
  address_detail: string | null;
  pin: string | null;
}

interface Car {
  car_type: string;
  car_maker: string;
  car_model_year: string;
  car_traveled_distance: string;
  body_type: string;
  inspect_remain: string;
  car_state: string;
  runnable: string;
  wheel_drive: string | null;
  fuel: string | null;
  shift: string | null;
  accident: string;
  displacement: string | null;
  body_color: string;
  loan: string;
  desire_date: string;
  grade: string;
  exterior: string | null;
  scratch: string | null;
  dent: string | null;
  peel: string | null;
  rust: string | null;
  interior: string | null;
  dirt: string | null;
  tear: string | null;
  air_conditioning: string | null;
  smoke: string | null;
  navigation: string | null;
  auto_slide: string | null;
  leather_sheet: string | null;
  handle_type: string | null;
  back_monitor: string | null;
  sunroof: string | null;
  wheel: string | null;
}

interface ADate {
  content: string;
}

interface ADates {
  content: ADate[];
}

interface Supplement {
  note: string;
  message_for_matching_shop: string;
  ip: string;
  param: string;
  requestYMD: string;
}

interface ShopId {
  content: number;
  assessedEx: string | null;
}

interface Shop {
  shopid: ShopId;
  name: string;
  is_rejected_by_shop: boolean;
}

interface Shops {
  shops: Shop[];
}

interface Assessed {
  appraisalId: number;
  shopId: number;
  assessedDateTime: string;
  emailSendTime: string | null;
  draftEmailSendTime: string;
  reject: boolean;
  ex: string;
}

interface AppraisalType {
  appraisalid: AppraisalId;
  status: string;
  type: string;
  customer: Customer;
  car: Car;
  aDates: ADates;
  supplement: Supplement;
  shops: Shops;
  assessed: Assessed;
  saved_utm_param: string;
  isTestData: boolean | null;
  test_email_sent: boolean;
  ip: string;
}

interface BillingDataInvoiceDto {
  id: number;
  zipCode: string;
  billingPrefecture: string;
  billingMuncipalities: string;
  billingAddress: string;
  billingDepartment: string;
  pic: string;
  paymentType: string;
  introductionFee: number;
  referralFee: number;
  shopInvoice: number;
  companyName: string;
}

interface InvoiceForPDFType {
  billingDataInvoiceDto: BillingDataInvoiceDto;
  deadline: string;
  creationDate: string;
  shopId: string;
  TotalPlusTax: number;
  netTotal: number;
  tenPercentTax: number;
  eightPercentTax: number;
  taxExempt: number;
  assessmentNonEx: number;
  assessmentIncreasePrefectureNonEx: number;
  nonExAmount: number;
  nonExIncreasePrefectureAmount: number;
  assessmentEx: number;
  exAmount: number;
  rejectionLastMonthEx: number;
  rejectionExAmount: number;
  rejectionLastMonthNonEx: number;
  rejectionIncreasePrefectureNonExAmount: number;
  rejectionNonExAmount: number;
  rejectionLastMonthIncreasePrefectureNonEx: number;
  referral: number;
  introduction: number;
  increasePrefectureIntroduction: number;
  japaneesMonth: string;
}


export type { InvoiceType, UserShopInvoiceRequestType, AppraisalType, InvoiceForPDFType };
