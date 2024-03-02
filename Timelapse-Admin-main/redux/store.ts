import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import authReducer from './reducers/authReducer';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });