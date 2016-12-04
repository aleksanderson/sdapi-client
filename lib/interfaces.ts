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

export interface IDSDebugConfiguration {
  listen: boolean,
  interval: number
}

export interface IBreakpoint {
  id?: string,
  line_number: number,
  script_path: string
}

export interface IDSThread {
  id?: string,
  status: string, //halted, active
  call_stack: Object[]
}

export interface IEvaluateResult {
  expression: string,
  result: any
}

export interface IObjectMembers {
  object_members: Object[]
}


