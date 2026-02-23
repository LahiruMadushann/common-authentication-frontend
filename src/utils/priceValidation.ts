
export interface PriceValidationResult {
  isValid: boolean;
  formattedValue: string;
  errorMessage: string;
  numericValue: number;
}


export const toHalfWidth = (str: string): string => {
  return str
    .replace(/[０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    })
    .replace(/,/g, ',');
};

export const formatWithCommas = (num: string): string => {
  const numericValue = num.replace(/,/g, '');
  if (numericValue === '') return '';
  return Number(numericValue).toLocaleString('en-US');
};


export const removeCommas = (formattedNum: string): string => {
  return formattedNum.replace(/,/g, '');
};

export const validateAndFormatPrice = (
  inputValue: string
): PriceValidationResult => {
  // Convert full-width to half-width
  const halfWidthValue = toHalfWidth(inputValue);

  // Remove commas for validation
  const numericString = halfWidthValue.replace(/,/g, '');

  // Check if it's a valid number
  if (numericString !== '' && !/^\d+$/.test(numericString)) {
    return {
      isValid: false,
      formattedValue: inputValue,
      errorMessage: '数値のみ入力してください。',
      numericValue: 0
    };
  }

  if (numericString === '') {
    return {
      isValid: true,
      formattedValue: '',
      errorMessage: '',
      numericValue: 0
    };
  }

  const numericValue = Number(numericString);

  // Check if value is below 1000
  if (numericValue < 1000) {
    return {
      isValid: false,
      formattedValue: formatWithCommas(numericString),
      errorMessage: '買取金額は1,000円以上で入力してください。',
      numericValue: numericValue
    };
  }

  // Valid input
  return {
    isValid: true,
    formattedValue: formatWithCommas(numericString),
    errorMessage: '',
    numericValue: numericValue
  };
};