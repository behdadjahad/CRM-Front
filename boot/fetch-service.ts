import { CustomToast } from "@/components/shared/custome-toast";
import { config } from "@/config/config";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
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
//   const headers = makeHeaders(additionalHeaders);
//   const options: any = {
//     method,
//     headers,
//     ...additionalOptions,
//   };

//   if (body && method !== "GET") {
//     if (body instanceof FormData) {
//       delete headers["Content-Type"];
//       options.body = body;
//     } else {
//       options.body = JSON.stringify(body);
//     }
//   }

//   const response = await fetch(
//     `${config.ServerAddress}/${version}/${url}`,
//     options
//   );
//   const result = await response.json();

//   if (result.ui.type === "toast") {
//     CustomToast({
//       type: result.status,
//       message: result.message,
//     });

//     // toast(data.error, {
//     //   position: "top-center",
//     //   style: {
//     //     background: "#a31111",
//     //     color: "#fff",
//     //   },
//     //   autoClose: 5000,
//     //   hideProgressBar: true,
//     //   closeOnClick: true,
//     //   pauseOnHover: true,
//     //   draggable: true,
//     //   progress: undefined,
//     // });
//     // throw new Error(data.error);
//   }

//   return result;
// }
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
  const executeFetch = async () => {
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

    return await fetch(`${config.ServerAddress}/${version}/${url}`, options);
  };

  let response = await executeFetch();
  console.log(response);
  // If access token expired
  if (response.status === 401) {
    const newAccessToken = await renewAccessToken();
    console.log(newAccessToken);
    if (newAccessToken) {
      response = await executeFetch(); // retry original request with new token
    } else {
      localStorage.removeItem("token");
      // Cookies.remove("token");
      window.location.href = "/login";

      return;
    }
  }

  const result = await response.json();

  if (result.ui?.type === "toast") {
    CustomToast({
      type: result.status,
      message: result.message,
    });
  }

  return result;
}

export async function renewAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("token");
  console.log(refreshToken);
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${config.ServerAddress}/api/v1/auth/renew`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        _rt: `${refreshToken}`,
      },
    });

    const result = await response.json();
    console.log(result);
    if (result.status === "success" && result?.data?.accessToken) {
      // Save new tokens
      localStorage.setItem("token", result.data.accessToken);

      // Cookies.set("token", result.data.accessToken, {
      //   path: "/",
      //   secure: true,
      //   sameSite: "Strict",
      //   expires: 1, // 7 days
      // });
      return result.data.accessToken;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
