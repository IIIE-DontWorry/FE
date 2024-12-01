import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

const BASE_URL = 'http://52.78.188.251/'; // API 서버의 기본 URL

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 요청 타임아웃 설정 (ms 단위)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  error => {
    if (error.response) {
      console.error('API Response Error:', error.response);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  },
);
// API 함수들
const ApiService = {
  // GET 요청
  async get<T>(url: string, params?: object, headers?: object): Promise<T> {
    const response = await api.get(url, {params, headers});
    return response.data;
  },

  // POST 요청
  async post<T>(url: string, data?: object, headers?: object): Promise<T> {
    const response = await api.post(url, data, {headers});
    return response.data;
  },

  // PUT 요청
  async put<T>(url: string, data?: object, headers?: object): Promise<T> {
    const response = await api.put(url, data, {headers});
    return response.data;
  },

  // PATCH 요청
  async patch<T>(url: string, data?: object, headers?: object): Promise<T> {
    const response = await api.patch(url, data, {headers});
    return response.data;
  },

  // DELETE 요청
  async delete<T>(url: string, headers?: object): Promise<T> {
    const response = await api.delete(url, {headers});
    return response.data;
  },

  // DELETE 요청에 데이터 포함 가능하게 설정
  async deleteWithBody<T>(
    url: string,
    data?: object,
    headers?: object,
  ): Promise<T> {
    const response = await api.request({
      method: 'DELETE',
      url,
      data,
      headers,
    });
    return response.data;
  },
};

export default ApiService;
