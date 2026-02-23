import { BASE_URL_2 } from '../config/config';
import { httpDelete, httpGet, httpPatch } from '../config/httpService';

const URL = `${BASE_URL_2}/shop`;

export const getShopById = async (shopId: number | string) => {
  try {
    const response = await httpGet(`${URL}?id=${shopId}`);
    const data = response?.data;
    return data;
  } catch (error: any) {
    throw error?.response?.data?.error;
  }
};

export const getShopConditionById = async (shopId: number | string, type: any) => {
  try {
    const response = await httpGet(`${URL}/condition?shopId=${shopId}&subscriptionType=${type}`);
    const data = response?.data;
    return data;
  } catch (error: any) {
    throw error?.response?.data?.error;
  }
};
export const updateShopCondtions = async (condiationData: any) => {
  try {
    const response = await httpPatch(`${URL}/condition`, condiationData);
    const data = response?.data;
    return data;
  } catch (error: any) {
    throw error?.response?.data?.error;
  }
};

export const updateShopBuyer = async (id: any, updatedData: any) => {
  try {
    const response = await httpPatch(`${URL}`, updatedData);
    const data = response?.data;
    return data;
  } catch (error: any) {
    throw error?.response?.data?.error;
  }
};

export const updateShopCondtion = async (updatedData: any) => {
  try {
    const response = await httpPatch(`${URL}/condition`, updatedData);
    const data = response?.data;
    return data;
  } catch (error: any) {
    throw error?.response?.data?.error;
  }
};

export const deleteShop = async (shopId: string | number) => {
  try {
    const response = await httpDelete(`${URL}?id=${shopId}`);
    const data = response?.data;
    return data;
  } catch (error: any) {
    throw error?.data;
  }
};
