export type TNullish = null | undefined;
export type TString = string | TNullish;
export type TNumber = number | TNullish;
export type TBoolean = boolean | TNullish;

export type TApiResponse<T> = {
  data: T;
  message: TString;
  success: TBoolean;
  error: TNullish;
};

export type TCommonValue = {
    id: string;
    createdAt: TString;
    updatedAt: TString;
}