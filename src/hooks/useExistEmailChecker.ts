import { CheckEmailValidation } from '../services/buyer.service';
import { setCustomErrorToast } from '../utils/notification';

export const useEmailValidation = (setIsValid: any) => {
  const handleCheckEmailValid = async (email: any) => {
    try {
      const response = await CheckEmailValidation(email);

      if (response === 'Email is available') {
        setIsValid(true);
      }
    } catch (error) {
      setIsValid(false);
      setCustomErrorToast('無効なメールアドレスです');
    }
  };

  return { handleCheckEmailValid };
};
