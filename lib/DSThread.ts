import { 
  IDSThread,
  IEvaluateResult,
  IObjectMembers
} from './interfaces';
import DSAPIRequest from './DSAPIRequest';

export default class DSThread {

  private readonly REFRESH_THREAD_INTERVAL: number = 55 * 1000;
  private _request: DSAPIRequest;
  private _thread: IDSThread;

  constructor(thread: IDSThread) {
    this._request = DSAPIRequest.getInstance();
    this._thread = thread;

    this.refreshThreatTimeout();
  }

  evaluate(frame: number, expression: string): Promise<IEvaluateResult> {
    return this._request.make({
      url: `/threads/${this._thread.id}/frames/${frame}/eval`,
      method: 'GET',
      qs: {
        expr: expression
      }
    });
  }

  getObjectMembers(frame: number, count?: number, path?: string, start?:number): Promise<IObjectMembers> {
    return this._request.make({
      url: `/threads/${this._thread.id}/frames/${frame}/members`,
      method: 'GET',
      qs: {
        object_path: path,
        start,
        count
      }
    })
  }

  stepInto(): Promise<void> {
    return this._request.make({ url: '/threads/${this._thread.id}/into', method: 'POST' });
  }
  
  stepOut(): Promise<void> {
    return this._request.make({ url: '/threads/${this._thread.id}/out', method: 'POST' });
  }

  stepOver(): Promise<void> {
    return this._request.make({ url: '/threads/${this._thread.id}/over', method: 'POST' });
  }

  resume(): Promise<void> {
    return this._request.make({ url: '/threads/${this._thread.id}/resume', method: 'POST' });
  }

  stop(): Promise<void> {
    return this._request.make({ url: '/threads/${this._thread.id}/stop', method: 'POST' });
  }  

  /**
   * Private methods
   */

  private refreshThreatTimeout(): void {
    let tick = () => {
      setTimeout(() => {
        this._request.make({ url: '/threads/reset', method: 'POST' })
          .then(() => tick());
      }, this.REFRESH_THREAD_INTERVAL);
    };
    tick();
  }
}