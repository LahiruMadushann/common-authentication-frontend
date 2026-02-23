import fetchJsonp from 'fetch-jsonp';

// Define the base URL for the JSONP API
const BASE_URL = 'https://tools.softark.net/zipdata/api/search';

// Service function to fetch zip codes
export const getZipCodes = async (zipcode: any) => {
  try {
    // Construct the URL with query parameters
    const params = new URLSearchParams({
      mode: String(0),
      term: zipcode,
      max_rows: String(100),
      biz_mode: String(2),
      sort: String(0)
    }).toString();

    // Make the JSONP request
    const response = await fetchJsonp(`${BASE_URL}?${params}`, {
      jsonpCallback: 'callback'
    });

    // Parse the JSON response
    const data = await response.json();

    // Return the first item in the data array if available
    if (data && data?.length > 0) {
      const firstItem = data[0];
      const { town, block } = firstItem;
      const concatenatedTown = block ? `${town}${block}` : town;
      return {
        ...firstItem,
        town: concatenatedTown
      };
    } else {
      return null;
    }
  } catch (error) {
    // Handle errors and rethrow
    console.error('Error fetching zip codes:', error);
    throw new Error('Error fetching data');
  }
};
