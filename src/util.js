export const padZeroes = (width, n) => ('' + n).padStart(width, '0');

export const getTimeStamp = () => {
  const now = new Date();
  return `[${padZeroes(2, now.getHours())}:${padZeroes(2, now.getMinutes())}:` +
         `${padZeroes(2, now.getSeconds())}.${padZeroes(3, now.getMilliseconds())}]`;
};

const shownWarningLabels = [];

export const withDeprecationWarning = (warningLabel, fn) => (...args) => {
  if (!shownWarningLabels.includes(warningLabel)) {
    let message;
    switch (warningLabel) {
      // case constants.DEPRECATED_DEPRECATED_FEATURE:
      //  message = 'DEPRECATED_FEATURE is deprecated, please use FEATURE instead.';
      //  break;
      default:
        message = 'Unspecified warning.';
    }

    // eslint-disable-next-line no-console
    console.warn(`WARNING: react-lifecycle-visualizer: ${message}`);
    shownWarningLabels.push(warningLabel);
  }
  return fn(...args);
};
