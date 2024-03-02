import axios from 'axios';

export const UserService = {
  getUserList(params: any) {
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/getUserListWithPagination`, { params });
  },
  deleteUser(id: String) {
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/deleteUser`, { id });
  },
  saveUser(user: any) {
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/updateUser`, { user });
  }
}