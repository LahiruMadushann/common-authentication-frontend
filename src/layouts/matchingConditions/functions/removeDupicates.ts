export function removeDuplicatesNested(data) {
    const uniqueValues = new Set();

    return data?.map((item) => {
        // Filter out duplicates in children
        const filteredChildren = item?.children?.filter((child) => {
          if (!uniqueValues?.has(child?.value)) {
            uniqueValues?.add(child?.value);
            return true;
          }
          return false;
        });

        // Check if the top-level item itself is a duplicate
        if (!uniqueValues?.has(item?.value)) {
          uniqueValues?.add(item?.value);
          return {
            ...item,
            children: filteredChildren,
          };
        }
        return null;
      })
      .filter((item) => item !== null);
  }

  export function removeDuplicates(arr) {
    const seenValues = new Set();
    let keyCounter = 1; // Start key numbering from 1 (or any other starting number you prefer)
  
    return arr?.filter((item) => {
      if (!seenValues?.has(item?.value)) {
        seenValues?.add(item?.value);
        item.key = keyCounter.toString(); // Reassign key with a sequential number
        keyCounter++;
        return true;
      }
      return false;
    });
  } 
  