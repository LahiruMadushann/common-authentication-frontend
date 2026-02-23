import StatusType from '../data/choises.json';

export const statusTypeFilter = (typeParam : any) => {
  let word = '';
  const type = StatusType.status.filter((item) => item.value === typeParam);

  if (type.length) {
    word = type[0].label;
  }

  return word;
};
