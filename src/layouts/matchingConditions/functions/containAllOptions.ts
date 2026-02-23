export function containsAllOption(array: any[] | undefined): boolean {
  if (!array || !Array.isArray(array)) return false;
  return array.includes('全て');
}
export function extractValues(data: any, key: any) {
  return data?.map((item: any) => item[key]);
}
