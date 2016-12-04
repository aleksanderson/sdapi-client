//FYI: WORK IN PROGRESS

import { 
  IDSThread,
  IDSAPIResponse
} from './interfaces';
import DSAPIRequest from './DSAPIRequest';

export default class DSThread implements IDSThread {

  private _request: DSAPIRequest;


  constructor() {

    //TEMPORAL

    this._request = new DSAPIRequest({
  "host": "",
  "user": "",
  "password": "",
  "version": ""
});

    //TEMPORAL

  }

  evaluate(thread: number, frame: number, expression: string): Promise<IDSAPIResponse> {
    return this._request.make({
      url: `/threads/${thread}/frames/${frame}/eval`,
      method: 'GET',
      qs: {
        expr: expression
      }
    });
  }

  getObjects(thread: number, frame: number, count?: number, path?: string, start?:number): Promise<IDSAPIResponse> {
    return this._request.make({
      url: `/threads/${thread}/frames/${frame}/members`,
      method: 'GET',
      qs: {
        object_path: path,
        start,
        count
      }
    })
  }

  //TODO: think about having a collection of threats in the current class as a property
  //...
  //private threads: Array<Threat> = []
  //
  // and calling all methods related to that on that Threat objects
  //...
  // debugger.activeThread.getObjects(count, path, start)
  // debugger.activeThread.stepInto()
  // debugger.activeThread.stepOver()
  //...  
  stepInto(thread: number): Promise<IDSAPIResponse> {
    return this._request.make({ url: '/threads/${thread}/into', method: 'POST' });
  }
 
  stepOut(thread: number): Promise<IDSAPIResponse> {
    return this._request.make({ url: '/threads/${thread}/out', method: 'POST' });
  }

  stepOver(thread: number): Promise<IDSAPIResponse> {
    return this._request.make({ url: '/threads/${thread}/over', method: 'POST' });
  }

  resume(thread: number): Promise<IDSAPIResponse> {
    return this._request.make({ url: '/threads/${thread}/resume', method: 'POST' });
  }

  stop(thread: number): Promise<IDSAPIResponse> {
    return this._request.make({ url: '/threads/${thread}/stop', method: 'POST' });
  }  
}