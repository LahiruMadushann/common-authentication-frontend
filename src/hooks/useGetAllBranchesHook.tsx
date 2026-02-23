'use client';
import { useEffect, useState } from 'react';
import { setCustomErrorToast } from '../utils/notification';
import { MESSAGES } from '../constants/messages.constant';
import { fetchAllHeadBranches } from '../services/headBranch.service';

export const useGetAllBranchesHook = () => {
  const [headBranches, setHeadBranches] = useState([]);
  const getAllBranch = async () => {
    try {
      const response = await fetchAllHeadBranches();
      setHeadBranches(response);
    } catch (error: any) {
      if (error.status == 401) {
        setCustomErrorToast(MESSAGES.SESSION_EXPIRES);
      }
    }
  };

  useEffect(() => {
    getAllBranch();
  }, []);
  return { headBranches };
};
