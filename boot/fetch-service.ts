import { CustomToast } from "@/components/shared/custome-toast";
import { config } from "@/config/config";
import Cookies from "js-cookie";
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
  // const accessToken = Cookies.get("accesstoken"); // watch for exact key
  // const refreshToken = Cookies.get("refreshToken");

  // Use accessToken if it exists, otherwise use refreshToken
  // const tokenToUse = accessToken || refreshToken;
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
// export async function fetchService(
//   url: string,
//   {
//     method = "GET",
//     body = null,
//     additionalHeaders = {},
//     additionalOptions = {},
//   }: FetchServiceType = {},
//   version = "api/v1"
// ) {
//   const executeFetch = async () => {
//     const headers = makeHeaders(additionalHeaders);
//     const options: any = {
//       method,
//       headers,
//       ...additionalOptions,
//     };

//     if (body && method !== "GET") {
//       if (body instanceof FormData) {
//         delete headers["Content-Type"];
//         options.body = body;
//       } else {
//         options.body = JSON.stringify(body);
//       }
//     }

//     return await fetch(`${config.ServerAddress}/${version}/${url}`, options);
//   };

//   let response = await executeFetch();

//   // If access token expired
//   if (response.status === 401) {
//     const newAccessToken = await renewAccessToken();
//     if (newAccessToken) {
//       response = await executeFetch(); // retry original request with new token
//     } else {
//       localStorage.removeItem("token");
//       Cookies.remove("refreshToken");
//       window.location.href = "/login"; // or router.push("/login")
//       return;
//     }
//   }

//   const result = await response.json();

//   if (result.ui?.type === "toast") {
//     CustomToast({
//       type: result.status,
//       message: result.message,
//     });
//   }

//   return result;
// }



async function renewAccessToken() {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${config.ServerAddress}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const result = await response.json();

    if (response.ok && result?.data?.accessToken) {
      // Save new token
      localStorage.setItem("token", result.data.accessToken);
      Cookies.set("refreshToken", result.data.refreshToken, {
        path: "/",
        secure: true,
        sameSite: "Strict",
        expires: 7,
      });
      return result.data.accessToken;
    }

    return null;
  } catch (error) {
    return null;
  }
}
