export const formatPhoneNumber = (phoneNumber: string): string => {
    if (!phoneNumber || phoneNumber === '--') return '--';
    
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
    
    return phoneNumber;
  };