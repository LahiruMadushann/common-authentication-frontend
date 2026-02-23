import { BASE_URL_2 } from '../config/config';
import { httpGet, httpPost } from '../config/httpService';

const URL = `${BASE_URL_2}/buyer`;
// Get all Employees
export const RegisterBuyer = async (registerData: any) => {
  try {
    const response = await httpPost(`${URL}/registration`, registerData);
    const data = response?.data;
    return data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const CheckEmailValidation = async (email: string) => {
  try {
    const response = await httpGet(`${URL}/registration/isEmailExist?email=${email}`);
    const data = response?.data;
    return data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};
