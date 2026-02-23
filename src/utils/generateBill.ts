type BillItemRowsType = {
  description: string;
  volume: number;
  total: string;
  unitPrice: number;
};

const generateBill = (
  assessmentEx: number,
  assessmentNonEx: number,
  assessmentIncreasePrefectureNonEx: number,
  rejectionLastMonthEx: number,
  rejectionLastMonthNonEx: number,
  rejectionLastMonthIncreasePrefectureNonEx: number,
  referral: number,
  introduction: number,
  increasePrefectureIntroduction: number,
  nonExAmount: number,
  nonExIncreasePrefectureAmount: number,
  rejectionNonExAmount: number,
  rejectionIncreasePrefectureNonExAmount: number,
  exAmount: number,
  rejectionExAmount: number,
  japaneesMonth?: string,
) :BillItemRowsType[]=> {
  let billItems: BillItemRowsType[] = [];

  if (assessmentNonEx) {
    const nonexclusiveItem = {
      description: 'CTN車一括査定',
      volume: assessmentNonEx,
      unitPrice: introduction,
      total: nonExAmount >= 0 ? `¥${nonExAmount}` : `-¥${Math.abs(nonExAmount)}`
    };

    billItems = [...billItems, nonexclusiveItem];
  }

  if (assessmentEx && referral) {
    const exclusiveItem = {
      description: 'CTN車一括査定（独占）',
      volume: assessmentEx,
      unitPrice: referral,
      total: exAmount >= 0 ? `¥${exAmount}` : `-¥${Math.abs(exAmount)}`
    };

    billItems = [...billItems, exclusiveItem];
  }

  if (assessmentIncreasePrefectureNonEx) {
    const nonexclusiveIncreasePrefectureItem = {
      description: 'CTN車一括査定（4社配信）',
      volume: assessmentIncreasePrefectureNonEx,
      unitPrice: increasePrefectureIntroduction,
      total: nonExIncreasePrefectureAmount >= 0 ? `¥${nonExIncreasePrefectureAmount}` : `-¥${Math.abs(nonExIncreasePrefectureAmount)}`
    };

    billItems = [...billItems, nonexclusiveIncreasePrefectureItem];
  }

  if (rejectionLastMonthEx) {
    const rejectionExclusiveItem = {
      description: `${japaneesMonth}却下分（独占)`,
      volume: rejectionLastMonthEx,
      unitPrice: referral,
      total: rejectionExAmount >= 0 ? `¥${rejectionExAmount}` : `-¥${Math.abs(rejectionExAmount)}`
    };

    billItems = [...billItems, rejectionExclusiveItem];
  }

  if (rejectionLastMonthNonEx) {
    const nonexclusiveRejectionItem = {
      description: `${japaneesMonth}却下分`,
      volume: rejectionLastMonthNonEx,
      unitPrice: introduction,
      total: rejectionNonExAmount >= 0 ? `¥${rejectionNonExAmount}` : `-¥${Math.abs(rejectionNonExAmount)}`

    };

    billItems = [...billItems, nonexclusiveRejectionItem];
  }

  if (rejectionLastMonthIncreasePrefectureNonEx) {
    const nonexclusiveIncreasePrefectureRejectionItem = {
      description: `${japaneesMonth}却下分`,
      volume: rejectionLastMonthIncreasePrefectureNonEx,
      unitPrice: increasePrefectureIntroduction,
      total: rejectionIncreasePrefectureNonExAmount >= 0 ? `¥${rejectionIncreasePrefectureNonExAmount}` : `-¥${Math.abs(rejectionIncreasePrefectureNonExAmount)}`

    };

    billItems = [...billItems, nonexclusiveIncreasePrefectureRejectionItem];
  }

  return billItems;
};

export { generateBill };
