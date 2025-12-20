import { TApiResponse, TCommonValue } from "../common-api.types";

// User Register
export enum EUserRole {
    USER = "user",
    ADMIN = "admin",
}
export type TUserRegisterArgs ={
  name: string;
  email: string;
  password: string;
  role?: EUserRole;
}
export type TUser = TUserRegisterArgs & TCommonValue;
export type TuserRegisterRes = TApiResponse<TUser>