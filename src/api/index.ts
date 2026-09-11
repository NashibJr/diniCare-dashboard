import axios, { AxiosError, AxiosHeaders } from "axios";

axios.defaults.baseURL = "https://dinicare-backend.onrender.com/api/v1";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem("token");
    if (error.status === 401 && token !== null) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

interface ApiProps {
  url: string;
  data?: unknown;
  method: string;
  headers?: AxiosHeaders;
}

export default class Api {
  private api = async <T>({
    url,
    data,
    method,
    headers,
  }: ApiProps): Promise<T> => {
    try {
      const response = await axios.request<T>({
        url,
        method,
        data,
        headers,
      });

      return response.data;
    } catch (error) {
      console.log("Error", error);

      if (error instanceof AxiosError) {
        if (error.response) {
          return error.response.data;
        }

        return error.response as T;
      }

      return error as T;
    }
  };

  public post = async <T>(url: string, data?: unknown): Promise<T> =>
    await this.api<T>({ url, data, method: "POST" });

  public put = async <T>(url: string, data?: unknown): Promise<T> =>
    await this.api<T>({ url, data, method: "PUT" });

  public get = async <T>(url: string, headers?: AxiosHeaders): Promise<T> =>
    await this.api({ method: "GET", url, headers });

  public delete = async <T>(url: string, headers?: AxiosHeaders): Promise<T> =>
    await this.api({ method: "GET", url, headers });

  public patch = async <T>(url: string, data?: unknown): Promise<T> =>
    await this.api<T>({ url, data, method: "PATCH" });
}
