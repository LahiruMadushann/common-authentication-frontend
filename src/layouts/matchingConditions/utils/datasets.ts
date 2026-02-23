import { bodyTypes } from '@/src/data/body_type_master';

export const InvolvedAccidenCheckList = [
  {
    label: '対応可能',
    value: 'ANY'
  },
  {
    label: '対応不可',
    value: 'NG'
  },
  {
    label: '不動車・事故現状車のみ',
    value: 'OK'
  }
];

export const numberOptions = [
  {
    label: '1',
    value: 1
  },
  {
    label: '2',
    value: 2
  },
  {
    label: '3',
    value: 3
  }
];

export const nonSpecializedVehicleProjectList = [
  {
    label: 'あり',
    value: 'OK'
  },
  {
    label: 'なし',
    value: 'NG'
  }
];

export const dateOfSalesList = [
  {
    label: 'OK',
    value: 'OK'
  },
  {
    label: 'NG',
    value: 'NG'
  }
];

export const bodyListTypes = bodyTypes?.map((body, index) => ({
  key: index + 1,
  label: body.body_type,
  value: body.body_type
}));
