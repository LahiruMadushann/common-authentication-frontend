export const FormatToYen = (amount: string, isYen: boolean = true) => {
  const num = Number(amount);
  if (isNaN(num)) {
    throw new Error('Invalid input: Not a number');
  }

  if (isYen) {
    // Format the number and manually append the Yen symbol
    return `${new Intl.NumberFormat('ja-JP').format(num)} ￥`;
  } else {
    return new Intl.NumberFormat('ja-JP').format(num);
  }
};
