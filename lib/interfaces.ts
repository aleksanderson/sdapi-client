//TODO: remove generic response type is it's not needed
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

export interface ITrhead {
  //TODO: implement
}

export interface IDSDebugger {
  //TODO: implement
}

export interface IDSThread {
  //TODOL implement
}

export interface IDSDebugConfiguration {
  listen: boolean,
  interval: number
}

