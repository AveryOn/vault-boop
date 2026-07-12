import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

export type ApiErrorResponse = {
  message?: string
  code?: string
  errors?: unknown
}

export class HttpError extends Error {
  readonly status?: number
  readonly code?: string
  readonly errors?: unknown
  readonly original: unknown

  constructor(error: unknown) {
    const axiosError = error as AxiosError<ApiErrorResponse>

    super(
      axiosError.response?.data?.message ||
        axiosError.message ||
        'HTTP request failed',
    )

    this.name = 'HttpError'
    this.status = axiosError.response?.status
    this.code = axiosError.response?.data?.code
    this.errors = axiosError.response?.data?.errors
    this.original = error
  }
}

export type HttpClientOptions = {
  baseURL?: string
  timeout?: number
  withCredentials?: boolean
}

export class HttpClient {
  private readonly client: AxiosInstance

  constructor(options: HttpClientOptions = {}) {
    this.client = axios.create({
      baseURL: options.baseURL ?? '/api',
      timeout: options.timeout ?? 15000,
      withCredentials: options.withCredentials ?? true,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        throw new HttpError(error)
      },
    )
  }

  setAuthToken(token: string | null) {
    if (!token) {
      delete this.client.defaults.headers.common.Authorization
      return
    }

    this.client.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  async get<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response = await this.client.get<TResponse>(url, config)
    return this.unwrap(response)
  }

  async post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response = await this.client.post<TResponse>(url, body, config)
    return this.unwrap(response)
  }

  async put<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response = await this.client.put<TResponse>(url, body, config)
    return this.unwrap(response)
  }

  async patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response = await this.client.patch<TResponse>(
      url,
      body,
      config,
    )
    return this.unwrap(response)
  }

  async delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response = await this.client.delete<TResponse>(url, config)
    return this.unwrap(response)
  }

  private unwrap<TResponse>(
    response: AxiosResponse<TResponse>,
  ): TResponse {
    return response.data
  }
}

export const httpClient = new HttpClient({
  baseURL: import.meta.env.PUBLIC_API_URL ?? '/api',
})
