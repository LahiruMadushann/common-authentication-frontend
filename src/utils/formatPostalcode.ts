export const formatPostalCode = (postalCode: any) => {
    if (!postalCode) return '---';
    
    // Check if the postal code already has a dash
    if (postalCode.includes('-')) {
      return postalCode; // Return as-is if already formatted
    }
    
    // Format to 3 digits - 4 digits (assuming raw format without dashes)
    return postalCode.replace(/(\d{3})(\d{4})/, '$1-$2');
  };