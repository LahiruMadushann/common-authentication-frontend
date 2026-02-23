export function convertArrayToObject(inputArray) {
  // Check if input is an array, else return an empty object
  if (!Array.isArray(inputArray)) {
    return {};
  }

  // Create an object with unique keys starting from 1
  const result = {};
  inputArray.forEach((value, index) => {
    // Use index + 1 as the key, starting from "1"
    result[(index + 1).toString()] = value.trim();
  });

  return result;
}

export const formatInitial = (brandDatas, values) => {
  const initial = {};

  Object.entries(values).forEach(([key, itemName]) => {
    let groupIndex = -1;
    let itemIndex = -1;

    // Find the group and item index
    for (let i = 0; i < brandDatas.length; i++) {
      const brand = brandDatas[i];
      for (let j = 0; j < brand.maqh.length; j++) {
        const item = brand.maqh[j];
        if (item.name === itemName) {
          groupIndex = i + 1;
          itemIndex = j + 1;
          break;
        }
      }
      if (groupIndex !== -1) break;
    }

    if (groupIndex !== -1 && itemIndex !== -1) {
      initial[`${groupIndex}-${itemIndex}`] = itemName;
    }
  });

  return initial;
};

// Example usage:
const brandDatas = [
  {
    brand: "Brand A",
    maqh: [
      { group: "Group 1", name: "Item A1" },
      { group: "Group 1", name: "Item A2" },
    ],
  },
  {
    brand: "Brand B",
    maqh: [
      { group: "Group 2", name: "Item B1" },
      { group: "Group 2", name: "Item B2" },
    ],
  },
  {
    brand: "Brand C",
    maqh: [
      { group: "Group 3", name: "Item C1" },
      { group: "Group 3", name: "Item C2" },
    ],
  },
];

const values = { 1: "Item A2", 2: "Item A1" };
const initial = formatInitial(brandDatas, values);

// console.log(initial);

export function extractChildrenValues(data: any[]) {
  const result: { [key: string]: string } = {};
  
  if (!Array.isArray(data)) return result;

  data.forEach((item, brandIndex) => {
    if (item.children && Array.isArray(item.children)) {
      item.children.forEach((child: any, childIndex: number) => {
        // Create key in format "brandIndex+1-childIndex+1"
        const key = `${brandIndex + 1}-${childIndex + 1}`;
        result[key] = child.value;
      });
    }
  });
  return result;
}

export function findMatchingChildrenValues(data: any[], carTypes: Array<{ carType: string, carMaker: string }>) {
  const result: { [key: string]: string } = {};
  
  if (!Array.isArray(data) || !Array.isArray(carTypes)) return result;

  data.forEach((brand, brandIndex) => {
    if (brand.children && Array.isArray(brand.children)) {
      brand.children.forEach((child: any, childIndex: number) => {
        // Check if this car type exists in the carTypes array
        const matchingCarType = carTypes.find(
          ct => ct.carType === child.value && ct.carMaker === brand.value
        );
        
        if (matchingCarType) {
          // Create key in format "brandIndex+1-childIndex+1"
          const key = `${brandIndex + 1}-${childIndex + 1}`;
          result[key] = child.value;
        }
      });
    }
  });
  
  return result;
}




export function convertChekedArrayToObject(bodyTypes, referenceArray) {
  // Check if bodyTypes is an array of objects and referenceArray is an array, else return an empty object
  if (!Array.isArray(bodyTypes) || !Array.isArray(referenceArray)) {
    return {};
  }

  // Create an object to store the result
  const result = {};

  // Iterate over the bodyTypes array
  bodyTypes?.forEach((item, index) => {
    if (item && item.body_type) {
      // Trim the body_type value
      const trimmedValue = item.body_type.trim();

      // Find the index of the trimmedValue in the referenceArray
      if (referenceArray?.includes(trimmedValue)) {
        // Use the exact key from bodyTypes as the key
        result[(index + 1).toString()] = trimmedValue;
      }
    }
  });

  return result;
}

export function convertArrayToObjectWithKeys(inputArray, referenceArray) {
  
  if (!Array.isArray(inputArray) || !Array.isArray(referenceArray)) {
    return {};
  }

  const result = {};

  inputArray?.forEach((item) => {
    if (item && item.value) {
      const trimmedValue = item.value.trim();

      if (referenceArray.includes(trimmedValue)) {
        result[item.key] = trimmedValue;
      }
    }
  });

  return result;
}
