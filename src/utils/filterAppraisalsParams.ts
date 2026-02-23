const filterAppraisalsParams = (appraisalsQueryParams : any) => {
  let requestedQueryParams = {};

  Object.entries(appraisalsQueryParams).forEach(([key, value]) => {
    if (value !== null) {
      requestedQueryParams = {
        ...requestedQueryParams,
        [key]: value
      };
    }
  });
  return requestedQueryParams;
};

export { filterAppraisalsParams };
