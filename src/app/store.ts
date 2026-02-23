import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authApi } from './services/auth';
import { invoiceApi } from './services/invoice';
import { noticesApi } from './services/notices';
import { messageApi } from './services/message';
import { shopDetailsApi, shopInvoiceApi, shopsApi, shopUploadApi, storeDetailsApi } from './services/shops';
import authReducer from './services/authSlice';
import { fileUploadApi } from './services/fileUpload';
import { passwordApi } from './services/password';
import { appraisalApi } from './services/appraisal';
import { appraisalsApi } from '../services/appraisals'; // Ensure correct import
import { assessedApi } from './services/assessed';
import { memoApi } from './services/memo';
import { assessedPhotosApi } from './services/assessedPhtos';
import { rejectAppraisalApi } from './services/reject';
import { buyerStatusApi } from './services/buyerStatus';
import { improvementRequestApi } from './services/improvementRequest';
import { fileControllsApi } from './services/fileControll';
import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if ((action.payload as { status?: number })?.status === 401) {
      localStorage.clear();
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    }
  }
  return next(action);
};

export const createStore = (options?: ConfigureStoreOptions['preloadedState'] | undefined) =>
  configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [invoiceApi.reducerPath]: invoiceApi.reducer,
      [noticesApi.reducerPath]: noticesApi.reducer,
      [messageApi.reducerPath]: messageApi.reducer,
      [appraisalApi.reducerPath]: appraisalApi.reducer, // Keep this for appraisalApi
      [appraisalsApi.reducerPath]: appraisalsApi.reducer, // Correct reducer for appraisalsApi
      [shopsApi.reducerPath]: shopsApi.reducer,
      [shopDetailsApi.reducerPath]: shopDetailsApi.reducer,
      [fileUploadApi.reducerPath]: fileUploadApi.reducer,
      [passwordApi.reducerPath]: passwordApi.reducer,
      [assessedApi.reducerPath]: assessedApi.reducer,
      [memoApi.reducerPath]: memoApi.reducer,
      [assessedPhotosApi.reducerPath]: assessedPhotosApi.reducer,
      [rejectAppraisalApi.reducerPath]: rejectAppraisalApi.reducer,
      [shopUploadApi.reducerPath]: shopUploadApi.reducer,
      [storeDetailsApi.reducerPath]: storeDetailsApi.reducer,
      [shopInvoiceApi.reducerPath]: shopInvoiceApi.reducer,
      [buyerStatusApi.reducerPath]: buyerStatusApi.reducer,
      [improvementRequestApi.reducerPath]: improvementRequestApi.reducer,
      [fileControllsApi.reducerPath]: fileControllsApi.reducer,
      auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      })
      .concat(rtkQueryErrorLogger)
      .concat(
        authApi.middleware,
        invoiceApi.middleware,
        noticesApi.middleware,
        messageApi.middleware,
        appraisalApi.middleware,
        appraisalsApi.middleware, // Correct middleware for appraisalsApi
        shopsApi.middleware,
        shopDetailsApi.middleware,
        fileUploadApi.middleware,
        passwordApi.middleware,
        assessedApi.middleware,
        memoApi.middleware,
        assessedPhotosApi.middleware,
        passwordApi.middleware,
        rejectAppraisalApi.middleware,
        passwordApi.middleware,
        shopUploadApi.middleware,
        storeDetailsApi.middleware,
        shopInvoiceApi.middleware,
        buyerStatusApi.middleware,
        improvementRequestApi.middleware,
        fileControllsApi.middleware
      ),
    ...options
  });

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
