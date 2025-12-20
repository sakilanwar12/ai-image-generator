import { TUserRegisterArgs, TuserRegisterRes } from "./auth.type";
import apiList from "..";
import { apiUtils } from "../api-utils";
import { API_TAGS } from "../api-tags";

export const authApi = {
  endpoints: {
    register: {
      mutation: (payload: TUserRegisterArgs) =>
        apiUtils.post<TuserRegisterRes>(apiList.auth.register(), payload),
      invalidatesTags: [API_TAGS.USERS.LIST],
    },
  },
};

export const registerUser = authApi.endpoints.register.mutation;
