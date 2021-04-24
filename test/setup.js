import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { clearLog, resetInstanceIdCounters} from '../src';

jest.useFakeTimers();

afterEach(() => {
  // Explicitly call cleanup, run timers and clear the log, or unmount will get logged on next test.
  cleanup();
  jest.runAllTimers();
  clearLog();
  resetInstanceIdCounters();
});
