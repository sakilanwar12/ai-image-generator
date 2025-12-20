import { envVars } from "@/config/envVars";
import { revalidateApiTag } from "./revalidate";

const API_BASE_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

const getUrl = (path: string) => {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
  }
  return `${API_BASE_URL}/${path}`;
};

const apiList = {
  auth: {
    register: () => getUrl("api/v1/auth/register"),
  },
};

export { revalidateApiTag };
export default apiList;
