import axios from "axios";

let axiosInstance = null;
let headers = {
  "Content-Type": "application/json;charset=UTF-8",
};

function setHeaders(inputHeaders) {
  headers = { headers, inputHeaders };
  getInstance().defaults.headers.common = headers;
}

function getHeaders() {
  return headers;
}

function getInstance() {
  if (axiosInstance != null) {
    return axiosInstance;
  }

  axiosInstance = axios.create({
    baseURL: "http://103.170.122.68:9090",
    headers: getHeaders(),
  });

  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // config.headers.Authorization = `Bearer ${token}`;
      // config.headers["x-api-token"] = token;
      config.headers.Authorization = `Bearer ${token}`;
      // config.headers["ngrok-skip-browser-warning"] = true;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response.status === 401 || error?.response.status === 403) {
        localStorage.removeItem("token");
        // window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );
  return axiosInstance;
}

function get(endpointApiUrl, payload = {}, config = {}) {
  return getInstance().get(endpointApiUrl, {
    params: payload,
    ...config,
  });
}

function post(endpointApiUrl, payload = {}, config = {}) {
  return getInstance().post(endpointApiUrl, payload, config);
}

function put(endpointApiUrl, payload = {}, config = {}) {
  return getInstance().put(endpointApiUrl, payload, config);
}

function del(endpointApiUrl, payload = {}, config = {}) {
  return getInstance().delete(endpointApiUrl, payload, config);
}

function patch(endpointApiUrl, payload = {}, config = {}) {
  return getInstance().patch(endpointApiUrl, payload, config);
}

export const Axios = {
  axiosInstance,
  getHeaders,
  setHeaders,
  get,
  post,
  put,
  del,
  patch,
};
