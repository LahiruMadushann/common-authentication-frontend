import areaData from '../../../data/area.json';

export const getMunicipalities = (selectedPrefecture: any) => {
  // Find the prefecture in the area data
  const area = areaData.find((area: any) => area.prefecture === selectedPrefecture);

  // If no matching prefecture is found, return an empty array
  if (!area) return [];

  // Map through the municipalities to create the structure you need
  const municipalities = area.municipality.map((municipality: any, index: any) => ({
    key: index + 1,
    label: municipality.name,
    value: municipality.name
  }));

  // Add "全て" option at the beginning of the municipalities list
  // if (municipalities.length > 0 && selectedPrefecture !== '全国') {
  //   municipalities.unshift({
  //     key: 0,
  //     label: '全域',
  //     value: '全域'
  //   });
  // }

  return municipalities;
};
