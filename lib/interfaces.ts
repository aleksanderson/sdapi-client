//TODO: finish the interface for the generic API response

export interface IDSAPIResponse {
  errorType?: string,
  errorMessage?: string,
  //????????
  data?: IBreakpoint | Array<IBreakpoint> 
}

export interface IDSAPIRequest {
  url: string,
  method: 'GET' | 'POST' | 'HEAD' | 'DELETE', 
  qs?: Object,       
  body?: Object
}

export interface IConnectionOptions {
  host: string,
  user: string,
  password: string,
  version: string
}

export interface IBreakpoint {
  id?: string,
  line_number: number,
  script_path: string
}



