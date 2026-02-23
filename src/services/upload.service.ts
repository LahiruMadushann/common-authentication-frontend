import { BASE_URL_2 } from '../config/config';
import { httpPost } from '../config/httpService';

const URL = `${BASE_URL_2}/file/presigned`;

export const uploadImage = async (fileData: any) => {
  try {
    const response = await httpPost(`${URL}`, fileData);
    const data = response?.data;
    return data;
  } catch (error: any) {
    throw error?.response?.data?.error;
  }
};
