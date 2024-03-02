import { AppThunk } from '../store';
import { setCredentials, logout } from '../reducers/authReducer';
import axios from 'axios';

export const login = (email: string, password: string): AppThunk<Promise<boolean>> => async (dispatch) => {
  try {
    const userResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {email, password});
    const accessToken = (userResponse.data as any).accessToken;
    if(accessToken) {
      dispatch(setCredentials({ user: userResponse.data }));
      axios.defaults.headers.common["x-access-token"] = accessToken;
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const check_login = (_token: string): AppThunk<Promise<boolean>> => async (dispatch) => {
  try {
    const userResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/check_login`, { _token });
    const accessToken = (userResponse.data as any).accessToken;
    if(accessToken) {
      dispatch(setCredentials({ user: userResponse.data }));
      axios.defaults.headers.common["x-access-token"] = accessToken;
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export const signout = (): AppThunk<Promise<boolean>> => async (dispatch) => {
  dispatch(logout());
  return true;
};