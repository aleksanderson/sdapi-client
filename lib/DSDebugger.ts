import DSAPIRequest from './DSAPIRequest';
import { 
  IConnectionOptions,
  IDSAPIResponse,
  IBreakpoint
} from './interfaces';

export default class DSDebugger {
  
  private _request: DSAPIRequest;

  //TODO: think to remove a direct dependency to DSAPIRequest
  constructor(options: IConnectionOptions) {
    this._request = new DSAPIRequest(options);
  }

  /**
   * Session methods
   */

  createSession(): Promise<IDSAPIResponse> {
    return this._request.make({ url: '/client', method: 'POST'});
  }

  removeSession(): Promise<IDSAPIResponse> {
    return this._request.make({ url: '/client', method: 'DELETE'});
  }

  /**
   * Breakpoints methods
   */

  getBreakPoints(id?: number): Promise<IDSAPIResponse> {
    return this._request.make({ 
      url: '/breakpoints' + (typeof id != undefined ? `/${id}` : ''), 
      method: 'GET'
    });
  }

  setBreakPoint(breakpoints: Array<IBreakpoint>): Promise<IDSAPIResponse> {
    return this._request.make({ 
      url: '/breakpoints', 
      method: 'POST', 
      body: { breakpoints }  
    });
  }

  deleteBreakPoits(id?: number): Promise<IDSAPIResponse> {
    return this._request.make({
      url: '/breakpoints' + (typeof id != undefined ? `/${id}` : ''),
      method: 'DELETE'
    })
  }

  /**
   * Threads methods
   */

  //TODO: implement
}