import { CustomToast } from "@/components/shared/custome-toast";
import { config } from "@/config/config";

import { redirect } from "next/navigation";
type MehtodType = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
type HeaderType = Record<string, string | any>;
export interface FetchServiceType {
  method?: MehtodType;
  body?: any;
  additionalHeaders?: HeaderType;
  additionalOptions?: HeaderType;
}

function makeHeaders(additionalHeaders: HeaderType = {}) {
  const token = localStorage.getItem("token");
 
  return {
    "Content-Type": additionalHeaders["Content-Type"] || "application/json",
    ...additionalHeaders,
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchService(
  url: string,
  {
    method = "GET",
    body = null,
    additionalHeaders = {},
    additionalOptions = {},
  }: FetchServiceType = {},
  version = "api/v1"
) {
  const headers = makeHeaders(additionalHeaders);
  const options: any = {
    method,
    headers,
    ...additionalOptions,
  };

  if (body && method !== "GET") {
    if (body instanceof FormData) {
      delete headers["Content-Type"];
      options.body = body;
    } else {
      options.body = JSON.stringify(body);
    }
  }

  const response = await fetch(
    `${config.ServerAddress}/${version}/${url}`,
    options
  );
  const result = await response.json();

  if (result.ui.type === "toast") {
    CustomToast({
      type: result.status,
      message: result.message,
    });
    // toast(data.error, {
    //   position: "top-center",
    //   style: {
    //     background: "#a31111",
    //     color: "#fff",
    //   },
    //   autoClose: 5000,
    //   hideProgressBar: true,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    // });
    // throw new Error(data.error);
  }

  return result;
}
