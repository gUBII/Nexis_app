import {configureStore} from '@reduxjs/toolkit';

import {tabSlice} from './tabSlice';

export const store = configureStore({
  reducer: {
    tab: tabSlice.reducer,
  },
});
