export const isEmptyOrNullObject = (obj: any) => {
  if (obj === null || typeof obj !== 'object') {
    return true;
  }

  return Object.keys(obj).every((key) => obj[key] === null);
};
export function hasNonNullValues(obj: any) {
  for (let key in obj) {
    if (obj[key] !== null) {
      return true;
    }
  }
  return false;
}

export function getValuesAsStringArray(checkedValues: { [key: string]: string }, brandData?: any[]) {
  if (!checkedValues || typeof checkedValues !== 'object') {
    return [];
  }

  // If there are no checked values, return empty array
  if (Object.keys(checkedValues).length === 0) {
    return [];
  }

  if (!brandData) {
    // If no brandData provided, just return the values
    return Object.values(checkedValues).filter(Boolean);
  }

  // Convert to array of objects with carType and carMaker
  const result: Array<{ carType: string, carMaker: string }> = [];
  
  Object.entries(checkedValues).forEach(([key, carType]) => {
    if (!carType) return;

    // Parse the key to get indices
    const [brandIndex, itemIndex] = key.split('-').map(num => parseInt(num) - 1);
    
    if (brandData[brandIndex]) {
      result.push({
        carType: carType,
        carMaker: brandData[brandIndex].brand
      });
    }
  });

  return result;
}
