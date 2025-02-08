import { config } from "@/config/config";
import { toast } from "react-toastify";

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
    if (additionalHeaders["Content-Type"] != "multipart/form-data") {
      options.body = JSON.stringify(body);
    } else {
      options.body = body;
    }
  }

  const response = await fetch(
    `${config.ServerAddress}/${version}/${url}`,
    options
  );
  const data = await response.json();

  if (data.error) {
    toast(data.error, {
      position: "top-center",
      style: {
        background: "#a31111",
        color: "#fff",
      },
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    throw new Error(data.error);
  }

  return data;
}
