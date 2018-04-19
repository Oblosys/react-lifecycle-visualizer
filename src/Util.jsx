export const padZeroes = (width, n) => ('' + n).padStart(width, '0');

export const getTimeStamp = () => {
  const now = new Date();
  return `[${padZeroes(2, now.getHours())}:${padZeroes(2, now.getMinutes())}:` +
         `${padZeroes(2, now.getSeconds())}.${padZeroes(3, now.getMilliseconds())}]`;
};
