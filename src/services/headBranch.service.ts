import { BASE_URL_2 } from '../config/config';
import { httpGet } from '../config/httpService';

const URL = `${BASE_URL_2}/public`;

// Get all Employees
export const fetchAllHeadBranches = async () => {
  try {
    const response = await httpGet(`${URL}/headBranch`);
    const data = response?.data;
    return data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};
