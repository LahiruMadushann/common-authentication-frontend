import axiosInstance from '../config/axiosInstance.config';

export const httpGet = (url: string) => {
  return axiosInstance.get(url);
};

export const httpPost = (url: string, data: any) => {
  return axiosInstance.post(url, data);
};

export const httpPut = (url: string, data: any) => {
  return axiosInstance.put(url, data);
};

export const httpPatch = (url: string, data: any) => {
  return axiosInstance.patch(url, data);
};

export const httpDelete = (url: string) => {
  return axiosInstance.delete(url);
};
