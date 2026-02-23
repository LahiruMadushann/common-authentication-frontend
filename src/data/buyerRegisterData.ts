import {
  BILLING_CONSTANT,
  BRANCH_TYPES,
  CANCELATION_CATEGORY_CONSTANT,
  EXCLUSIVE_CONSTANT,
  SHOPTYPE_CONSTANT
} from '../constants/common.constant';

export const exclusiveOptions = [
  {
    label: '独占',
    value: EXCLUSIVE_CONSTANT.EX
  },
  {
    label: '非独占',
    value: EXCLUSIVE_CONSTANT.NON_EX
  }
  // {
  //   label: "独占／非独占",
  //   value: "BOTH",
  // },
];

export const paymentMethods = [
  {
    label: '銀行振込',
    value: BILLING_CONSTANT.BILLING
  },
  {
    label: '口座振替',
    value: BILLING_CONSTANT.DEBIT
  }
];

export const branchTypes = [
  {
    label: '支店',
    value: BRANCH_TYPES.SUB
  },
  {
    label: '本店',
    value: BRANCH_TYPES.HEAD
  }
];

export const shopTypes = [
  {
    label: '一般店',
    value: SHOPTYPE_CONSTANT.GENERAL
  },
  {
    label: '専門店',
    value: SHOPTYPE_CONSTANT.SPECIAL
  }
];

export const cancellationCategory = [
  {
    label: 'なし',
    value: CANCELATION_CATEGORY_CONSTANT.NONE
  },
  {
    label: '解約済み',
    value: CANCELATION_CATEGORY_CONSTANT.CANCELLED
  },
  {
    label: '停止中',
    value: CANCELATION_CATEGORY_CONSTANT.SUSPENDED
  }
];
