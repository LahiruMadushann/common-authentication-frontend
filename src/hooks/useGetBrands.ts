import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook to fetch vehicle data
export const useGetBrandsHook = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Generate an array of URLs for the JSON files
        const urls = Array.from(
          { length: 96 },
          (_, i) => `https://d3jbkxdk2o6mwn.cloudfront.net/vehicle-master-data/${i + 1}.json`
        );

        // Create an array of axios get requests
        const fetchRequests = urls.map((url) =>
          axios
            .get(url, {
              headers: {
                'Accept-Encoding': 'gzip,br'
              }
            })
            .catch((error) => {
              console.error(`Error fetching ${url}: `, error);
              return { data: [] }; // Return an empty array on error
            })
        );

        // Wait for all axios requests to resolve
        const responses = await Promise.all(fetchRequests);

        // Extract data from all responses
        const dataArray = responses.map((response) => response.data);

        // Merge all data into a single array
        const mergedData: any = dataArray.flat();

        // Set the merged data to your state
        setData(mergedData);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching data: ', error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
