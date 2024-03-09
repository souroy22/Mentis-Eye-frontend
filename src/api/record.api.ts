import { CREATE_USER_DATA } from "../components/UserForm";
import AXIOS from "../configs/axiosConfig";

export type PARAMS_TYPE = {
  sortBy?: string | null;
  sortOrder?: string | null;
  searchValue?: string;
  page?: number;
  limit?: number;
};

export const getRecords = async (
  database: string,
  params: PARAMS_TYPE = { page: 1, limit: 10 }
) => {
  const res: any = await AXIOS.get(`/record/${database}`, { params });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const createRecord = async (data: CREATE_USER_DATA) => {
  const res: any = await AXIOS.post("/record/create", { ...data });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
