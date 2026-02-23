import { useEffect, useState } from "react";
import {
  useLazyGetFilterAppraisalsQuery,
} from "@/src/services/appraisals.api";
import AppraisalsTable from "./table";
import FilterSectionAppraisals from "./filter-section";
import { filterAppraisalsParams } from "../../utils/filterAppraisalsParams";
import { TableLoadingSkeleton } from '@/src/components/loading-screens';
import { useGetAuthenticateQuery } from "@/src/app/services/auth";

const AppraisalsLayout = () => {
  const { data: userData } = useGetAuthenticateQuery(null);

  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [appraisalsQueryParams, setAppraisalsQueryParams] = useState({
    unsupported: false,
    closed: false,
    not_compatible: false,
    unconnected: false,
    no_connected_assessments: false,
    assessment_reservation: false,
    assessed: false,
    unexecuted: false,
    duplication_of_media: false,
    sale_of_other_companies: false,
    submit_an_application: false,
    recognition_applied: false,
    recognition_not_accepted: false,
    contracted: false,
    user_complaint: false,
    processing: false,
    appointment: false,
    cancelled: false,
    seo: false,
    paid: false,
    paid2: false,
    paid3: false,
    phone: false,
    phone_no: "",
    isTestData: userData?.userId == 205 || false,
    kw: "",
    offset: 0,
    limit: 20,
    to: "",
    from: "",
  });

  const [fetchAppraisalsFunc, { data, isLoading }] = useLazyGetFilterAppraisalsQuery();

  useEffect(() => {
    if (appraisalsQueryParams.unsupported && !appraisalsQueryParams.closed) {
      setAppraisalsQueryParams(prev => ({
        ...prev,
        closed: true
      }));
    }
  }, [appraisalsQueryParams.unsupported, appraisalsQueryParams.closed]);

  useEffect(() => {
    if (userData && isInitialLoad) {
      const queryParams = {
        ...appraisalsQueryParams,
        isTestData: userData.userId == 205
      };

      const requestedQueryParams = filterAppraisalsParams(queryParams);
      fetchAppraisalsFunc(requestedQueryParams);
      setIsInitialLoad(false);
    }
  }, [userData, isInitialLoad]);

  useEffect(() => {
    if (userData && !isInitialLoad) {
      const queryParams = {
        ...appraisalsQueryParams,
        isTestData: userData.userId == 205
      };

      const requestedQueryParams = filterAppraisalsParams(queryParams);
      fetchAppraisalsFunc(requestedQueryParams);
    }
  }, [
    appraisalsQueryParams.unsupported,
    appraisalsQueryParams.not_compatible,
    appraisalsQueryParams.unconnected,
    appraisalsQueryParams.no_connected_assessments,
    appraisalsQueryParams.assessment_reservation,
    appraisalsQueryParams.assessed,
    appraisalsQueryParams.unexecuted,
    appraisalsQueryParams.duplication_of_media,
    appraisalsQueryParams.sale_of_other_companies,
    appraisalsQueryParams.submit_an_application,
    appraisalsQueryParams.recognition_applied,
    appraisalsQueryParams.recognition_not_accepted,
    appraisalsQueryParams.contracted,
    appraisalsQueryParams.user_complaint,
    appraisalsQueryParams.appointment,
    appraisalsQueryParams.processing,
    appraisalsQueryParams.cancelled,
    appraisalsQueryParams.seo,
    appraisalsQueryParams.paid,
    appraisalsQueryParams.paid2,
    appraisalsQueryParams.paid3,
    appraisalsQueryParams.phone,
    appraisalsQueryParams.isTestData
  ]);

  const onChangePagination = async (pageIndex: number, pageSize: number) => {
    setIsPaginationLoading(true);

    const queryParams = {
      ...appraisalsQueryParams,
      isTestData: userData?.userId == 205 || false,
      limit: pageSize,
      offset: pageIndex * pageSize,
    };

    const requestedQueryParams = filterAppraisalsParams(queryParams);

    try {
      await fetchAppraisalsFunc(requestedQueryParams).unwrap();
    } catch (error) {
      console.error("Error fetching paginated data:", error);
    } finally {
      setIsPaginationLoading(false);
    }
  };

  const onClickSearch = async () => {
    setIsPaginationLoading(true);

    const queryParams = {
      ...appraisalsQueryParams,
      offset: 0,
      isTestData: userData?.userId == 205 || false,
    };

    setAppraisalsQueryParams(queryParams);

    const requestedQueryParams = filterAppraisalsParams(queryParams);

    try {
      await fetchAppraisalsFunc(requestedQueryParams).unwrap();
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setIsPaginationLoading(false);
    }
  };

  const onClickClear = async (appraisalsClearParams: any) => {
    setIsPaginationLoading(true);

    const queryParams = {
      ...appraisalsClearParams,
      isTestData: userData?.userId == 205 || false,
    };

    const requestedQueryParams = filterAppraisalsParams(queryParams);

    try {
      await fetchAppraisalsFunc(requestedQueryParams).unwrap();
    } catch (error) {
      console.error("Error clearing filters:", error);
    } finally {
      setIsPaginationLoading(false);
    }
  };

  const onRejectedByShopSuccess = async () => {
    setIsPaginationLoading(true);

    const queryParams = {
      ...appraisalsQueryParams,
      isTestData: userData?.userId == 205 || false,
    };

    const requestedQueryParams = filterAppraisalsParams(queryParams);

    try {
      await fetchAppraisalsFunc(requestedQueryParams).unwrap();
    } catch (error) {
      console.error("Error refreshing after rejection:", error);
    } finally {
      setIsPaginationLoading(false);
    }
  };

  return (
    <div>
      <FilterSectionAppraisals
        appraisalsQueryParams={appraisalsQueryParams}
        rowCount={data && data.allCount ? data.allCount : 0}
        setAppraisalsQueryParams={setAppraisalsQueryParams}
        onClickSearch={onClickSearch}
        onClickClear={onClickClear}
      />
      {data && !isLoading ? (
        <AppraisalsTable
          data={data.operatorAppraisalList ? data.operatorAppraisalList : []}
          rowCount={data.allCount ? data.allCount : 0}
          onChangePagination={onChangePagination}
          onRejectedByShopSuccess={onRejectedByShopSuccess}
          isPaginationLoading={isPaginationLoading}
        />
      ) : (
        <TableLoadingSkeleton />
      )}
    </div>
  );
};

export default AppraisalsLayout;