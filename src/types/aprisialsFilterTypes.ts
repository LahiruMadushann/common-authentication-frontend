interface AppraisalType {
  appraisalid: {
    content: number;
  };
  status: string;
  type: string;
  customer: {
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
  };
  car: {
    car_type: string;
    car_maker: string;
    car_model_year: string;
    car_traveled_distance: string;
    body_type: string | null;
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
  };
  aDates: {
    content: Array<{
      content: string;
    }>;
  };
  supplement: {
    note: string;
    message_for_matching_shop: string;
    ip: string;
    param: string;
    requestYMD: string;
  };
  shops: {
    shops: Array<{
      shopid: {
        content: number;
        assessedEx: string | null;
      };
      assessedEx: string | null;
      name: string;
      assessed_datetime: string;
      is_rejected_by_shop: boolean;
    }>;
  };
  assessed: {
    appraisalId: number;
    shopId: number;
    assessedDateTime: string | null;
    emailSendTime: string | null;
    draftEmailSendTime: string | null;
    reject: boolean;
    ex: string | null;
    updatedAt: string | null;
  };
  saved_utm_param: string;
  isTestData: boolean;
  test_email_sent: boolean;
  ip: string;
  fpc: string;
}

interface AppraisalListResponse {
  operatorAppraisalList: AppraisalType[];
  allCount: number;
}

export type { AppraisalType, AppraisalListResponse };
