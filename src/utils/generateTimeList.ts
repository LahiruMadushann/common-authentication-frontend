import moment from 'moment-timezone';

export const generateTimeOptions = () => {
  let options = [];
  let key = 0;
  for (let hour = 8; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const timeLabel = `${formattedHour}:${formattedMinute}`;
      const timeValue = `${formattedHour}:${formattedMinute}`;
      options.push({ key: key++, label: timeLabel, value: timeValue });
    }
  }
  // Add the last entry for 22:00
  options.push({ key: key++, label: '22:00', value: '22:00' });
  return options;
};

export const generateHourOptions = () => {
  let options = [];
  for (let hour = 8; hour <= 22; hour++) {
    const formattedHour = hour.toString().padStart(2, '0');
    options.push({ key: formattedHour, label: formattedHour, value: formattedHour });
  }
  return options;
};

export const generateMinuteOptions = () => {
  let options = [];
  for (let minute = 0; minute < 60; minute += 30) {
    const formattedMinute = minute.toString().padStart(2, '0');
    options.push({ key: formattedMinute, label: formattedMinute, value: formattedMinute });
  }
  return options;
};

export const convertToJapaneseTime = (inputTime: any) => {
  // Check for null, undefined, or if emailSendTime does not exist
  if (!inputTime || !inputTime.emailSendTime) {
    return '';
  }

  // Convert and format the emailSendTime to Japanese time zone
  const japaneseTime = moment(inputTime.emailSendTime)
    .tz('Asia/Tokyo') // Convert to Japan time zone
    .format('YYYY/M/D H:mm:ss'); // Format as YYYY/M/D H:mm:ss

  return japaneseTime;
};

export const convertToGeneralTimeFormat = (inputTime: any) => {
  // Check for null, undefined, or if emailSendTime does not exist
  if (!inputTime || !inputTime.requestYMD) {
    return '';
  }

  // Convert and format the emailSendTime to Japanese time zone
  const japaneseTime = moment(inputTime.requestYMD).format('YYYY/M/D H:mm:ss'); // Format as YYYY/M/D H:mm:ss

  return japaneseTime;
};
