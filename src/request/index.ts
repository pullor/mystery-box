import axios, { AxiosRequestConfig, AxiosRequestTransformer, AxiosResponse, Method } from 'axios'
import { Toast } from 'vant'

const requestSet = new Set<number>()

axios.defaults.timeout = 2000

const Axios: AxiosRequestTransformer = axios

export interface ParamOption {
  load?: boolean // 接口请求过程中 是否显示 load
  loadNoClose?: boolean // load true的情况下    请求完成也不关闭load
  successMsg?: string | boolean // 请求成功 提示信息  默认false不提示  string:'信息'   true：显示后端信息
  errorMsg?: boolean | string // 错误信息   默认true 显示后端错误信息,  string:信息    false 不提示
  blob?: boolean // 后端传输二进制数据
  error?: (errorText: string) => void
  finally?: () => void
}

export interface ErrorResponse {
  code: number
  description: string
  msg: string
  traceId: string
}

export function GET(url: string, params?: any, options?: ParamOption) {
  return fetch(url, 'get', params, options)
}

export function POST(url: string, params?: any, options?: ParamOption) {
  return fetch(url, 'post', params, options)
}

export function DELETE(url: string, params?: any, options?: ParamOption) {
  return fetch(url, 'delete', params, options)
}

export function PATCH(url: string, params?: any, options?: ParamOption) {
  return fetch(url, 'patch', params, options)
}

export function PUT(url: string, params?: any, options?: ParamOption) {
  return fetch(url, 'put', params, options)
}

interface Response {
  data: any
  code: number
  msg: string
}

function fetch(
  url: string,
  method: Method,
  params?: any,
  option: ParamOption = <ParamOption>{}
) {
  let timestamp = 0
  if (
    //用来判断一个属性是定义在对象本身而不是继承自原型链。
    // loadNoClose?: boolean; // load true的情况下    请求完成也不关闭load
    (option.load || !Object.prototype.hasOwnProperty.call(option, 'load')) &&
    !option.loadNoClose
  ) {
    timestamp = Date.now()
    requestSet.add(timestamp)
    Toast.loading({
      duration: 0,
      forbidClick: true
    })
  }
  //定义request对象
  const request: AxiosRequestConfig = {
    method: method,
    url: url,
    headers: {}
  }
  if (/get/i.test(method)) {
    request.params = params
  } else {
    request.data = params
  }
  if (option.blob) {
    request.responseType = 'blob'
  }
  return Axios(request)
    .then((res: AxiosResponse): Response | Promise<void> | void => {
      requestSet.delete(timestamp)

      // 所有请求都完成后再关闭Loading
      if (timestamp && !requestSet.size && !option.loadNoClose) {
        Toast.clear()
      }
      if (res.data.code === 400) {
        option.finally && option.finally()
      }
      return res.data
    })
    .catch((err: any) => {
      const response = err.response
      requestSet.delete(timestamp)
      if (timestamp && !requestSet.size && !option.loadNoClose) {
        Toast.clear()
      }
      const errorMsg: string =
        option.errorMsg ||
        (response && response.msg) ||
        response.data?.msg ||
        codeError(response.status) ||
        response.statusText ||
        '未知错误'
      if (option.errorMsg !== false) {
        Toast.fail(errorMsg)
      }
      option.error && option.error(response)

      return Promise.reject(false)
    })
}

function codeError(code: number): string | undefined {
  switch (code) {
    case 404:
      return '404找不到'
    case 401:
      return '登录已过期'
    case 500:
    case 502:
    case 504:
      return '服务器错误'
  }
}
