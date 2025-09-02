import { CustomToast } from "@/components/shared/custome-toast";
import { config } from "@/config/config";
import { RootState, store } from "@/store";

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
  const hashCode = localStorage.getItem("hash");
  // const code =localStorage.getItem("currentPageCode");
  const code = "contract";
  console.log(hashCode, code);
  return {
    "Content-Type": additionalHeaders["Content-Type"] || "application/json",
    ...additionalHeaders,
    Authorization: `Bearer ${token}`,
    ...(code ? { "x-page-code": code } : {}),
    ...(hashCode ? { "x-access-hash": hashCode } : {}),
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
  // --- Check 2: hash missing in localStorage ---
  let hashCode = localStorage.getItem("hash");
  if (!hashCode) {
    const accessData = await getAccess();
    if (accessData?.data?.hash) {
      localStorage.setItem("hash", accessData.data.hash);
      hashCode = accessData.data.hash;
    }
  }
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

  // If access token expired
  if (response.status === 401) {
    const newAccessToken = await renewAccessToken();

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

  if (result?.meta?.hasChanged) {
    const accessData = await getAccess();
    if (accessData?.data) {
      if (accessData.data.hash) {
        localStorage.setItem("hash", accessData.data.hash);
      }
      if (accessData.data.accessToken) {
        localStorage.setItem("token", accessData.data.accessToken);
      }
    }
  }

  if (result?.ui?.type === "toast") {
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
export async function getAccess() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const response = await fetch(`${config.ServerAddress}/api/v1/user/access`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    return null;
  }
}

// export async function checkAccessHashIsSet() {
//   const hashCode = localStorage.getItem("hash");
//   if (!hashCode ) {
//     const accessData = getAccess();
//     localStorage.setItem("hash", accessData?.data?.hash);
//     // localStorage.setItem("hash", accessData?.data?.hash);
//   }
// }
