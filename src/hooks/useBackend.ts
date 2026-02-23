import axios from "axios";

export const useBackend = () => {
  const api = axios.create({
    withCredentials: true,
  });
  api.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    if (token && !config.url.includes('/login')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  api.interceptors.response.use((response) => {
    if (response?.status == 401) window.location.href = "/console/login";
    return response;
  });
  const appraisal_list = (d: any) => {
    return api.get(process.env.REACT_APP_ENDPOINT + "/appraisal", {
      params: d,
    });
  };

  const gen_appraisal_csv = () => {
    return api.get(
      process.env.REACT_APP_ENDPOINT_V2 +
      "/file/presigned/assessedAppraisal/csv"
    );
  };

  const gen_billing_csv = (totalElement: any, year: any, month: any) => {
    return api.get(
      process.env.REACT_APP_ENDPOINT_V2 + "/file/presigned/billingDashboard/csv",
      {
        params: { totalElement: totalElement, year: year, month: month }
      }
    );
  };


  const appraisal = (id: any) => {
    return api.get(process.env.REACT_APP_ENDPOINT + "/appraisal/" + id);
  };

  const edit = (data: any) => {
    return api.patch(process.env.REACT_APP_ENDPOINT + "/appraisal", data);
  };

  const rejected_by_shop = (data: any) => {
    return api.patch(
      process.env.REACT_APP_ENDPOINT_V2 + "/assessed/is-rejected-by-shop",
      data
    );
  };

  const allshops = () => {
    return api.get(process.env.REACT_APP_ENDPOINT + "/shop");
  };

  const shops = (aid: any) => {
    return api.get(
      process.env.REACT_APP_ENDPOINT + "/appraisal/" + aid + "/shop"
    );
  };

  const shop_select = (id: any, data: any) => {
    return api.put(
      process.env.REACT_APP_ENDPOINT + "/assessment/manual/" + id,
      data
    );
  };

  const suggest = (id: any, data: any) => {
    return api.put(
      process.env.REACT_APP_ENDPOINT + "/assessment/suggest/" + id
    );
  };

  const suggestv2 = (id: any, data: any) => {
    return api.put(
      process.env.REACT_APP_ENDPOINT + "/assessment/suggest/v2/" + id
    );
  };

  const done = (id: any) => {
    return api.put(process.env.REACT_APP_ENDPOINT + "/assessment/done/" + id);
  };

  const draft_done = (id: any) => {
    return api.put(
      process.env.REACT_APP_ENDPOINT + "/assessment/done/" + id + "/draftEmail"
    );
  };

  const report = (d: any) => {
    return api.get(process.env.REACT_APP_ENDPOINT + "/shop/report", {
      params: d,
    });
  };
  const am_i_logged_in = () => {
    return api.get(process.env.REACT_APP_ENDPOINT + "/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  };

  const login = (data: any) => {
    return api.post(process.env.REACT_APP_ENDPOINT + "/auth/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const pass_change = (after_pass: any) => {
    return api.patch(process.env.REACT_APP_ENDPOINT + "/user/password-change", {
      after: after_pass,
    });
  };

  const register = (id: any, pass: any) => {
    return api.put(process.env.REACT_APP_ENDPOINT + "/user/register", {
      id: id,
      pass: pass,
    });
  };

  const logout = () => {
    return api.post(process.env.REACT_APP_ENDPOINT + "/auth/logout");
  };
  return {
    appraisal_list,
    appraisal,
    edit,
    allshops,
    shops,
    shop_select,
    report,
    suggest,
    done,
    am_i_logged_in,
    login,
    pass_change,
    register,
    logout,
    gen_appraisal_csv,
    draft_done,
    rejected_by_shop,
    suggestv2,
    gen_billing_csv,
  };
};
